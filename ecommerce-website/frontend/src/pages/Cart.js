import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { Link } from "react-router-dom";
import api from "../utils/api"; // ✅ dùng backend online

function Cart() {
    const { cart, setCart } = useContext(CartContext);
    const BASE_URL = api.defaults.baseURL; // ✅ lấy baseURL backend

    const increase = (id) => {
        const newCart = cart.map(item =>
            item._id === id ? { ...item, qty: item.qty + 1 } : item
        );
        setCart(newCart);
        localStorage.setItem("cart", JSON.stringify(newCart));
    };

    const decrease = (id) => {
        const newCart = cart
            .map(item =>
                item._id === id ? { ...item, qty: item.qty - 1 } : item
            )
            .filter(item => item.qty > 0);

        setCart(newCart);
        localStorage.setItem("cart", JSON.stringify(newCart));
    };

    const removeItem = (id) => {
        const newCart = cart.filter(item => item._id !== id);
        setCart(newCart);
        localStorage.setItem("cart", JSON.stringify(newCart));
    };

    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

    if (cart.length === 0) {
        return (
            <div className="cart-page">
                <h2 style={{ textAlign: "center" }}>Giỏ hàng trống 🛒</h2>
                <Link to="/" className="btn-back-home">⬅ Quay lại mua hàng</Link>
            </div>
        );
    }

    return (
        <div className="cart-page">
            <h2>Giỏ hàng</h2>

            {/* 🔙 Nút quay lại */}
            <Link to="/" className="btn-back-home">⬅ Quay lại mua hàng</Link>

            {cart.map(item => (
                <div className="cart-item" key={item._id}>
                    <img
                        src={
                            item.image?.startsWith("http")
                                ? item.image
                                : `${BASE_URL}${item.image}` // ✅ FIX localhost
                        }
                        alt={item.name}
                        onError={(e) => (e.target.src = "/no-image.png")}
                    />

                    <div>
                        <h4>{item.name}</h4>

                        <p>
                            {item.price.toLocaleString()} VND × {item.qty} =
                            <b> {(item.price * item.qty).toLocaleString()} VND</b>
                        </p>

                        <button onClick={() => decrease(item._id)}>-</button>
                        <span>{item.qty}</span>
                        <button onClick={() => increase(item._id)}>+</button>
                        <button onClick={() => removeItem(item._id)}>Xóa</button>
                    </div>
                </div>
            ))}

            <h3>Tổng: {total.toLocaleString()} VND</h3>

            <Link to="/checkout" className="btn checkout-btn">Thanh toán</Link>
        </div>
    );
}

export default Cart;
