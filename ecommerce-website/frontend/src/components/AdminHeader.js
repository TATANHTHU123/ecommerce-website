function AdminHeader() {
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <header className="admin-header" style={{ padding: 20, display: "flex", justifyContent: "space-between" }}>
      <h2 style={{ margin: 0 }}>Admin Dashboard</h2>
      <button onClick={logout} className="logout-btn">
        Đăng xuất
      </button>
    </header>
  );
}

export default AdminHeader;
