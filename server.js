// backend/server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import passport from "./config/passport.js";
import authRoutes from "./routes/authRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";

dotenv.config();
connectDB();

const app = express();

// CORS: allow your frontend origin
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.use(express.json());
app.use(passport.initialize());

// Health check
app.get("/", (_req, res) => res.send("Tajmahal Backend OK"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/payment", paymentRoutes);

const PORT = process.env.PORT || 5007;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
