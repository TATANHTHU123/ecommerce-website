import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js"; // ⚠️ PHẢI có .js
const router = express.Router();


router.post("/register", async (req, res) => {
    try {
        const { name, phone, email, password } = req.body;

        if (!name || !phone || !email || !password) {
            return res.status(400).json({ message: "Không được để trống" });
        }

        const exists = await User.findOne({
            $or: [{ email }, { phone }, { name }]
        });

        if (exists) {
            return res.status(400).json({
                message: "Tên / Email / SĐT đã tồn tại"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            phone,
            email,
            password: hashedPassword
        });

        res.status(201).json({
            message: "Đăng ký thành công",
            userId: user._id
        });

    } catch (err) {
        console.error("REGISTER ERROR:", err);
        res.status(500).json({
            message: err.message,
            error: err
        });
    }
});
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Thiếu thông tin" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Sai email hoặc mật khẩu" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Sai email hoặc mật khẩu" });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                role: user.role
            }
        });
    } catch (err) {
        console.error("LOGIN ERROR:", err);
        res.status(500).json({ message: "Server error" });
    }
});

export default router;
