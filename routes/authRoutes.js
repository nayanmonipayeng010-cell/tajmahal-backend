import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";
import passport from "passport";
import jwt from "jsonwebtoken";

const router = express.Router();

// 🧠 Local register/login
router.post("/register", registerUser);
router.post("/login", loginUser);

// 🌍 Google OAuth
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "http://localhost:5173/login" }),
  (req, res) => {
    const token = jwt.sign({ email: req.user.email }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.redirect(`http://localhost:5173/login?token=${token}`);
  }
);

export default router;
