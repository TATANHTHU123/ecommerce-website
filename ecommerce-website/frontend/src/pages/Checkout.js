import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import api from "../utils/api"; // ✅ dùng backend online

function Checkout() {
    const navigate = useNavigate();
    const { cart, setCart } = useContext(CartContext);

    const [customer, setCustomer] = useState({
        name: "",
        phone: "",
        address: ""
    });

    const submitOrder = async () => {
        if (!customer.name || !customer.phone || !customer.address) {
            alert("Vui lòng nhập đủ thông tin");
            return;
        }

        const user = JSON.parse(localStorage.getItem("user"));
        const token = localStorage.getItem("token");

        if (!user || !token) {
            alert("Bạn chưa đăng nhập!");
            navigate("/login");
            return;
        }

        try {
            const orderData = {
                items: cart.map(item => ({
                    productId: item._id,
                    qty: Number(item.qty) || 1
                })),
                customer
            };

            await api.post("/api/orders", orderData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            alert("Đặt hàng thành công 🎉");
            setCart([]);
            localStorage.removeItem("cart");
            navigate("/orders");

        } catch (err) {
            alert(err.response?.data?.message || "Đặt hàng thất bại");
            console.error(err);
        }
    };

    return (
        <div className="checkout">
            {/* ⬅️ NÚT BACK */}
            <button className="btn-back" onClick={() => navigate("/cart")}>
                ⬅ Quay lại giỏ hàng
            </button>

            <h2>Thông tin giao hàng</h2>

            <input
                placeholder="Tên"
                onChange={e => setCustomer({ ...customer, name: e.target.value })}
            />
            <input
                placeholder="SĐT"
                onChange={e => setCustomer({ ...customer, phone: e.target.value })}
            />
            <input
                placeholder="Địa chỉ"
                onChange={e => setCustomer({ ...customer, address: e.target.value })}
            />

            <button className="btn" onClick={submitOrder}>
                Đặt hàng (COD)
            </button>
        </div>
    );
}

export default Checkout;
