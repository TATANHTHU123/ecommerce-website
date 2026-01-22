import { createContext, useEffect, useState } from "react";

export const WishlistContext = createContext();

export const WishlistProvider = ({ children, user }) => {
  const [wishlist, setWishlist] = useState([]);

  const storageKey = user ? `wishlist_${user._id}` : null;

  // 👉 Load wishlist theo user
  useEffect(() => {
    if (!storageKey) {
      setWishlist([]);
      return;
    }

    const saved = localStorage.getItem(storageKey);
    if (saved) {
      setWishlist(JSON.parse(saved));
    } else {
      setWishlist([]);
    }
  }, [storageKey]);

  // 👉 Save wishlist theo user
  useEffect(() => {
    if (storageKey) {
      localStorage.setItem(storageKey, JSON.stringify(wishlist));
    }
  }, [wishlist, storageKey]);

  const toggleWishlist = (product) => {
    setWishlist(prev => {
      const exists = prev.find(p => p._id === product._id);
      if (exists) return prev.filter(p => p._id !== product._id);
      return [...prev, product];
    });
  };

  const isWishlisted = (id) =>
    wishlist.some(p => p._id === id);

  return (
    <WishlistContext.Provider
      value={{ wishlist, toggleWishlist, isWishlisted }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
