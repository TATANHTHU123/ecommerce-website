import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import Banner from "../components/Banner";
import api from "../utils/api"; // ✅ dùng backend online

function Home({ keyword, category, price }) {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const productsPerPage = 8;

  useEffect(() => {
    api
      .get(`/api/products?keyword=${keyword || ""}`)
      .then(res => {
        let data = res.data;

        if (category) {
          data = data.filter(
            p => p.category === category || p.category?._id === category
          );
        }

        if (price) {
          if (price === "100000") {
            data = data.filter(p => p.price >= 100000);
          } else {
            const [min, max] = price.split("-").map(Number);
            data = data.filter(p => p.price >= min && p.price <= max);
          }
        }

        setProducts(data);
        setCurrentPage(1);
      })
      .catch(console.log);
  }, [keyword, category, price]);

  // PAGINATION
  const lastIndex = currentPage * productsPerPage;
  const firstIndex = lastIndex - productsPerPage;
  const currentProducts = products.slice(firstIndex, lastIndex);
  const totalPages = Math.ceil(products.length / productsPerPage);

  return (
    <div className="home-bg">
      {/* overlay lồng ảnh */}
      <div className="home-overlay" />

      <Banner />

      {/* ===== TITLE ===== */}
      <section className="home-title">
        <h2>Sản phẩm mới</h2>
        <span className="underline" />
      </section>

      {/* ===== PRODUCT GRID ===== */}
      <div className="product-grid">
        {currentProducts.length > 0 ? (
          currentProducts.map(p => (
            <ProductCard key={p._id} product={p} />
          ))
        ) : (
          <p className="empty">😢 Không có sản phẩm phù hợp</p>
        )}
      </div>

      {/* ===== PAGINATION ===== */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => prev - 1)}
          >
            ◀
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              className={currentPage === i + 1 ? "active" : ""}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => prev + 1)}
          >
            ▶
          </button>
        </div>
      )}
    </div>
  );
}

export default Home;
