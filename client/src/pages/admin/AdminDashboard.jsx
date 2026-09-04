import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { adminGetOrders, adminGetEnquiries } from "../../api/client.js";
import { money } from "../../context/SiteContext.jsx";
import Icon from "../../components/Icon.jsx";

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = () => {
    setLoading(true);
    Promise.all([adminGetOrders(), adminGetEnquiries()])
      .then(([o, e]) => {
        setOrders(Array.isArray(o) ? o : []);
        setEnquiries(Array.isArray(e) ? e : []);
      })
      .catch((err) => {
        console.error("Dashboard fetch error:", err);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const safeOrders = Array.isArray(orders) ? orders : [];
  const safeEnquiries = Array.isArray(enquiries) ? enquiries : [];

  const revenue = safeOrders.filter((o) => o.status !== "cancelled").reduce((s, o) => s + (o.total || 0), 0);
  const newOrders = safeOrders.filter((o) => o.status === "new").length;
  const newEnquiries = safeEnquiries.filter((e) => e.status === "new").length;
  const confirmedOrders = safeOrders.filter((o) => o.status === "confirmed" || o.status === "dispatched").length;

  return (
    <div className="admin-page">
      <div className="admin-header-row">
        <div>
          <span className="admin-eyebrow">👑 Executive Suite</span>
          <h2 className="admin-title">Store Operations &amp; Performance</h2>
          <p className="admin-subtitle">Real-time overview of customer orders, corporate enquiries, and store revenue.</p>
        </div>
        <div className="admin-header-actions">
          <button onClick={fetchData} className="admin-btn ghost btn-icon" title="Refresh metrics">
            <Icon name="sparkle" size={15} /> Refresh Data
          </button>
        </div>
      </div>

      {loading ? (
        <div className="admin-card admin-loading-state">
          <span className="pageLoader-ring" style={{ width: 36, height: 36, margin: "0 auto 12px" }} />
          <p>Fetching executive analytics…</p>
        </div>
      ) : (
        <>
          {/* Top Luxury Metric Cards */}
          <div className="admin-stats-grid">
            <div className="admin-card admin-stat-card stat-gold">
              <div className="stat-icon-wrap">💎</div>
              <div className="stat-content">
                <span className="stat-label">Total Store Revenue</span>
                <b className="stat-value">{money(revenue)}</b>
                <span className="stat-sub">Excludes cancelled orders</span>
              </div>
            </div>

            <div className="admin-card admin-stat-card stat-emerald">
              <div className="stat-icon-wrap">📦</div>
              <div className="stat-content">
                <span className="stat-label">Total Orders</span>
                <b className="stat-value">{safeOrders.length}</b>
                <span className="stat-sub">{confirmedOrders} active / in fulfillment</span>
              </div>
            </div>

            <div className="admin-card admin-stat-card stat-amber">
              <div className="stat-icon-wrap">⚡</div>
              <div className="stat-content">
                <span className="stat-label">New Orders</span>
                <b className="stat-value">{newOrders}</b>
                <span className="stat-sub">{newOrders > 0 ? "Requires confirmation" : "All orders reviewed"}</span>
              </div>
            </div>

            <div className="admin-card admin-stat-card stat-teal">
              <div className="stat-icon-wrap">💼</div>
              <div className="stat-content">
                <span className="stat-label">Bulk Enquiries</span>
                <b className="stat-value">{safeEnquiries.length}</b>
                <span className="stat-sub">{newEnquiries} pending follow-up</span>
              </div>
            </div>
          </div>

          {/* Quick Executive Shortcuts */}
          <div className="admin-shortcuts-grid">
            <Link to="/admin/orders" className="admin-shortcut-card">
              <div className="sc-icon">📋</div>
              <div>
                <h4>Manage Customer Orders</h4>
                <p>View order details, update fulfillment statuses, and manage deliveries.</p>
              </div>
              <span className="sc-arrow">→</span>
            </Link>

            <Link to="/admin/enquiries" className="admin-shortcut-card">
              <div className="sc-icon">✉️</div>
              <div>
                <h4>Review Corporate Enquiries</h4>
                <p>Respond to corporate clients, apartment societies, and bulk buyers.</p>
              </div>
              <span className="sc-arrow">→</span>
            </Link>

            <Link to="/admin/products" className="admin-shortcut-card">
              <div className="sc-icon">🎁</div>
              <div>
                <h4>Catalog &amp; Pricing</h4>
                <p>Update product pricing, stock availability, and highlight badges.</p>
              </div>
              <span className="sc-arrow">→</span>
            </Link>
          </div>

          {/* Recent Orders Section */}
          <div className="admin-card admin-table-card">
            <div className="admin-table-header">
              <div>
                <h3 className="admin-card-title">Recent Customer Orders</h3>
                <p className="admin-card-sub">Latest 6 orders received on your storefront</p>
              </div>
              <Link to="/admin/orders" className="admin-btn ghost text-btn">
                View All Orders →
              </Link>
            </div>

            <div className="admin-table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Customer Info</th>
                    <th>Items Purchased</th>
                    <th>Total Value</th>
                    <th>Fulfillment Status</th>
                    <th>Order Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {safeOrders.slice(0, 6).map((o) => (
                    <tr key={o._id}>
                      <td>
                        <div className="admin-cust-cell">
                          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                            <span style={{
                              fontFamily: "monospace",
                              fontWeight: 700,
                              fontSize: 12,
                              background: "rgba(223, 183, 108, 0.15)",
                              color: "#DFB76C",
                              padding: "2px 6px",
                              borderRadius: 4,
                              border: "1px solid rgba(223, 183, 108, 0.3)",
                              letterSpacing: "0.5px"
                            }}>
                              {o.orderId || (o._id ? `#${String(o._id).slice(-6)}` : "—")}
                            </span>
                          </div>
                          <strong className="cust-name">{o.customer?.name || "Guest Customer"}</strong>
                          <span className="cust-phone">📱 {o.customer?.phone || "No phone"}</span>
                        </div>
                      </td>
                      <td>
                        <span className="item-count-pill">
                          {(o.items || []).reduce((s, i) => s + (i.qty || 0), 0)} items
                        </span>
                      </td>
                      <td>
                        <strong className="order-price">{money(o.total || 0)}</strong>
                      </td>
                      <td>
                        <span className={`admin-badge badge-${o.status || "new"}`}>
                          {o.status || "new"}
                        </span>
                      </td>
                      <td className="date-cell">
                        {o.createdAt ? new Date(o.createdAt).toLocaleDateString("en-IN") : "—"}
                      </td>
                      <td>
                        <Link to="/admin/orders" className="admin-table-action-btn">
                          Details →
                        </Link>
                      </td>
                    </tr>
                  ))}
                  {!safeOrders.length && (
                    <tr>
                      <td colSpan={6} style={{ textAlign: "center", padding: "32px", color: "var(--muted)" }}>
                        No orders recorded yet. Check storefront or test placing an order.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
