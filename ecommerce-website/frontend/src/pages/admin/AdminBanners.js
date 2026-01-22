import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_URL = "https://ecommerce-website-10.onrender.com";

const AdminBanners = () => {
  const [banners, setBanners] = useState([]);
  const [image, setImage] = useState(null);
  const token = localStorage.getItem("token");

  const fetchBanners = async () => {
    const res = await axios.get(`${API_URL}/api/banners`);
    setBanners(res.data);
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const addBanner = async (e) => {
    e.preventDefault();
    if (!image) return alert("Chọn ảnh banner");

    const formData = new FormData();
    formData.append("image", image);

    await axios.post(`${API_URL}/api/banners`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    setImage(null);
    fetchBanners();
  };

  const deleteBanner = async (id) => {
    if (!window.confirm("Xóa banner này?")) return;

    await axios.delete(`${API_URL}/api/banners/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    fetchBanners();
  };

  return (
    <div className="container">
      <Link to="/admin">
        <button className="back-btn">⬅ Quay lại</button>
      </Link>

      <h2>🖼 Quản lý banner</h2>

      {/* FORM ADD */}
      <form onSubmit={addBanner} className="admin-form">
        <input
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
        />
        <button className="admin-btn">➕ Thêm</button>
      </form>

      {/* LIST */}
      <div className="banner-list">
        {banners.map((b) => (
          <div key={b._id} className="banner-item">
            <img src={`${API_URL}${b.image}`} alt="banner" />
            <button onClick={() => deleteBanner(b._id)}>🗑</button>
          </div>
        ))}
      </div>

      <style>{`
        .container {
          padding: 20px;
        }

        .admin-form {
          width: 350px;
          margin: 0 auto 20px;
          display: flex;
          gap: 8px;
          align-items: center;
        }

        .admin-btn {
          padding: 6px 12px;
          cursor: pointer;
        }

        .banner-list {
          max-width: 700px;
          margin: auto;
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 16px;
        }

        .banner-item {
          background: #fff;
          padding: 8px;
          border-radius: 6px;
          text-align: center;
        }

        .banner-item img {
          width: 100%;
          height: 120px;
          object-fit: cover;
          border-radius: 6px;
          margin-bottom: 6px;
        }

        .banner-item button {
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default AdminBanners;
