import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const redirect =
        new URLSearchParams(location.search).get("redirect");

    const submit = async () => {
        try {
            const res = await axios.post("http://localhost:5000/api/auth/login", {
                email,
                password
            });

            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user", JSON.stringify(res.data.user));

            if (res.data.user.role === "admin") {
                navigate("/admin");
            } else {
                navigate(redirect ? `/${redirect}` : "/");
            }

        } catch (err) {
            alert(err.response.data.message);
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
