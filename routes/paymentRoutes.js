// backend/routes/paymentRoutes.js
import express from "express";
import { createOrder, verifyPayment } from "../controllers/paymentController.js";

const router = express.Router();

router.post("/order", createOrder);
router.post("/verify", verifyPayment); // optional, for later

export default router;
