import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "https://ecommerce-website-10.onrender.com";

export default function Banner() {
  const [banners, setBanners] = useState([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    axios
      .get(`${API_URL}/api/banners`)
      .then(res => setBanners(res.data))
      .catch(err => {
        console.error("Banner API error:", err);
      });
  }, []);

  useEffect(() => {
    if (banners.length === 0) return;
    const timer = setInterval(() => {
      setIndex(i => (i + 1) % banners.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [banners]);

  if (banners.length === 0) return null;

  return (
    <div className="vip-banner-container">
      {banners.map((b, i) => (
        <div
          key={b._id}
          className={`vip-banner-slide ${i === index ? "active" : ""}`}
        >
          <img
            src={`${API_URL}/${b.image}`}
            className="vip-banner-bg"
            alt=""
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />

          <div className="vip-overlay" />

          <div className="vip-content">
            <h2>{b.title || "Những sản phẩm mới 2026"}</h2>
            <p>
              {b.description ||
                "Thiết kế độc đáo – Tái chế – Nguyên liệu mới"}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
