import { useContext } from "react";
import { WishlistContext } from "../context/WishlistContext";
import ProductCard from "../components/ProductCard";
import { useNavigate } from "react-router-dom";

function Wishlist() {
    const { wishlist } = useContext(WishlistContext);
    const navigate = useNavigate();

    return (
        <>
            <div className="wishlist-page">
                {/* HEADER */}
                <div className="wishlist-header">
                    <button className="back-btn" onClick={() => navigate(-1)}>
                        ← Trở về
                    </button>
                    <h2>❤️ Sản phẩm yêu thích</h2>
                </div>

                {wishlist.length === 0 ? (
                    <div className="empty-wishlist">
                        <p>Chưa có sản phẩm nào trong wishlist</p>
                    </div>
                ) : (
                    <div className="product-grid">
                        {wishlist.map(p => (
                            <ProductCard key={p._id} product={p} />
                        ))}
                    </div>
                )}
            </div>

            {/* ===== CSS INLINE ===== */}
            <style>{`
        .wishlist-page {
          padding: 32px;
          min-height: 70vh;
          background: #f8f9fa;
        }

        .wishlist-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 24px;
        }

        .back-btn {
  padding: 6px 14px;
  border-radius: 8px;
  border: none;
  background: #ffffff;
  color: #333;              /* ✅ MÀU CHỮ ĐẬM */
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: 0.2s;
}

.back-btn:hover {
  background: #f1f1f1;
  color: #007bff;           /* ✅ Hover đổi màu */
}


        .back-btn:hover {
          background: #eee;
        }

        .wishlist-page h2 {
          font-size: 26px;
          color: #ff6b6b;
          display: flex;
          align-items: center;
          gap: 8px;
          margin: 0;
        }

        .product-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 24px;
        }

        .empty-wishlist {
          background: #fff;
          padding: 40px;
          border-radius: 12px;
          text-align: center;
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
        }

        .empty-wishlist p {
          font-size: 16px;
          color: #666;
        }

        @media (max-width: 768px) {
          .wishlist-page {
            padding: 20px;
          }

          .wishlist-page h2 {
            font-size: 22px;
          }
        }
      `}</style>
        </>
    );
}

export default Wishlist;
