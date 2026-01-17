import { useEffect, useState } from "react";
import axios from "axios";

export default function Banner() {
  const [banners, setBanners] = useState([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/banners")
      .then(res => setBanners(res.data));
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
          {/* IMAGE */}
          <img
            src={`http://localhost:5000${b.image}`}
            className="vip-banner-bg"
            alt="banner"
          />

          {/* OVERLAY */}
          <div className="vip-overlay" />

          {/* TEXT AUTO ANIMATE */}
          <div className="vip-content">
            <h2 className="vip-title">
              {b.title || "Những sản phẩm mới 2026"}
            </h2>
            <p className="vip-desc">
              {b.description ||
                "Thiết kế độc đáo – Tái chế – Nguyên liệu mới"}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
