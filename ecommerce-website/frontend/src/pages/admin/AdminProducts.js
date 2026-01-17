import { useEffect, useState, memo, useCallback } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

// Product Card
const ProductCard = memo(({ product, onEdit, onDelete }) => (
  <div className="product-card">
    <img
      loading="lazy"
      src={product.image?.startsWith("http") ? product.image : `http://localhost:5000${product.image}`}
      alt={product.name}
      onError={(e) => (e.target.src = "/no-image.png")}
    />
    <h4>{product.name}</h4>
    <p className="price">{product.price} đ</p>
    <button className="edit-btn" onClick={() => onEdit(product)}>✏ Sửa</button>
    <button className="delete-btn" onClick={() => onDelete(product._id)}>🗑 Xoá</button>
  </div>
));

// Modal chỉnh sửa
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

          {/* ✅ THÊM DESCRIPTION */}
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
          <button className="delete-btn" type="button" onClick={onClose}>
            Đóng
          </button>
        </form>
      </div>
    </div>
  );
};


const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    description: "", // ⭐ THÊM
    image: null
  });

  const [edit, setEdit] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 8;
  const token = localStorage.getItem("token");

  // Lấy toàn bộ sản phẩm
  const fetchProducts = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/products");
      const allProducts = res.data || [];
      setTotalPages(Math.ceil(allProducts.length / limit));
      const start = (page - 1) * limit;
      setProducts(allProducts.slice(start, start + limit));
    } catch (err) {
      console.error(err);
      setProducts([]);
      setTotalPages(1);
    }
  }, [page]);
  
  // Lấy category
  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/categories");
      setCategories(res.data || []);
    } catch (err) {
      console.error(err);
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
    data.append("description", form.description); // ⭐ thêm
    if (form.image) data.append("image", form.image);
    return data;
  };

  const createProduct = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/products", buildFormData(), {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });
      setForm({ name: "", price: "", category: "", description: "", image: null });
      setPage(1);
      fetchProducts();
      alert("Thêm sản phẩm thành công!");
    } catch (err) {
      console.error(err);
      alert("Thêm sản phẩm thất bại!");
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert("Xoá thất bại!");
    }
  };

  const updateProduct = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/products/${edit._id}`, buildFormData(), {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" }
      });
      setEdit(null);
      setForm({ name: "", price: "", category: "", image: null });
      fetchProducts();
      alert("Cập nhật thành công!");
    } catch (err) {
      console.error(err);
      alert("Cập nhật thất bại!");
    }
  };

  return (
    <div className="container">
      <Link to="/admin">
        <button className="back-btn">⬅ Quay lại</button>
      </Link>

      <h2>🛒 Quản lý sản phẩm</h2>

      <form onSubmit={createProduct} className="admin-form">
        <input className="admin-input" placeholder="Tên sản phẩm" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
        <input className="admin-input" placeholder="Giá" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
        <input className="admin-input" placeholder="Mô tả sản phẩm" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
        <select
          className="admin-input"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          required
        >
          <option value="">-- Chọn danh mục --</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>


        <input type="file" accept="image/*" className="admin-input" onChange={e => setForm({ ...form, image: e.target.files[0] })} />
        <button type="submit" className="admin-btn">➕ Thêm sản phẩm</button>
      </form>

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
                description: p.description || "", // ✅ HIỆN MÔ TẢ ĐÃ ADD
                image: null
              });
            }}
            onDelete={deleteProduct}
          />


        ))}
      </div>

      <div className="pagination">
        <button disabled={page <= 1} onClick={() => setPage(prev => prev - 1)}>Prev</button>
        <span>Trang {page} / {totalPages}</span>
        <button disabled={page >= totalPages} onClick={() => setPage(prev => prev + 1)}>Next</button>
      </div>

      <EditModal editProduct={edit} form={form} setForm={setForm} onClose={() => setEdit(null)} onSave={updateProduct} />

      {/* CSS */}
      <style>{`
  .container {
    min-height: 100vh;
    padding: 20px;
    background: #f0f4ff;
    font-family: 'Arial', sans-serif;
  }

  .back-btn {
    padding: 6px 12px;
    background: #007bff;
    color: #fff;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    margin-bottom: 20px;
    font-size: 13px;
    transition: 0.2s;
  }
  .back-btn:hover { opacity: 0.85; transform: translateX(-1px); }

  h2 {
    text-align: center;
    margin-bottom: 15px;
    font-size: 22px;
    font-weight: 700;
  }

  /* Form thêm sản phẩm nhỏ lại */
  /* Form thêm sản phẩm chiếm 1/3 trang */
.admin-form {
  display: flex;
  flex-direction: column; /* input xếp dọc */
  gap: 10px;
  background: #fff;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
  width: 33%;       /* chiếm 1/3 chiều rộng trang */
  min-width: 250px; /* tránh quá bé trên mobile */
  margin: 0 auto 20px auto; /* canh giữa form */
}

.admin-input, .admin-btn {
  width: 100%;       /* input & button full chiều rộng form */
  box-sizing: border-box;
  height: 32px;      /* chỉnh chiều cao vừa phải */
  font-size: 13px;   /* font vừa */
  padding: 5px 8px;
}

.admin-btn {
  padding: 6px 12px;
  font-size: 13px;
  cursor: pointer;
}

  .admin-btn:hover { opacity: 0.85; }

  /* Lưới sản phẩm 8 sp 1 trang */
  .products-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr); /* 4 cột × 2 hàng = 8 sp */
    gap: 15px;
    justify-items: center;
  }

  .product-card {
    background: #fff;
    padding: 10px;
    border-radius: 6px;
    box-shadow: 0 2px 6px rgba(0,0,0,0.05);
    transition: 0.2s;
    width: 100%;
    max-width: 150px; /* thu nhỏ card */
  }
  .product-card:hover { transform: translateY(-2px); }

  .product-card img {
    width: 100%;
    height: 120px; /* nhỏ lại */
    object-fit: cover;
    border-radius: 6px;
    margin-bottom: 6px;
  }

  .product-card h4 {
    font-size: 13px;
    margin: 4px 0;
    font-weight: 600;
  }

  .price {
    color: #d62828;
    font-weight: 600;
    font-size: 12px;
    margin-bottom: 4px;
  }

  .edit-btn, .delete-btn {
    width: 100%;
    padding: 5px;
    margin-top: 4px;
    border-radius: 6px;
    border: none;
    cursor: pointer;
    font-size: 12px;
  }
  .edit-btn { background: #ffc107; color: #000; }
  .delete-btn { background: #dc3545; color: #fff; }

  /* Pagination */
  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    margin-top: 15px;
    font-size: 12px;
  }
  .pagination button {
    padding: 4px 8px;
    border-radius: 6px;
    border: 1px solid #ccc;
    cursor: pointer;
    background: #fff;
  }
  .pagination button:disabled { opacity: 0.5; cursor: not-allowed; }

  /* Modal */
  .modal {
    position: fixed;
    inset: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(0,0,0,0.35);
    z-index: 999;
  }
  .modal-box {
    background: #fff;
    padding: 18px;
    width: 300px;
    border-radius: 10px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.15);
  }
  .modal-box h3 {
    margin-bottom: 10px;
    font-size: 16px;
    font-weight: 600;
    text-align: center;
  }
`}</style>


    </div>
  );
};

export default AdminProducts;
