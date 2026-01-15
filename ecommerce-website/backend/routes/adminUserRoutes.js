import express from "express";
import User from "../models/User.js";
import { protect, admin } from "../middleware/auth.js";

const router = express.Router();

// Lấy danh sách user có role customer
router.get("/customers", protect, admin, async (req, res) => {
  console.log("Admin request user:", req.user.email); // debug
  try {
    const customers = await User.find({ role: "customer" }).select("-password");
    res.json(customers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
