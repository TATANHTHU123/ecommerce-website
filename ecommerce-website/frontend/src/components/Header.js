import { FaShoppingCart, FaHeart, FaSearch, FaHistory } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";
import api from "../utils/api"; // ⭐ dùng api chung


function Header({ keyword, setKeyword, category, setCategory, price, setPrice }) {
  const { cart } = useContext(CartContext);
  const { wishlist } = useContext(WishlistContext);
  const user = JSON.parse(localStorage.getItem("user"));
  const [categories, setCategories] = useState([]);

  useEffect(() => {
  api
    .get("/api/categories")
    .then(res => setCategories(res.data));
}, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0);

  return (
    <>
      <header className="header">
        <Link to="/" className="logo">
          <img src="/logo.png" alt="EggPorce" />
          <span>EggPorce</span>
        </Link>

        {/* Search */}
        <div className="search-box">
          <FaSearch />
          <input
            placeholder="Tìm sản phẩm..."
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
          />
        </div>

        {/* Filter */}
        <select value={category} onChange={e => setCategory(e.target.value)}>
          <option value="">Tất cả</option>
          {categories.map(c => (
            <option key={c._id} value={c._id}>{c.name}</option>
          ))}
        </select>

        <select value={price} onChange={e => setPrice(e.target.value)}>
          <option value="">Giá</option>
          <option value="0-50000">Dưới 50k</option>
          <option value="50000-100000">50k - 100k</option>
          <option value="100000">Trên 100k</option>
        </select>

        {/* Icons */}
        <div className="icons">
          <Link to="/wishlist" className="wishlist-icon">
            <FaHeart />
            {wishlist.length > 0 && (
              <span className="cart-badge">{wishlist.length}</span>
            )}
          </Link>

          <Link to="/orders">
            <FaHistory />
          </Link>

          <Link to="/cart" className="cart-icon">
            <FaShoppingCart />
            {cartCount > 0 && (
              <span className="cart-badge">{cartCount}</span>
            )}
          </Link>
        </div>

        {/* Auth */}
        <div className="auth">
          {user ? (
            <>
              <span>👤 {user.name}</span>
              <button onClick={logout}>Đăng xuất</button>
            </>
          ) : (
            <Link to="/login">Đăng nhập</Link>
          )}
        </div>
      </header>

      {/* ===== CSS INLINE ===== */}
      <style>{`
        .header {
          position: sticky;
          top: 0;
          z-index: 1000;
          background: #fff;
          padding: 12px 32px;
          display: flex;
          align-items: center;
          gap: 16px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.08);
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 20px;
          font-weight: 700;
          color: #ff6b6b;
          text-decoration: none;
        }

        .logo img {
          width: 36px;
          height: 36px;
        }

        .search-box {
          flex: 1;
          max-width: 320px;
          display: flex;
          align-items: center;
          gap: 8px;
          background: #f1f3f5;
          padding: 8px 12px;
          border-radius: 999px;
        }

        .search-box input {
          border: none;
          background: transparent;
          outline: none;
          width: 100%;
          font-size: 14px;
        }

        select {
          padding: 6px 10px;
          border-radius: 6px;
          border: 1px solid #ddd;
          font-size: 14px;
        }

        .icons {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .icons a {
          position: relative;
          font-size: 20px;
          color: #333;
          transition: 0.2s;
        }

        .icons a:hover {
          color: #ff6b6b;
        }

        .wishlist-icon svg {
          color: #ff6b6b;
        }

        .cart-badge {
          position: absolute;
          top: -6px;
          right: -8px;
          background: #ff3b3b;
          color: #fff;
          font-size: 11px;
          font-weight: 600;
          padding: 2px 6px;
          border-radius: 999px;
        }

        .auth {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .auth span {
          font-size: 14px;
          font-weight: 600;
        }

        .auth button,
        .auth a {
          padding: 6px 12px;
          border-radius: 6px;
          border: none;
          background: #ff6b6b;
          color: #fff;
          font-size: 14px;
          cursor: pointer;
          text-decoration: none;
        }

        .auth button:hover,
        .auth a:hover {
          background: #fa5252;
        }

        @media (max-width: 768px) {
          .header {
            flex-wrap: wrap;
          }

          .search-box {
            flex: 100%;
            max-width: 100%;
          }
        }
      `}</style>
    </>
  );
}

export default Header;
