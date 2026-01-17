import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { CartProvider } from "./context/CartContext";
import "./index.css";
import { AuthProvider } from "./context/AuthContext";
import { WishlistProvider } from "./context/WishlistContext";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <WishlistProvider>
  <AuthProvider>
  <CartProvider>
    <App />
  </CartProvider>
  </AuthProvider>
  </WishlistProvider>
);
