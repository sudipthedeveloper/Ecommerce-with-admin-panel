import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  orderId: {
    type: String,
    required: [true, "Provide orderId"],
    unique: true
  },
  productId: {
    type: mongoose.Schema.ObjectId,
    ref: "product"
  },
  product_details: {
    name: String,
    image: Array,
  },
  // Enhanced payment fields for Razorpay
  paymentId: {
    type: String,
    default: ""
  },
  razorpay_order_id: {
    type: String,
    default: ""
  },
  razorpay_payment_id: {
    type: String,
    default: ""
  },
  razorpay_signature: {
    type: String,
    default: ""
  },
  payment_method: {
    type: String,
    enum: ["razorpay", "CASH ON DELIVERY", "other"],
    default: ""
  },
  payment_status: {
    type: String,
    enum: ["pending", "completed", "failed", "refunded"],
    default: "pending"
  },
  delivery_address: {
    type: mongoose.Schema.ObjectId,
    ref: 'address'
  },
  subTotalAmt: {
    type: Number,
    default: 0
  },
  totalAmt: {
    type: Number,
    default: 0
  },
  invoice_receipt: {
    type: String,
    default: ""
  }
}, {
  timestamps: true
})

const OrderModel = mongoose.model('order', orderSchema)
export default OrderModel
