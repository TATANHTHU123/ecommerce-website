import express from "express";
import Order from "../models/Order.js";
import { protect, admin } from "../middleware/auth.js";

const router = express.Router();

// 📌 GET all orders (⭐ đã chỉnh để lấy thêm phone + trạng thái đầy đủ)
router.get("/", protect, admin, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "name email phone")   // ⭐ LẤY THÊM THÔNG TIN USER
      .sort({ createdAt: -1 });                // ⭐ SẮP XẾP MỚI NHẤT ĐỨNG TRÊN

    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// 🛠 UPDATE order status (⭐ đã chỉnh để tránh lỗi userId required)
router.put("/:id", protect, admin, async (req, res) => {
  try {
    const updated = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: false }   // ⭐ KHÔNG validate lại => KHÔNG LỖI userId
    )
      .populate("userId", "name email phone"); // ⭐ SAU KHI UPDATE TRẢ VỀ LUÔN USER

    if (!updated) return res.status(404).json({ message: "Order not found" });

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Update failed" });
  }
});

export default router;
