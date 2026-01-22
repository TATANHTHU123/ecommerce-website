import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { CartProvider } from "./context/CartContext";
import "./index.css";
import { AuthProvider } from "./context/AuthContext";

import WishlistWrapper from "./WishlistWrapper"; // 👈 BẮT BUỘC PHẢI CÓ

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <WishlistWrapper>
        <CartProvider>
          <App />
        </CartProvider>
      </WishlistWrapper>
    </AuthProvider>
  </React.StrictMode>
);

