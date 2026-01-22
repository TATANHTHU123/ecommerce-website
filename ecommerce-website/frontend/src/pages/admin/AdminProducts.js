import { useEffect, useState, memo, useCallback } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const API_URL = "https://ecommerce-website-10.onrender.com";

/* ================= PRODUCT CARD ================= */
const ProductCard = memo(({ product, onEdit, onDelete }) => (
  <div className="product-card">
    <img
      loading="lazy"
      src={
        product.image?.startsWith("http")
          ? product.image
          : `${API_URL}${product.image}`
      }
      alt={product.name}
      onError={(e) => (e.target.src = "/no-image.png")}
    />
    <h4>{product.name}</h4>
    <p className="price">{product.price} đ</p>
    <button className="edit-btn" onClick={() => onEdit(product)}>✏ Sửa</button>
    <button className="delete-btn" onClick={() => onDelete(product._id)}>🗑 Xoá</button>
  </div>
));

/* ================= MODAL EDIT ================= */
const EditModal = ({ editProduct, form, setForm, onClose, onSave }) => {
  if (!editProduct) return null;

  return (
    <div className="modal">
      <div className="modal-box">
        <h3>✏ Cập nhật sản phẩm</h3>

        <form onSubmit={onSave}>
          <input
            className="admin-input"
            placeholder="Tên sản phẩm"
            value={form.name || ""}
            onChange={e => setForm({ ...form, name: e.target.value })}
          />

          <input
            className="admin-input"
            placeholder="Giá"
            value={form.price || ""}
            onChange={e => setForm({ ...form, price: e.target.value })}
          />

          <input
            className="admin-input"
            placeholder="Danh mục"
            value={form.category || ""}
            onChange={e => setForm({ ...form, category: e.target.value })}
          />

          <textarea
            className="admin-input"
            placeholder="Mô tả sản phẩm"
            value={form.description || ""}
            onChange={e => setForm({ ...form, description: e.target.value })}
            rows={3}
          />

          <input
            type="file"
            accept="image/*"
            className="admin-input"
            onChange={e => setForm({ ...form, image: e.target.files[0] })}
          />

          <button className="admin-btn" type="submit">Lưu</button>
          <button className="delete-btn" type="button" onClick={onClose}>Đóng</button>
        </form>
      </div>
    </div>
  );
};

/* ================= MAIN ================= */
const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
    image: null
  });

  const [edit, setEdit] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 8;
  const token = localStorage.getItem("token");

  /* ===== FETCH PRODUCTS ===== */
  const fetchProducts = useCallback(async () => {
    try {
      const res = await axios.get(`${API_URL}/api/products`);
      const allProducts = res.data || [];
      setTotalPages(Math.ceil(allProducts.length / limit));
      const start = (page - 1) * limit;
      setProducts(allProducts.slice(start, start + limit));
    } catch {
      setProducts([]);
      setTotalPages(1);
    }
  }, [page]);

  /* ===== FETCH CATEGORIES ===== */
  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/categories`);
      setCategories(res.data || []);
    } catch {
      setCategories([]);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [page, fetchProducts]);

  const buildFormData = () => {
    const data = new FormData();
    data.append("name", form.name);
    data.append("price", form.price);
    data.append("category", form.category);
    data.append("description", form.description);
    if (form.image) data.append("image", form.image);
    return data;
  };

  /* ===== CREATE ===== */
  const createProduct = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/api/products`, buildFormData(), {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      });
      setForm({ name: "", price: "", category: "", description: "", image: null });
      setPage(1);
      fetchProducts();
      alert("Thêm sản phẩm thành công!");
    } catch {
      alert("Thêm sản phẩm thất bại!");
    }
  };

  /* ===== DELETE ===== */
  const deleteProduct = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;
    try {
      await axios.delete(`${API_URL}/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchProducts();
    } catch {
      alert("Xoá thất bại!");
    }
  };

  /* ===== UPDATE ===== */
  const updateProduct = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `${API_URL}/api/products/${edit._id}`,
        buildFormData(),
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          }
        }
      );
      setEdit(null);
      fetchProducts();
      alert("Cập nhật thành công!");
    } catch {
      alert("Cập nhật thất bại!");
    }
  };

  /* ===== JSX ===== */
  return (
    <div className="container">
      <Link to="/admin">
        <button className="back-btn">⬅ Quay lại</button>
      </Link>

      <h2>🛒 Quản lý sản phẩm</h2>

      {/* FORM */}
      <form onSubmit={createProduct} className="admin-form">
        <input className="admin-input" placeholder="Tên sản phẩm" value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })} />
        <input className="admin-input" placeholder="Giá" value={form.price}
          onChange={e => setForm({ ...form, price: e.target.value })} />
        <input className="admin-input" placeholder="Mô tả" value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })} />

        <select className="admin-input" value={form.category}
          onChange={e => setForm({ ...form, category: e.target.value })} required>
          <option value="">-- Chọn danh mục --</option>
          {categories.map(c => (
            <option key={c._id} value={c._id}>{c.name}</option>
          ))}
        </select>

        <input type="file" accept="image/*"
          className="admin-input"
          onChange={e => setForm({ ...form, image: e.target.files[0] })} />

        <button className="admin-btn">➕ Thêm sản phẩm</button>
      </form>

      {/* GRID */}
      <div className="products-grid">
        {products.map(p => (
          <ProductCard
            key={p._id}
            product={p}
            onEdit={(p) => {
              setEdit(p);
              setForm({
                name: p.name || "",
                price: p.price || "",
                category: p.category?._id || p.category || "",
                description: p.description || "",
                image: null
              });
            }}
            onDelete={deleteProduct}
          />
        ))}
      </div>

      {/* PAGINATION */}
      <div className="pagination">
        <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Prev</button>
        <span>Trang {page} / {totalPages}</span>
        <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>Next</button>
      </div>

      <EditModal
        editProduct={edit}
        form={form}
        setForm={setForm}
        onClose={() => setEdit(null)}
        onSave={updateProduct}
      />
    </div>
  );
};

export default AdminProducts;
