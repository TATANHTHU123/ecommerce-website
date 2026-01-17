import { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { CartContext } from "../context/CartContext";

function ProductDetail() {
  const { id } = useParams(); // 🔥 lấy id từ URL
  const { addToCart } = useContext(CartContext);

  const [product, setProduct] = useState(null);
  const [added, setAdded] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  if (loading) {
    return <h3 style={{ textAlign: "center" }}>Đang tải sản phẩm...</h3>;
  }

  if (!product) {
    return <h3 style={{ textAlign: "center" }}>Không tìm thấy sản phẩm</h3>;
  }

  return (
    <div className="product-detail">
      <Link to="/" className="back-link">⬅ Quay lại</Link>

      <div className="detail-card">
        <img
          src={
            product.image?.startsWith("http")
              ? product.image
              : `http://localhost:5000${product.image}`
          }
          alt={product.name}
          onError={(e) => (e.target.src = "/no-image.png")}
        />

        <div className="detail-info">
          <h2>{product.name}</h2>
          <p className="price">{product.price.toLocaleString()} VND</p>

          {product.description && (
            <p className="description">{product.description}</p>
          )}

          <button
            className={`btn ${added ? "added" : ""}`}
            onClick={handleAddToCart}
          >
            {added ? "✔ Đã thêm!" : "🛒 Add to cart"}
          </button>
        </div>
      </div>

      {/* CSS */}
      <style>{`
        .product-detail {
          padding: 20px;
          min-height: 100vh;
          background: #f6f8ff;
        }

        .back-link {
          display: inline-block;
          margin-bottom: 15px;
          text-decoration: none;
          color: #007bff;
          font-size: 14px;
        }

        .detail-card {
          max-width: 900px;
          margin: auto;
          background: #fff;
          padding: 20px;
          border-radius: 12px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.08);
        }

        .detail-card img {
          width: 100%;
          height: 350px;
          object-fit: cover;
          border-radius: 10px;
        }

        .detail-info h2 {
          margin-bottom: 10px;
          font-size: 24px;
        }

        .price {
          font-size: 20px;
          font-weight: bold;
          color: #d62828;
          margin-bottom: 10px;
        }

        .description {
          font-size: 14px;
          line-height: 1.6;
          margin-bottom: 20px;
          color: #333;
        }

        .btn {
          padding: 10px 18px;
          border-radius: 8px;
          border: none;
          background: #007bff;
          color: #fff;
          cursor: pointer;
          font-size: 14px;
          transition: 0.2s;
        }

        .btn:hover {
          opacity: 0.9;
        }

        .btn.added {
          background: #28a745;
        }

        @media (max-width: 768px) {
          .detail-card {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

export default ProductDetail;
