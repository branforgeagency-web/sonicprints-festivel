import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate, useParams } from "react-router-dom";
import { SiteProvider } from "./context/SiteContext.jsx";
import { ToastProvider } from "./context/ToastContext.jsx";
import { AdminAuthProvider } from "./context/AdminAuthContext.jsx";

import StoreLayout from "./components/StoreLayout.jsx";
import Home from "./pages/Home.jsx";
import ProductPage from "./pages/ProductPage.jsx";
import Bulk from "./pages/Bulk.jsx";
import Checkout from "./pages/Checkout.jsx";
import OrderConfirmation from "./pages/OrderConfirmation.jsx";
import TrackOrders from "./pages/TrackOrders.jsx";
import SitemapPage from "./pages/SitemapPage.jsx";
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

function LegacyProductRedirect() {
  const { slug } = useParams();
  return <Navigate to={`/kit/${slug}`} replace />;
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
              <Route path="/track" element={<TrackOrders />} />
              <Route path="/my-orders" element={<Navigate to="/track" replace />} />
              <Route path="/orders" element={<Navigate to="/track" replace />} />
              <Route path="/sitemap" element={<SitemapPage />} />

              {/* Legacy URL Custom 301 Client-Side Redirects */}
              <Route path="/products/:slug" element={<LegacyProductRedirect />} />
              <Route path="/kits/:slug" element={<LegacyProductRedirect />} />
              <Route path="/product/:slug" element={<LegacyProductRedirect />} />
              <Route path="/shop" element={<Navigate to="/" replace />} />
              <Route path="/store" element={<Navigate to="/" replace />} />
              <Route path="/collection" element={<Navigate to="/" replace />} />
              <Route path="/corporate" element={<Navigate to="/bulk" replace />} />
              <Route path="/corporate-gifting" element={<Navigate to="/bulk" replace />} />
              <Route path="/b2b" element={<Navigate to="/bulk" replace />} />
              <Route path="/kids" element={<Navigate to="/kit/bal-ganesh-kids-kit" replace />} />
              <Route path="/mini" element={<Navigate to="/kit/shubharambh-mini" replace />} />
              <Route path="/employee" element={<Navigate to="/kit/employee-puja-box" replace />} />
              <Route path="/diy" element={<Navigate to="/kit/make-your-own-ganesha" replace />} />
              <Route path="/mandap" element={<Navigate to="/kit/gruha-ganapathi-mandap" replace />} />
              <Route path="/chakra" element={<Navigate to="/kit/rotating-chakra-backdrop" replace />} />

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
