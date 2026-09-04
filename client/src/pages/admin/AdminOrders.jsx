import { Fragment, useEffect, useState } from "react";
import { adminGetOrders, adminUpdateOrderStatus } from "../../api/client.js";
import { money } from "../../context/SiteContext.jsx";
import Icon from "../../components/Icon.jsx";

const STATUSES = ["new", "confirmed", "packed", "dispatched", "delivered", "cancelled"];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  function load() {
    setLoading(true);
    adminGetOrders()
      .then((res) => setOrders(Array.isArray(res) ? res : []))
      .catch((err) => console.error("Error loading orders:", err))
      .finally(() => setLoading(false));
  }
  useEffect(load, []);

  async function updateStatus(id, status) {
    const updated = await adminUpdateOrderStatus(id, status);
    setOrders((prev) => prev.map((o) => (o._id === id ? updated : o)));
  }

  const safeOrders = Array.isArray(orders) ? orders : [];

  return (
    <div className="admin-page">
      <div className="admin-header-row">
        <div>
          <span className="admin-eyebrow">📦 Order Management</span>
          <h2 className="admin-title">Customer Orders &amp; Fulfillment</h2>
          <p className="admin-subtitle">
            {safeOrders.length} total order{safeOrders.length === 1 ? "" : "s"} recorded. Click any row to expand full order breakdown.
          </p>
        </div>
        <div className="admin-header-actions">
          <button onClick={load} className="admin-btn ghost btn-icon">
            <Icon name="sparkle" size={15} /> Refresh List
          </button>
        </div>
      </div>

      <div className="admin-card admin-table-card">
        {loading ? (
          <div className="admin-loading-state" style={{ padding: 36, textAlign: "center" }}>
            <span className="pageLoader-ring" style={{ width: 32, height: 32, margin: "0 auto 12px" }} />
            <p>Loading orders catalog…</p>
          </div>
        ) : (
          <div className="admin-table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Customer Info</th>
                  <th>Items Purchased</th>
                  <th>Total Amount</th>
                  <th>Payment Mode</th>
                  <th>Fulfillment Status</th>
                  <th>Order Date</th>
                </tr>
              </thead>
              <tbody>
                {safeOrders.map((o) => (
                  <Fragment key={o._id}>
                    <tr
                      style={{ cursor: "pointer" }}
                      onClick={() => setExpanded(expanded === o._id ? null : o._id)}
                      className={expanded === o._id ? "row-expanded" : ""}
                    >
                      <td>
                        <div className="admin-cust-cell">
                          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                            <span style={{
                              fontFamily: "monospace",
                              fontWeight: 700,
                              fontSize: 12.5,
                              background: "rgba(223, 183, 108, 0.15)",
                              color: "#DFB76C",
                              padding: "2px 7px",
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
                          {(o.items || []).reduce((s, i) => s + (i.qty || 0), 0)} items {expanded === o._id ? "▲" : "▼"}
                        </span>
                      </td>
                      <td>
                        <strong className="order-price">{money(o.total || 0)}</strong>
                      </td>
                      <td>
                        <span className="payment-tag">
                          {o.paymentMethod === "online" ? `💳 Online (${o.paymentStatus || "pending"})` : "💬 WhatsApp Intent"}
                        </span>
                      </td>
                      <td onClick={(e) => e.stopPropagation()}>
                        <select
                          className="status-select"
                          value={o.status || "new"}
                          onChange={(e) => updateStatus(o._id, e.target.value)}
                        >
                          {STATUSES.map((s) => (
                            <option key={s} value={s}>
                              {s.toUpperCase()}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="date-cell">
                        {o.createdAt ? new Date(o.createdAt).toLocaleString("en-IN") : "—"}
                      </td>
                    </tr>

                    {expanded === o._id && (
                      <tr>
                        <td colSpan={6} style={{ background: "rgba(6, 21, 19, 0.95)", padding: "20px 24px" }}>
                          <div style={{ fontSize: 13.5, lineHeight: 1.8, color: "#DDEEEB" }}>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12, marginBottom: 16 }}>
                              <div><strong style={{ color: "#DFB76C" }}>Order ID:</strong> <span style={{ fontFamily: "monospace", color: "#FFF", fontWeight: 700 }}>{o.orderId || o._id}</span></div>
                              <div><strong style={{ color: "#DFB76C" }}>Email:</strong> {o.customer?.email || "—"}</div>
                              <div><strong style={{ color: "#DFB76C" }}>City:</strong> {o.customer?.city || "—"}</div>
                              <div><strong style={{ color: "#DFB76C" }}>Address:</strong> {o.customer?.address || "—"}</div>
                              <div><strong style={{ color: "#DFB76C" }}>Buyer Type:</strong> {o.customer?.buyerType || "—"}</div>
                            </div>
                            {o.note && (
                              <div style={{ marginBottom: 12, background: "rgba(223, 183, 108, 0.1)", padding: "10px 14px", borderRadius: 8, border: "1px solid rgba(223, 183, 108, 0.2)" }}>
                                <strong style={{ color: "#DFB76C" }}>Customer Note:</strong> {o.note}
                              </div>
                            )}

                            {/* Delivery Location & Map Navigation Card */}
                            <div className="admin-delivery-map-card">
                              <div className="admin-map-header">
                                <div className="admin-map-title">
                                  <span>📍 Customer Delivery Map &amp; GPS</span>
                                  {o.customer?.coordinates?.lat && o.customer?.coordinates?.lng && (
                                    <span style={{ fontSize: 12, color: "#DFB76C", fontWeight: 400, marginLeft: 8 }}>
                                      ({Number(o.customer.coordinates.lat).toFixed(5)}° N, {Number(o.customer.coordinates.lng).toFixed(5)}° E)
                                    </span>
                                  )}
                                </div>
                                <a
                                  href={
                                    o.customer?.mapUrl ||
                                    (o.customer?.coordinates?.lat
                                      ? `https://www.google.com/maps?q=${o.customer.coordinates.lat},${o.customer.coordinates.lng}`
                                      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                          [o.customer?.address, o.customer?.city].filter(Boolean).join(", ")
                                        )}`)
                                  }
                                  target="_blank"
                                  rel="noreferrer"
                                  className="admin-btn-gmaps"
                                  title="Open in Google Maps for live delivery route"
                                >
                                  🗺️ Open in Google Maps (Live Route) ↗
                                </a>
                              </div>

                              {o.customer?.coordinates?.lat && o.customer?.coordinates?.lng ? (
                                <div className="admin-map-preview-frame">
                                  <iframe
                                    title={`Delivery map for order ${o._id}`}
                                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${
                                      Number(o.customer.coordinates.lng) - 0.006
                                    }%2C${Number(o.customer.coordinates.lat) - 0.004}%2C${
                                      Number(o.customer.coordinates.lng) + 0.006
                                    }%2C${
                                      Number(o.customer.coordinates.lat) + 0.004
                                    }&layer=mapnik&marker=${o.customer.coordinates.lat}%2C${o.customer.coordinates.lng}`}
                                    loading="lazy"
                                  />
                                </div>
                              ) : (
                                <p style={{ margin: 0, fontSize: 12.5, color: "#8FA7A3" }}>
                                  Customer entered address text: <em>{[o.customer?.address, o.customer?.city].filter(Boolean).join(", ")}</em>. Click the button above to locate on Google Maps.
                                </p>
                              )}
                            </div>

                            <div style={{ marginTop: 16 }}>
                              <strong style={{ color: "#DFB76C", fontSize: 14 }}>Order Items Breakdown:</strong>
                            </div>
                            <ul style={{ margin: "8px 0 0 20px", padding: 0 }}>
                              {(o.items || []).map((it, i) => (
                                <li key={i} style={{ marginBottom: 4 }}>
                                  <strong style={{ color: "#FFF" }}>{it.name}</strong>
                                  {it.variantName ? ` (${it.variantName})` : ""}
                                  {it.designName ? ` — ${it.designName}` : ""}
                                  {" "}× {it.qty} = <strong style={{ color: "#F3D085" }}>{money(it.lineTotal || 0)}</strong>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))}
                {!safeOrders.length && (
                  <tr>
                    <td colSpan={6} style={{ textAlign: "center", padding: "32px", color: "#8FA7A3" }}>
                      No orders recorded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
