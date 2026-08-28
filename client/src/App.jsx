import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SiteProvider } from "./context/SiteContext.jsx";
import { ToastProvider } from "./context/ToastContext.jsx";
import { AdminAuthProvider } from "./context/AdminAuthContext.jsx";

import StoreLayout from "./components/StoreLayout.jsx";
import Home from "./pages/Home.jsx";
import ProductPage from "./pages/ProductPage.jsx";
import Bulk from "./pages/Bulk.jsx";
import Checkout from "./pages/Checkout.jsx";
import OrderConfirmation from "./pages/OrderConfirmation.jsx";
import NotFound from "./pages/NotFound.jsx";

/* The admin panel is a separate audience — load it on demand so shoppers
   never download it. This offsets the weight of the animation layer. */
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin.jsx"));
const AdminLayout = lazy(() => import("./pages/admin/AdminLayout.jsx"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard.jsx"));
const AdminOrders = lazy(() => import("./pages/admin/AdminOrders.jsx"));
const AdminEnquiries = lazy(() => import("./pages/admin/AdminEnquiries.jsx"));
const AdminProducts = lazy(() => import("./pages/admin/AdminProducts.jsx"));
const AdminProductEdit = lazy(() => import("./pages/admin/AdminProductEdit.jsx"));
const AdminSettings = lazy(() => import("./pages/admin/AdminSettings.jsx"));

function AdminFallback() {
  return (
    <div className="wrap pageLoader" role="status" aria-live="polite">
      <span className="pageLoader-ring" aria-hidden="true" />
      <span>Loading admin…</span>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <SiteProvider>
          <Routes>
            <Route element={<StoreLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/kit/:slug" element={<ProductPage />} />
              <Route path="/bulk" element={<Bulk />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order-confirmation" element={<OrderConfirmation />} />
              <Route path="*" element={<NotFound />} />
            </Route>

            <Route
              path="/admin/*"
              element={
                <AdminAuthProvider>
                  <Suspense fallback={<AdminFallback />}>
                    <AdminRoutes />
                  </Suspense>
                </AdminAuthProvider>
              }
            />
          </Routes>
        </SiteProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

function AdminRoutes() {
  return (
    <Routes>
      <Route path="login" element={<AdminLogin />} />
      <Route element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="enquiries" element={<AdminEnquiries />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="products/:id" element={<AdminProductEdit />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>
    </Routes>
  );
}
