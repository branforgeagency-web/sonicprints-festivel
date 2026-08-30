import axios from "axios";
import { FALLBACK_PRODUCTS } from "../data/products.js";

const isLocalhost =
  typeof window !== "undefined" &&
  (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");

const rawApiUrl = import.meta.env.VITE_API_URL || (isLocalhost ? "http://localhost:5000" : "");

let baseURL = "/api";
if (rawApiUrl) {
  const cleanUrl = rawApiUrl.replace(/\/$/, "");
  baseURL = cleanUrl.endsWith("/api") ? cleanUrl : `${cleanUrl}/api`;
}

const api = axios.create({ baseURL, timeout: 10000 });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("sonic_admin_token");
  if (token && (config.url?.includes("/admin") || config.url?.includes("/auth"))) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

/* ---------------- public endpoints ---------------- */
export const getProducts = () =>
  api
    .get("/products")
    .then((r) => (r.data && r.data.length ? r.data : FALLBACK_PRODUCTS))
    .catch((err) => {
      console.warn("API /products unreachable, using static fallback catalog:", err.message);
      return FALLBACK_PRODUCTS;
    });

export const getProductBySlug = (slug) =>
  api
    .get(`/products/${slug}`)
    .then((r) => r.data)
    .catch((err) => {
      console.warn(`API /products/${slug} unreachable, searching static catalog:`, err.message);
      const found = FALLBACK_PRODUCTS.find((p) => p.slug === slug);
      if (found) {
        const crossSellProducts = FALLBACK_PRODUCTS.filter((p) => p.id !== found.id).slice(0, 3);
        return { ...found, crossSellProducts };
      }
      throw err;
    });
export const getSiteConfig = () => api.get("/config").then((r) => r.data);
export const quoteCart = (items) => api.post("/orders/quote", { items }).then((r) => r.data);
export const placeOrder = (payload) => api.post("/orders", payload).then((r) => r.data);
export const createCashfreeOrder = (orderId) =>
  api.post("/orders/cashfree/create", { orderId }).then((r) => r.data);
export const verifyCashfreePayment = (payload) =>
  api.post("/orders/cashfree/verify", payload).then((r) => r.data);
export const createRazorpayOrder = (orderId) =>
  api.post("/orders/razorpay/create", { orderId }).then((r) => r.data);
export const verifyRazorpayPayment = (payload) =>
  api.post("/orders/razorpay/verify", payload).then((r) => r.data);
export const cancelAbandonedPayment = (orderId) =>
  api.post(`/orders/${orderId}/cancel-abandoned-payment`).then((r) => r.data).catch(() => null);
export const submitEnquiry = (payload) => api.post("/enquiries", payload).then((r) => r.data);

/* ---------------- admin endpoints ---------------- */
export const adminLogin = (email, password) =>
  api.post("/auth/login", { email, password }).then((r) => r.data);
export const adminMe = () => api.get("/auth/me").then((r) => r.data);

export const adminGetProducts = () => api.get("/products/admin").then((r) => r.data);
export const adminGetProduct = (id) => api.get(`/products/admin/${id}`).then((r) => r.data);
export const adminCreateProduct = (payload) => api.post("/products/admin", payload).then((r) => r.data);
export const adminUpdateProduct = (id, payload) =>
  api.put(`/products/admin/${id}`, payload).then((r) => r.data);
export const adminDeleteProduct = (id) => api.delete(`/products/admin/${id}`).then((r) => r.data);

export const adminGetOrders = () => api.get("/orders/admin").then((r) => r.data);
export const adminUpdateOrderStatus = (id, status) =>
  api.patch(`/orders/admin/${id}/status`, { status }).then((r) => r.data);

export const adminGetEnquiries = () => api.get("/enquiries/admin").then((r) => r.data);
export const adminUpdateEnquiryStatus = (id, status) =>
  api.patch(`/enquiries/admin/${id}/status`, { status }).then((r) => r.data);

export const adminUpdateConfig = (payload) => api.put("/config/admin", payload).then((r) => r.data);
