import axios from "axios";

const api = axios.create({
  baseURL: "https://ecommerce-website-10.onrender.com"
});

export default api;
