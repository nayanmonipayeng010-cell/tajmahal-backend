import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ success: false, message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
    });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user)
      return res.status(400).json({ success: false, message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ success: false, message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({
      success: true,
      message: "Login successful",
      token,
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
