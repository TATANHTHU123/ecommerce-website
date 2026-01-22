import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api"; // ✅ backend online

function OrderHistory() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return;

    const fetchOrders = () => {
      api.get(`/api/orders/${user._id || user.id}`)
        .then(res => setOrders(res.data))
        .catch(console.log);
    };

    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);

    return () => clearInterval(interval);
  }, []);

  if (orders.length === 0) {
    return (
      <div className="order-page">
        <h2 style={{ textAlign: "center" }}>Chưa có đơn hàng nào</h2>
        <Link to="/" className="btn-back-home">⬅️ Trở về trang chủ</Link>
      </div>
    );
  }

  return (
    <div className="order-page">
      <h2>Lịch sử đơn hàng</h2>

      <Link to="/" className="btn-back-home">⬅️ Trở về trang chủ</Link>

      {orders.map(order => (
        <div className="order-card" key={order._id}>
          <p><b>Ngày đặt:</b> {new Date(order.createdAt).toLocaleString()}</p>
          <p><b>Trạng thái:</b> {order.status}</p>
          <p><b>Tổng tiền:</b> {order.total.toLocaleString()} VND</p>

          {order.items.map(item => (
            <div className="order-item" key={item.productId}>
              <img
                src={
                  item.image?.startsWith("http")
                    ? item.image
                    : `${api.defaults.baseURL}${item.image}`
                }
                alt={item.name}
                onError={(e) => (e.target.src = "/no-image.png")}
              />

              <div>
                <p>{item.name}</p>
                <p>
                  {item.price.toLocaleString()} × {item.qty}
                </p>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default OrderHistory;
