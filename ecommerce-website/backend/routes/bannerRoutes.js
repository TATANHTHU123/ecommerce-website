import express from "express";
import Banner from "../models/Banner.js";
import { protect, admin } from "../middleware/auth.js";
import multer from "multer";

const router = express.Router();

// upload ảnh
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/");
  },
  filename(req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// GET all banners (PUBLIC)
router.get("/", async (req, res) => {
  const banners = await Banner.find().sort({ createdAt: -1 });
  res.json(banners);
});

// ADD banner (ADMIN)
router.post("/", protect, admin, upload.single("image"), async (req, res) => {
  const banner = new Banner({
    image: `/uploads/${req.file.filename}`,
  });

  const created = await banner.save();
  res.status(201).json(created);
});

// DELETE banner (ADMIN)
router.delete("/:id", protect, admin, async (req, res) => {
  await Banner.findByIdAndDelete(req.params.id);
  res.json({ message: "Banner deleted" });
});

export default router;
