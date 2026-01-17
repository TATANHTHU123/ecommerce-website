// ❌ Hàm addToCart cũ – hiện không dùng nữa vì đã chuyển sang CartContext để UI tự cập nhật
// export const addToCart = (product) => {
//   console.log("ADD TO CART FUNCTION", product);

//   const cart = JSON.parse(localStorage.getItem("cart")) || [];

//   const exist = cart.find(item => item._id === product._id);

//   if (exist) {
//     exist.qty += 1;
//   } else {
//     cart.push({ ...product, qty: 1 });
//   }

//   localStorage.setItem("cart", JSON.stringify(cart));
// };
