import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";
import { Link } from "react-router-dom";
import { FaHeart } from "react-icons/fa";

function ProductCard({ product }) {
  const { addToCart } = useContext(CartContext);
  const { toggleWishlist, isWishlisted } = useContext(WishlistContext);
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <>
      {/* ===== STYLE NGAY TRONG FILE ===== */}
      <style>
        {`
        .product-card {
          background: #fff;
          border-radius: 14px;
          padding: 12px;
          position: relative;
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
          transition: 0.25s;
        }

        .product-card:hover {
          transform: translateY(-4px);
        }

        .product-image-wrapper {
          position: relative;
        }

        .product-image-wrapper img {
          width: 100%;
          border-radius: 12px;
          object-fit: cover;
        }

        /* ❤️ HEART */
        .wishlist-btn {
          position: absolute;
          top: 10px;
          right: 10px;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: white;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
          transition: 0.2s;
        }

        .wishlist-btn svg {
          color: #bbb;
          font-size: 16px;
        }

        .wishlist-btn.active svg {
          color: #e63946;
        }

        .wishlist-btn:hover {
          transform: scale(1.1);
        }

        .product-card h4 {
          margin: 10px 0 4px;
          font-size: 15px;
        }

        .price {
          color: #e63946;
          font-weight: 600;
          margin-bottom: 8px;
        }

        .btn {
          width: 100%;
          padding: 8px;
          border: none;
          border-radius: 8px;
          background: #007bff;
          color: white;
          cursor: pointer;
          transition: 0.2s;
        }

        .btn:hover {
          background: #0056d2;
        }

        .btn.added {
          background: #2ecc71;
        }
        `}
      </style>

      <div className="product-card">
        {/* IMAGE + HEART */}
        <div className="product-image-wrapper">
          <Link to={`/product/${product._id}`}>
            <img
              src={
                product.image?.startsWith("http")
                  ? product.image
                  : `http://localhost:5000${product.image}`
              }
              alt={product.name}
            />
          </Link>

          {/* ❤️ HEART ICON */}
          <button
            className={`wishlist-btn ${isWishlisted(product._id) ? "active" : ""}`}
            onClick={() => toggleWishlist(product)}
          >
            <FaHeart />
          </button>
        </div>

        <h4>{product.name}</h4>
        <p className="price">{product.price.toLocaleString()} VND</p>

        <button
          className={`btn ${added ? "added" : ""}`}
          onClick={handleAddToCart}
        >
          {added ? "✔ Đã thêm!" : "🛒 Add to cart"}
        </button>
      </div>
    </>
  );
}

export default ProductCard;
