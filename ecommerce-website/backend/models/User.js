import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true, // ❗ bắt trùng tên
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /^\S+@\S+\.\S+$/ // ❗ đúng định dạng gmail
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      match: /^[0-9]+$/ // ❗ chỉ số
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ["admin", "customer"],
      default: "customer"
    }
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);


