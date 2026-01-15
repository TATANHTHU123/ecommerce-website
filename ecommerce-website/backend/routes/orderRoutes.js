import express from "express";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/", protect, async (req, res) => {
  try {
    const { items, customer } = req.body;
    const userId = req.user._id; // 🔥 lấy userId từ token

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    if (!customer?.name || !customer?.phone || !customer?.address) {
      return res.status(400).json({ message: "Thiếu thông tin khách hàng" });
    }

    let total = 0;
    const orderItems = [];

    for (let item of items) {
      const product = await Product.findById(item.productId);
      if (!product) return res.status(404).json({ message: "Product not found" });

      //if (product.countInStock < item.qty)
      //  return res.status(400).json({ message: `Sản phẩm ${product.name} không đủ hàng` });

      total += product.price * item.qty;

      orderItems.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        qty: item.qty,
        image: product.image,
      });
    }
    // ❌ KHÔNG TRỪ KHO NỮA
    // for (let item of orderItems) {
    //   await Product.findByIdAndUpdate(item.productId, {
    //     $inc: { countInStock: -item.qty },
    //   });
    // }


    const order = new Order({
      userId,       // ⭐ THÊM userId vào DB
      items: orderItems,
      total,
      customer,
    });

    const created = await order.save();
    res.status(201).json(created);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// 🎯 Get orders by user
router.get("/:userId", async (req, res) => {
  const orders = await Order.find({ userId: req.params.userId }).sort({ createdAt: -1 });
  res.json(orders);
});

export default router;
