// config/razorpay.js
import Razorpay from "razorpay";
console.log(process.env.RAZORPAY_KEY_ID)
export const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_APT_SECRET
});
