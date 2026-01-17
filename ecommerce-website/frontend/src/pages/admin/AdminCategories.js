import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const token = localStorage.getItem("token");

  const fetchCategories = async () => {
    const res = await axios.get("http://localhost:5000/api/categories");
    setCategories(res.data);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // ➕ Add category
  const addCategory = async (e) => {
    e.preventDefault();
    if (!name) return alert("Nhập tên category");

    try {
      await axios.post(
        "http://localhost:5000/api/categories",
        { name },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setName("");
      fetchCategories();
    } catch (err) {
      alert(err.response?.data?.message || "Lỗi");
    }
  };

  // ❌ Delete category
  const deleteCategory = async (id) => {
    if (!window.confirm("Xoá category này?")) return;

    await axios.delete(`http://localhost:5000/api/categories/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchCategories();
  };

  return (
    <div className="container">
      <Link to="/admin">
        <button className="back-btn">⬅ Quay lại</button>
      </Link>

      <h2>📂 Quản lý phân loại</h2>

      {/* FORM ADD */}
      <form onSubmit={addCategory} className="admin-form">
        <input
          className="admin-input"
          placeholder="Tên category"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button className="admin-btn">➕ Thêm</button>
      </form>

      {/* LIST */}
      <ul className="category-list">
        {categories.map((c) => (
          <li key={c._id}>
            <span>{c.name}</span>
            <button onClick={() => deleteCategory(c._id)}>🗑</button>
          </li>
        ))}
      </ul>

      <style>{`
        .container { padding: 20px; }
        .admin-form {
          width: 300px;
          margin: 0 auto 20px;
          display: flex;
          gap: 8px;
        }
        .admin-input {
          flex: 1;
          padding: 6px;
        }
        .admin-btn {
          padding: 6px 10px;
          cursor: pointer;
        }
        .category-list {
          max-width: 300px;
          margin: auto;
          list-style: none;
          padding: 0;
        }
        .category-list li {
          display: flex;
          justify-content: space-between;
          background: #fff;
          padding: 8px;
          margin-bottom: 6px;
          border-radius: 6px;
        }
      `}</style>
    </div>
  );
};

export default AdminCategories;
