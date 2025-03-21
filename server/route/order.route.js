// router.js
import { Router } from 'express';
import {
  CashOnDeliveryOrderController,
  getOrderDetailsController,
  paymentController,
  verifyPaymentController,
  webhookRazorpay
} from '../controllers/order.controller.js';
import auth from '../middleware/auth.js';

const orderRouter = Router();

// Order creation routes
orderRouter.post("/cash-on-delivery", auth, CashOnDeliveryOrderController);
orderRouter.post('/checkout', auth, paymentController);

// Payment verification route
orderRouter.post('/verify-payment', auth, verifyPaymentController);

// Webhook route (no auth middleware as it's called by Razorpay)
orderRouter.post('/webhook', webhookRazorpay);

// Order retrieval route
orderRouter.get("/order-list", auth, getOrderDetailsController);

export default orderRouter;

// razorpay.js (config file)
