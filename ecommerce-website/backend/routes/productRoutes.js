const express = require("express");
const Product = require("../models/Product");
const { protect, admin } = require("../middleware/auth");   // ⭐ THÊM BẢO VỆ
const multer = require("multer");  // ⭐ THÊM MULTER
const fs = require("fs");
const path = require("path");

const router = express.Router();

// 📌 SETUP UPLOAD ẢNH
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/");
  },
  filename(req, file, cb) {
    cb(null, file.originalname); // ✅ giữ nguyên tên file
  }
});


const upload = multer({ storage });

// ======================================================
// 🛒 ADMIN CREATE PRODUCT (Có upload ảnh)
// ======================================================
router.post("/", protect, admin, upload.single("image"), async (req, res) => {
  try {
    const newProduct = new Product({
      name: req.body.name,
      price: req.body.price,
      category: req.body.category,
      description: req.body.description, // ⭐ BẮT BUỘC
      image: req.file ? `/uploads/${req.file.filename}` : req.body.image
    });

    const created = await newProduct.save();
    res.status(201).json(created);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Create product failed" });
  }
});

// ======================================================
// 🧾 READ ALL + SEARCH
// ======================================================
router.get("/", async (req, res) => {
  const keyword = req.query.keyword
    ? { name: { $regex: req.query.keyword, $options: "i" } }
    : {};

  const products = await Product.find({ ...keyword });
  res.json(products);
});

// ======================================================
// 🧾 READ ONE
// ======================================================
router.get("/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);
  res.json(product);
});

// ======================================================
// ✏️ UPDATE PRODUCT
// ======================================================
router.put("/:id", protect, admin, upload.single("image"), async (req, res) => {
  const updateData = {
    name: req.body.name,
    price: req.body.price,
    category: req.body.category,
    description: req.body.description, // ⭐ BẮT BUỘC
  };


  // Nếu người dùng upload ảnh mới → đổi ảnh
  if (req.file) {
    updateData.image = `/uploads/${req.file.filename}`;
  }

  const updated = await Product.findByIdAndUpdate(
    req.params.id,
    updateData,
    { new: true }
  );

  res.json(updated);
});

// ======================================================
// ❌ DELETE PRODUCT
// ======================================================
router.delete("/:id", protect, admin, async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

module.exports = router;
