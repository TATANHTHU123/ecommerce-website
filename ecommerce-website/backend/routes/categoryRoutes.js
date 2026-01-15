import express from "express";
import Category from "../models/Category.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// ✅ Get all categories
router.get("/", async (req, res) => {
  const categories = await Category.find().sort({ createdAt: -1 });
  res.json(categories);
});

// ✅ Create category
router.post("/", protect, async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: "Tên category không được để trống" });

  const exist = await Category.findOne({ name });
  if (exist) return res.status(400).json({ message: "Category đã tồn tại" });

  const category = await Category.create({ name });
  res.status(201).json(category);
});

// ✅ Delete category
router.delete("/:id", protect, async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);
  res.json({ message: "Đã xoá category" });
});

export default router;
