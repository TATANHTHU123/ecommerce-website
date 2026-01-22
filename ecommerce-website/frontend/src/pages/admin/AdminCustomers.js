import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const API_URL = "https://ecommerce-website-10.onrender.com";

const AdminCustomers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const role = localStorage.getItem("role");

    // ⛔ Không phải admin thì KHÔNG gọi API
    if (role !== "admin") {
      alert("Bạn không có quyền truy cập trang này");
      return;
    }

    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Token không tồn tại");

        const res = await axios.get(
          `${API_URL}/api/admin/customers`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        setUsers(res.data);
      } catch (err) {
        console.error(err);
        alert("Không thể tải danh sách khách hàng");
      }
    };

    fetchUsers();
  }, []);


  return (
    <div style={styles.container}>
      <Link to="/admin">
        <button style={styles.backBtn}>⬅ Quay lại</button>
      </Link>
      <h2 style={styles.title}>Danh sách khách hàng</h2>
      <table className="customer-table">
        <thead>
          <tr>
            <th>Tên</th>
            <th>Email</th>
            <th>SĐT</th>
            <th>Vai trò</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u._id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.phone || "--"}</td>
              <td><span className="role-badge">{u.role}</span></td>
            </tr>
          ))}
        </tbody>
      </table>

      <style>{`
        .customer-table {
          width: 100%;
          border-collapse: collapse;
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 8px 24px rgba(0,0,0,0.08);
        }
        .customer-table thead {
          background: linear-gradient(135deg, #4facfe, #00f2fe);
          color: white;
        }
        .customer-table th, .customer-table td {
          padding: 14px;
          text-align: left;
          font-size: 15px;
        }
        .customer-table tbody tr:hover {
          background: #eef7ff;
        }
        .role-badge {
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 13px;
          color: white;
          background: #1976d2;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f5f7fa, #e4ebf3)",
    padding: "40px",
    fontFamily: "Segoe UI, sans-serif"
  },
  backBtn: {
    padding: "10px 22px",
    background: "linear-gradient(135deg, #4facfe, #00f2fe)",
    color: "white",
    border: "none",
    borderRadius: "25px",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: "600",
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    marginBottom: "18px",
    transition: "0.25s"
  },
  title: {
    textAlign: "center",
    fontSize: "30px",
    fontWeight: "700",
    color: "#2c3e50",
    marginBottom: "25px"
  }
};

export default AdminCustomers;
