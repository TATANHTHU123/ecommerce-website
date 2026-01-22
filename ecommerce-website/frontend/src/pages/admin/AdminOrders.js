import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const API_URL = "https://ecommerce-website-10.onrender.com";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;

  const fetchOrders = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get(`${API_URL}/api/admin/orders`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setOrders(res.data);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${API_URL}/api/admin/orders/${id}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchOrders();
      alert("Cập nhật trạng thái thành công!");
    } catch (err) {
      alert("Lỗi khi cập nhật trạng thái");
    }
  };

  /* ================= FILTER STATUS ================= */
  const filteredOrders =
    statusFilter === "All"
      ? orders
      : orders.filter(order => order.status === statusFilter);

  /* ================= PAGINATION ================= */
  const lastIndex = currentPage * ordersPerPage;
  const firstIndex = lastIndex - ordersPerPage;
  const currentOrders = filteredOrders.slice(firstIndex, lastIndex);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  /* ================= STATS ================= */
  const totalOrders = orders.length;

  const statusCount = orders.reduce((acc, o) => {
    acc[o.status] = (acc[o.status] || 0) + 1;
    return acc;
  }, {});

  const totalRevenue = orders
    .filter(o => o.status === "Completed")
    .reduce((sum, o) => sum + (o.total || 0), 0);

  return (
    <div style={styles.container}>
      <Link to="/admin">
        <button style={styles.backBtn}>⬅ Quay lại</button>
      </Link>

      <style>{`
        .order-card {
          background: white;
          padding: 18px;
          margin-bottom: 18px;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
        }
        .status-select {
          padding: 6px 18px;
          border-radius: 6px;
          border: 1px solid #ccc;
        }
        .pagination {
          display: flex;
          justify-content: center;
          margin-top: 20px;
          gap: 8px;
        }
        .page-btn {
          padding: 6px 16px;
          border-radius: 6px;
          border: 1px solid #007bff;
          background: white;
          cursor: pointer;
        }
        .page-btn.active {
          background: #007bff;
          color: white;
        }
      `}</style>

      <h2 style={styles.title}>📦 Danh sách đơn hàng</h2>

      {/* FILTER */}
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <select
          className="status-select"
          value={statusFilter}
          onChange={e => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="All">📦 Tất cả đơn</option>
          <option value="Pending">⏳ Pending</option>
          <option value="Shipping">🚚 Shipping</option>
          <option value="Completed">✅ Completed</option>
          <option value="Canceled">❌ Canceled</option>
        </select>
      </div>

      {/* STATS */}
      <div style={styles.statsBox}>
        <div style={styles.statCard}>
          💰 Doanh thu<br />
          <strong style={{ color: "#d62828" }}>
            {totalRevenue.toLocaleString()} VNĐ
          </strong>
        </div>
        <div style={styles.statCard}>📦 Tổng đơn<br />{totalOrders}</div>
        <div style={styles.statCard}>⏳ Pending<br />{statusCount.Pending || 0}</div>
        <div style={styles.statCard}>🚚 Shipping<br />{statusCount.Shipping || 0}</div>
        <div style={styles.statCard}>✅ Completed<br />{statusCount.Completed || 0}</div>
        <div style={styles.statCard}>❌ Canceled<br />{statusCount.Canceled || 0}</div>
      </div>

      {/* ORDERS */}
      {currentOrders.map(order => (
        <div key={order._id} className="order-card">
          <h3>🧾 Order ID: <span style={{ color: "#0077ff" }}>{order._id}</span></h3>
          <p>👤 {order.userId?.name}</p>
          <p>📧 {order.userId?.email}</p>
          <p>📞 {order.userId?.phone || order.customer?.phone}</p>
          <p>📍 {order.customer?.address}</p>
          <p>💰 <strong style={{ color: "#d62828" }}>{order.total} VNĐ</strong></p>
          <p>🕒 {new Date(order.createdAt).toLocaleString()}</p>

          <select
            className="status-select"
            value={order.status}
            onChange={e => updateStatus(order._id, e.target.value)}
          >
            <option value="Pending">⏳ Pending</option>
            <option value="Shipping">🚚 Shipping</option>
            <option value="Completed">✅ Completed</option>
            <option value="Canceled">❌ Canceled</option>
          </select>

          <hr />
          <ul>
            {order.items.map((i, idx) => (
              <li key={idx}>{i.name} × {i.qty} – {i.price}đ</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f5f7fa, #e4ebf3)",
    padding: "40px"
  },
  title: {
    fontSize: 30,
    fontWeight: 700,
    textAlign: "center",
    marginBottom: 20
  },
  backBtn: {
    padding: "10px 20px",
    background: "#007bff",
    color: "white",
    border: "none",
    borderRadius: 6,
    marginBottom: 20,
    cursor: "pointer"
  },
  statsBox: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
    gap: 16,
    marginBottom: 30
  },
  statCard: {
    background: "white",
    padding: 18,
    borderRadius: 12,
    textAlign: "center",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    fontWeight: 600
  }
};

export default AdminOrders;
