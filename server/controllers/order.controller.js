import crypto from "crypto";
import mongoose from "mongoose";
import { instance } from "../config/razorpay.js";
import CartProductModel from "../models/cartproduct.model.js";
import OrderModel from "../models/order.model.js";
import UserModel from "../models/user.model.js";

// Helper function to calculate price with discount
export const priceWithDiscount = (price, discountPercentage = 0) => {
    const discountAmount = Math.ceil((Number(price) * Number(discountPercentage)) / 100);
    const actualPrice = Number(price) - Number(discountAmount);
    return actualPrice;
};

// Improved helper function to create order items from cart
const getOrderProductItems = async({
    cartItems,
    userId,
    addressId,
    paymentId = "",
    razorpay_order_id = "",
    razorpay_signature = "",
    payment_method,
    payment_status,
}) => {
    try {
        const productList = [];
        let subTotalSum = 0;
        let totalAmtSum = 0;

        // First calculate the overall totals
        for (const item of cartItems) {
            const itemPrice = item.productId.price * item.quantity;
            subTotalSum += itemPrice;

            // Apply discount if available
            const discountPercentage = item.productId.discount || 0;
            const discountedPrice = priceWithDiscount(itemPrice, discountPercentage);
            totalAmtSum += discountedPrice;
        }

        // Create each order item with the correct totals
        for (const item of cartItems) {
            const payload = {
                userId: userId,
                orderId: `ORD-${new mongoose.Types.ObjectId()}`,
                productId: item.productId._id,
                product_details: {
                    name: item.productId.name,
                    image: item.productId.image || []
                },
                quantity: item.quantity,
                paymentId: paymentId,
                razorpay_order_id: razorpay_order_id,
                razorpay_payment_id: paymentId,
                razorpay_signature: razorpay_signature,
                payment_method: payment_method,
                payment_status: payment_status,
                delivery_address: addressId,
                // Use the calculated total amounts
                subTotalAmt: subTotalSum,
                totalAmt: totalAmtSum,
            };
            productList.push(payload);
        }

        return productList;
    } catch (error) {
        console.error("Error creating order items:", error);
        throw new Error("Failed to create order items: " + error.message);
    }
};

// Cash On Delivery order controller
export async function CashOnDeliveryOrderController(request, response) {
    try {
        const userId = request.userId;
        const { addressId } = request.body;

        // Fetch cart items to calculate totals
        const cartItems = await CartProductModel.find({ userId: userId }).populate('productId');

        if (!cartItems || cartItems.length === 0) {
            return response.status(400).json({
                message: "No items in cart",
                error: true,
                success: false
            });
        }

        // Create order items
        const orderProduct = await getOrderProductItems({
            cartItems: cartItems,
            userId: userId,
            addressId: addressId,
            payment_method: "CASH ON DELIVERY",
            payment_status: "pending"
        });

        // Save orders
        const generatedOrder = await OrderModel.insertMany(orderProduct);

        // Remove from the cart
        await CartProductModel.deleteMany({ userId: userId });
        await UserModel.findByIdAndUpdate(userId, { shopping_cart: [] });

        return response.json({
            message: "Order placed successfully",
            error: false,
            success: true,
            data: generatedOrder
        });
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

// Create Razorpay payment order
export const paymentController = async (req, res) => {
    try {
        const { addressId } = req.body;
        const userId = req.userId;

        // Fetch cart items to calculate totals
        const cartItems = await CartProductModel.find({ userId: userId }).populate('productId');

        if (!cartItems || cartItems.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No items in cart"
            });
        }

        // Calculate total amount
        let totalAmt = 0;
        for (const item of cartItems) {
            const itemPrice = item.productId.price * item.quantity;
            const discountPercentage = item.productId.discount || 0;
            const discountedPrice = priceWithDiscount(itemPrice, discountPercentage);
            totalAmt += discountedPrice;
        }

        // Create Razorpay order
        const options = {
            amount: Math.round(totalAmt * 100), // Razorpay accepts amount in paise
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
            notes: {
                userId: userId.toString(),
                addressId: addressId.toString(),
                totalAmt: totalAmt.toString() // Store total amount in notes for reference
            }
        };

        const order = await instance.orders.create(options);

        if (!order) {
            return res.status(500).json({
                success: false,
                message: "Failed to create Razorpay order"
            });
        }

        return res.status(200).json({
            success: true,
            order
        });
    } catch (error) {
        console.error("Error in paymentController:", error);
        return res.status(500).json({
            success: false,
            message: "Error creating payment order",
            error: error.message
        });
    }
};

// Verify Razorpay payment
export const verifyPaymentController = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, addressId } = req.body;
        const userId = req.userId;

        // Verify payment signature
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        console.log("Verification body:", body);

        // Make sure the environment variable is named correctly
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_APT_SECRET)
            .update(body)
            .digest("hex");

        console.log("Expected signature:", expectedSignature);
        console.log("Received signature:", razorpay_signature);

        const isAuthentic = expectedSignature === razorpay_signature;

        if (!isAuthentic) {
            return res.status(400).json({
                success: false,
                message: "Payment verification failed"
            });
        }

        // Get payment details from Razorpay
        const paymentDetails = await instance.payments.fetch(razorpay_payment_id);

        // Get order notes (metadata)
        const order = await instance.orders.fetch(razorpay_order_id);
        const orderUserId = order.notes.userId;
        const orderAddressId = order.notes.addressId || addressId;

        // Verify user
        if (orderUserId !== userId.toString()) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized payment request"
            });
        }

        // Get user's cart items
        const cartItems = await CartProductModel.find({ userId: userId }).populate('productId');

        if (!cartItems || cartItems.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No items in cart"
            });
        }

        console.log("payment", paymentDetails);

        // Create order items with fixed function
        const orderProduct = await getOrderProductItems({
            cartItems: cartItems,
            userId: userId,
            addressId: orderAddressId,
            paymentId: razorpay_payment_id,
            razorpay_order_id: razorpay_order_id,
            razorpay_signature: razorpay_signature,
            payment_method: "razorpay",
            payment_status: paymentDetails.status === "captured" ? "completed" : "pending"
        });

        console.log("Order products created:", orderProduct);

        // Save orders
        const savedOrder = await OrderModel.insertMany(orderProduct);

        if (savedOrder.length > 0) {
            // Clear cart
            await UserModel.findByIdAndUpdate(userId, { shopping_cart: [] });
            await CartProductModel.deleteMany({ userId: userId });

            return res.status(200).json({
                success: true,
                message: "Payment successful and order placed",
                order: savedOrder
            });
        } else {
            return res.status(400).json({
                success: false,
                message: "Failed to place order"
            });
        }
    } catch (error) {
        console.error("Error in verifyPaymentController:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

// Razorpay webhook handler
export const webhookRazorpay = async (req, res) => {
    try {
        const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
        const shasum = crypto.createHmac('sha256', webhookSecret);
        shasum.update(JSON.stringify(req.body));
        const digest = shasum.digest('hex');

        // Verify webhook signature
        if (digest === req.headers['x-razorpay-signature']) {
            console.log('Webhook verified');
            const event = req.body;

            // Handle different webhook events
            switch (event.event) {
                case 'payment.authorized':
                    console.log('Payment authorized:', event.payload.payment.entity);
                    break;

                case 'payment.captured':
                    const payment = event.payload.payment.entity;

                    // Check if order exists
                    const existingOrder = await OrderModel.findOne({
                        razorpay_payment_id: payment.id
                    });

                    if (!existingOrder) {
                        // Get order details from Razorpay
                        const order = await instance.orders.fetch(payment.order_id);
                        const userId = order.notes.userId;
                        const addressId = order.notes.addressId;

                        // Retrieve cart items for this user
                        const cartItems = await CartProductModel.find({ userId: userId }).populate('productId');

                        if (cartItems && cartItems.length > 0) {
                            // Create orders
                            const orderProduct = await getOrderProductItems({
                                cartItems: cartItems,
                                userId: userId,
                                addressId: addressId,
                                paymentId: payment.id,
                                razorpay_order_id: payment.order_id,
                                razorpay_signature: "",
                                payment_method: "razorpay",
                                payment_status: "completed"
                            });

                            await OrderModel.insertMany(orderProduct);

                            // Clear cart
                            await UserModel.findByIdAndUpdate(userId, { shopping_cart: [] });
                            await CartProductModel.deleteMany({ userId: userId });
                        }
                    } else {
                        // Update existing order
                        await OrderModel.updateMany(
                            { razorpay_payment_id: payment.id },
                            { payment_status: "completed" }
                        );
                    }
                    break;

                case 'payment.failed':
                    console.log('Payment failed:', event.payload.payment.entity);
                    const failedPayment = event.payload.payment.entity;

                    // Update any orders with this payment ID
                    await OrderModel.updateMany(
                        { razorpay_payment_id: failedPayment.id },
                        { payment_status: "failed" }
                    );
                    break;

                default:
                    console.log(`Unhandled event type ${event.event}`);
            }

            return res.status(200).json({ received: true });
        } else {
            // Invalid signature
            return res.status(401).json({ received: false });
        }
    } catch (error) {
        console.error("Error in webhookRazorpay:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

// Get order details
export async function getOrderDetailsController(request, response) {
    try {
        const userId = request.userId;
        const orderlist = await OrderModel.find({ userId: userId })
            .sort({ createdAt: -1 })
            .populate('delivery_address');

        return response.json({
            message: "Order list retrieved",
            data: orderlist,
            error: false,
            success: true
        });
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}
