import api from "../utils/api"; // ✅ dùng api chung
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    // chỉ cho nhập số ở phone
    if (name === "phone" && !/^\d*$/.test(value)) return;

    setForm({ ...form, [name]: value });
  };

  const submit = async () => {
    const { name, email, phone, password } = form;

    if (!name || !email || !phone || !password) {
      alert("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    try {
      await api.post("/api/auth/register", form); // ✅ bỏ localhost
      alert("Đăng ký thành công 🎉");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Đăng ký thất bại");
    }
  };

  return (
    <div className="register-page">
      <div className="register-card">
        <h2>Đăng ký tài khoản</h2>

        <input
          name="name"
          placeholder="Họ và tên"
          onChange={handleChange}
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          onChange={handleChange}
        />

        <input
          name="phone"
          placeholder="Số điện thoại"
          onChange={handleChange}
        />

        <input
          name="password"
          type="password"
          placeholder="Mật khẩu"
          onChange={handleChange}
        />

        <button className="btn-register" onClick={submit}>
          Đăng ký
        </button>

        <p className="register-footer">
          Đã có tài khoản?{" "}
          <span onClick={() => navigate("/login")}>Đăng nhập</span>
        </p>
      </div>
    </div>
  );
}

export default Register;
