import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../utils/api"; // ✅ backend online

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const redirect =
        new URLSearchParams(location.search).get("redirect");

    const submit = async () => {
        try {
            const res = await api.post("/api/auth/login", {
                email,
                password
            });

            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user", JSON.stringify(res.data.user));

            // ✅ THÊM DÒNG NÀY (QUAN TRỌNG)
            localStorage.setItem("role", res.data.user.role);

            if (res.data.user.role === "admin") {
                navigate("/admin");
            } else {
                navigate(redirect ? `/${redirect}` : "/");
            }

        } catch (err) {
            alert(err.response?.data?.message || "Đăng nhập thất bại");
        }
    };


    return (
        <div className="login-page">
            <div className="login-card">
                <h2>Đăng nhập</h2>

                <div className="input-group">
                    <input
                        type="email"
                        placeholder="Email"
                        onChange={e => setEmail(e.target.value)}
                    />
                </div>

                <div className="input-group">
                    <input
                        type="password"
                        placeholder="Mật khẩu"
                        onChange={e => setPassword(e.target.value)}
                    />
                </div>

                <button className="btn-login" onClick={submit}>
                    Đăng nhập
                </button>

                <p className="login-footer">
                    Chưa có tài khoản?{" "}
                    <span onClick={() => navigate("/register")}>
                        Đăng ký
                    </span>
                </p>
            </div>
        </div>
    );
}

export default Login;
