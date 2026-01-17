import { Link } from "react-router-dom";

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>

      <ul className="admin-menu">
        <li>
          <Link to="/admin/customers">
            <span>👥</span>
            <p>Quản lý khách hàng</p>
          </Link>
        </li>
        <li>
          <Link to="/admin/orders">
            <span>📦</span>
            <p>Quản lý đơn hàng</p>
          </Link>
        </li>
        <li>
          <Link to="/admin/products">
            <span>🛒</span>
            <p>Quản lý sản phẩm</p>
          </Link>
        </li>
        <li>
          <Link to="/admin/categories">
            <span>📂</span>
            <p>Quản lý phân loại</p>
          </Link>
        </li>
        {/* ⭐ QUẢN LÝ BANNER */}
        <li>
          <Link to="/admin/banners">
            <span>🖼️</span>
            <p>Quản lý banner</p>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default AdminDashboard;
