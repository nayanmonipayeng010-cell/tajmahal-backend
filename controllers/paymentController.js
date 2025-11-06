// backend/controllers/paymentController.js
import crypto from "crypto";
import razorpay from "../config/razorpay.js";

export const createOrder = async (req, res) => {
  try {
    const { amount, currency = "INR", receipt } = req.body;

    if (!amount) {
      return res.status(400).json({ success: false, message: "amount is required" });
    }

    const options = {
      amount: Number(amount) * 100, // amount in paise
      currency,
      receipt: receipt || `rcpt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    return res.status(200).json({ success: true, order });
  } catch (err) {
    console.error("Razorpay order error:", err);
    return res.status(500).json({ success: false, message: "Failed to create order" });
  }
};

// (Optional) verify payment signature after success (if you use it later)
export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const sign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (sign === razorpay_signature) {
      return res.status(200).json({ success: true, message: "Payment verified" });
    }
    return res.status(400).json({ success: false, message: "Invalid signature" });
  } catch (err) {
    console.error("Verify error:", err);
    return res.status(500).json({ success: false, message: "Verification failed" });
  }
};
