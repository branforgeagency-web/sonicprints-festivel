import { useEffect, useState, useCallback } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { lookupOrders } from "../api/client.js";
import { useSite, money, imgUrl } from "../context/SiteContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { waLink } from "../utils/whatsapp.js";
import SEOHead from "../components/SEOHead.jsx";
import Icon from "../components/Icon.jsx";

const CUSTOMER_ORDERS_STORAGE_KEY = "sonicprints_customer_orders_v1";

const STAGES = [
  { key: "new", label: "Order Placed", icon: "📝", desc: "Received and awaiting confirmation" },
  { key: "confirmed", label: "Confirmed", icon: "✓", desc: "Order details verified & scheduled" },
  { key: "packed", label: "Packed", icon: "📦", desc: "Idol & puja items boxed securely" },
  { key: "dispatched", label: "Dispatched", icon: "🚚", desc: "Out for delivery with tracking" },
  { key: "delivered", label: "Delivered", icon: "🎉", desc: "Delivered to your doorstep" }
];

function getStageIndex(status) {
  if (status === "cancelled") return -1;
  const idx = STAGES.findIndex((s) => s.key === status);
  return idx >= 0 ? idx : 0;
}

export default function TrackOrders() {
  const { config } = useSite();
  const toast = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  const [inputVal, setInputVal] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const fetchOrders = useCallback(async (queryParam) => {
    setLoading(true);
    setErrorMsg("");
    try {
      let payload = {};
      const trimmed = (queryParam || "").trim();
      const digits = trimmed.replace(/\D/g, "");

      if (digits.length >= 10) {
        payload.phone = digits;
      } else if (/^[0-9a-fA-F]{24}$/.test(trimmed)) {
        payload.orderId = trimmed;
      } else {
        // Try stored orderIds or stored phone
        try {
          const raw = JSON.parse(localStorage.getItem(CUSTOMER_ORDERS_STORAGE_KEY) || "{}");
          if (raw.phone) payload.phone = raw.phone;
          else if (Array.isArray(raw.orderIds) && raw.orderIds.length > 0) payload.orderIds = raw.orderIds;
        } catch {
          // ignore
        }
      }

      if (!payload.phone && !payload.orderId && (!payload.orderIds || payload.orderIds.length === 0)) {
        setLoading(false);
        return;
      }

      const res = await lookupOrders(payload);
      const found = Array.isArray(res?.orders) ? res.orders : [];
      setOrders(found);
      setSearched(true);
      if (!found.length) {
        setErrorMsg("No orders found matching the provided mobile number or Order ID.");
      }
    } catch (err) {
      console.error("Order lookup error:", err);
      setErrorMsg(err?.response?.data?.message || "Could not retrieve order details. Please verify your mobile number.");
      setOrders([]);
      setSearched(true);
    } finally {
      setLoading(false);
    }
  }, []);

  // On mount: check URL params or local storage
  useEffect(() => {
    const qPhone = searchParams.get("phone");
    const qId = searchParams.get("id");
    if (qPhone || qId) {
      setInputVal(qPhone || qId);
      fetchOrders(qPhone || qId);
      return;
    }

    try {
      const raw = JSON.parse(localStorage.getItem(CUSTOMER_ORDERS_STORAGE_KEY) || "{}");
      if (raw.phone || (Array.isArray(raw.orderIds) && raw.orderIds.length > 0)) {
        if (raw.phone) setInputVal(raw.phone);
        fetchOrders(raw.phone || "");
      }
    } catch {
      // ignore
    }
  }, [searchParams, fetchOrders]);

  const handleClear = () => {
    setInputVal("");
    setOrders([]);
    setSearched(false);
    setErrorMsg("");
    setSearchParams({});
    try {
      localStorage.removeItem(CUSTOMER_ORDERS_STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  const handleSearch = (e) => {
    e?.preventDefault();
    if (!inputVal.trim()) {
      handleClear();
      toast("Please enter your 10-digit mobile number or Order ID");
      return;
    }
    const clean = inputVal.trim();
    const digits = clean.replace(/\D/g, "");
    if (digits.length >= 10) {
      setSearchParams({ phone: digits });
      try {
        localStorage.setItem(CUSTOMER_ORDERS_STORAGE_KEY, JSON.stringify({ phone: digits }));
      } catch {}
    } else {
      setSearchParams({ id: clean });
      try {
        localStorage.setItem(CUSTOMER_ORDERS_STORAGE_KEY, JSON.stringify({ orderIds: [clean] }));
      } catch {}
    }
    fetchOrders(clean);
  };

  return (
    <div className="page track-orders-page">
      <SEOHead
        title="Track Your Order | Sonic Prints Ganesh Festival Collection"
        description="Check live status, items, delivery schedule, and tracking details for your Sonic Prints Ganesh puja kit order."
        canonical="/track"
      />

      {/* Page Header */}
      <header className="phead" style={{ padding: "48px 0 40px" }}>
        <div className="wrap">
          <div className="eyebrow light">Live Order Status</div>
          <h1 style={{ fontSize: "clamp(32px,4.4vw,54px)" }}>Track Your Orders</h1>
          <p>
            Enter your mobile number or Order Reference ID to view live fulfillment progress and delivery details.
          </p>
        </div>
      </header>

      <section className="sec" style={{ paddingTop: 20 }}>
        <div className="wrap" style={{ maxWidth: 920 }}>
          {/* Lookup Input Card */}
          <div className="panel track-search-card" style={{ marginBottom: 36 }}>
            <form onSubmit={handleSearch} className="track-search-form">
              <div className="track-input-group">
                <span className="track-input-icon">📱</span>
                <input
                  type="text"
                  className="track-search-input"
                  placeholder="Enter 10-digit mobile number or Order ID (e.g. 9876543210)…"
                  value={inputVal}
                  onChange={(e) => {
                    const val = e.target.value;
                    setInputVal(val);
                    if (!val.trim()) {
                      handleClear();
                    }
                  }}
                  autoFocus
                />
                {inputVal && (
                  <button
                    type="button"
                    className="track-clear-btn"
                    onClick={handleClear}
                    title="Clear input"
                    aria-label="Clear input"
                  >
                    ✕
                  </button>
                )}
                <button type="submit" className="btn btn-gold btn-lg" disabled={loading}>
                  {loading ? "Searching…" : "Track Order →"}
                </button>
              </div>
            </form>
            <p className="track-search-hint">
              💡 Orders placed on this device are automatically loaded. You can also look up orders using any registered mobile number.
            </p>
          </div>

          {/* Loading Indicator */}
          {loading && (
            <div className="panel track-loading-state" style={{ textAlign: "center", padding: "48px 24px" }}>
              <span className="pageLoader-ring" style={{ width: 36, height: 36, margin: "0 auto 14px" }} />
              <p style={{ color: "var(--muted)", fontSize: 16 }}>Retrieving your order details…</p>
            </div>
          )}

          {/* Error Message */}
          {!loading && errorMsg && (
            <div className="panel track-error-state" style={{ textAlign: "center", padding: "36px 24px" }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
              <h3 style={{ fontSize: 22, color: "#0A2E2B", marginBottom: 8 }}>{errorMsg}</h3>
              <p style={{ color: "var(--muted)", maxWidth: 500, margin: "0 auto 20px" }}>
                Make sure you entered the same phone number used during checkout. Need help? Chat with our festival support team.
              </p>
              <a
                className="btn btn-line"
                href={waLink(config.whatsapp, `Namaste Sonic Prints, I would like to track my order for phone ${inputVal}.`)}
                target="_blank"
                rel="noopener noreferrer"
              >
                Chat on WhatsApp Support ↗
              </a>
            </div>
          )}

          {/* Orders List */}
          {!loading && orders.length > 0 && (
            <div className="track-orders-list">
              <div className="track-results-header">
                <h3>Found {orders.length} Order{orders.length === 1 ? "" : "s"}</h3>
                <span>Sorted by latest order date</span>
              </div>

              {orders.map((o) => {
                const isCancelled = o.status === "cancelled";
                const stageIdx = getStageIndex(o.status);

                return (
                  <div key={o._id} className="panel track-order-card">
                    {/* Order Top Bar */}
                    <div className="track-order-top">
                      <div>
                        <span className="track-ref-label">Order Reference</span>
                        <h3 className="track-order-id">#{o._id}</h3>
                        <span className="track-order-date">
                          Placed on {o.createdAt ? new Date(o.createdAt).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "—"}
                        </span>
                      </div>
                      <div className="track-order-top-right">
                        <span className="track-total-val">{money(o.total || 0)}</span>
                        <span className={`track-payment-badge ${o.paymentStatus === "paid" ? "paid" : "pending"}`}>
                          {o.paymentMethod === "online" ? (o.paymentStatus === "paid" ? "💳 Online (Paid ✓)" : "💳 Online (Pending)") : "💬 WhatsApp Order"}
                        </span>
                      </div>
                    </div>

                    {/* Progress Step Bar */}
                    <div className="track-timeline-wrap">
                      {isCancelled ? (
                        <div className="track-cancelled-notice">
                          <span>⚠️ This order was cancelled or payment was not completed.</span>
                        </div>
                      ) : (
                        <div className="track-steps-bar">
                          {STAGES.map((st, i) => {
                            const isCompleted = i <= stageIdx;
                            const isCurrent = i === stageIdx;
                            return (
                              <div
                                key={st.key}
                                className={`track-step-item ${isCompleted ? "completed" : ""} ${isCurrent ? "current" : ""}`}
                              >
                                <div className="track-step-circle">
                                  <span>{isCompleted ? st.icon : i + 1}</span>
                                </div>
                                <div className="track-step-info">
                                  <strong className="track-step-title">{st.label}</strong>
                                  <span className="track-step-desc">{st.desc}</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Order Items Breakdown */}
                    <div className="track-items-section">
                      <h4 className="track-section-heading">Inside Your Order</h4>
                      <div className="track-items-grid">
                        {(o.items || []).map((it, idx) => (
                          <div key={idx} className="track-item-row">
                            <div className="track-item-details">
                              <strong className="track-item-name">{it.name}</strong>
                              {(it.variantName || it.designName) && (
                                <span className="track-item-variant">
                                  {[it.variantName, it.designName].filter(Boolean).join(" · ")}
                                </span>
                              )}
                              <span className="track-item-qty">Qty: {it.qty} × {money(it.unitPrice)}</span>
                            </div>
                            <strong className="track-item-price">{money(it.lineTotal || 0)}</strong>
                          </div>
                        ))}
                      </div>

                      <div className="track-order-summary-row">
                        <span>Delivery: {o.shipping ? money(o.shipping) : "Free"}</span>
                        <span>Total: <b>{money(o.total || 0)}</b></span>
                      </div>
                    </div>

                    {/* Delivery Address & Navigation */}
                    <div className="track-delivery-section">
                      <h4 className="track-section-heading">Delivery Destination</h4>
                      <div className="track-delivery-details">
                        <div className="track-dest-info">
                          <p>
                            <strong>Recipient:</strong> {o.customer?.name} (📱 {o.customer?.phone})
                          </p>
                          <p>
                            <strong>Address:</strong> {[o.customer?.address, o.customer?.city].filter(Boolean).join(", ")}
                          </p>
                          {o.note && (
                            <p style={{ color: "#8C651F", fontStyle: "italic" }}>
                              <strong>Note:</strong> “{o.note}”
                            </p>
                          )}
                        </div>

                        {o.customer?.coordinates?.lat && o.customer?.coordinates?.lng && (
                          <div className="track-dest-map-action">
                            <a
                              href={o.customer.mapUrl || `https://www.google.com/maps?q=${o.customer.coordinates.lat},${o.customer.coordinates.lng}`}
                              target="_blank"
                              rel="noreferrer"
                              className="btn btn-line btn-sm"
                            >
                              📍 View Pinned GPS Map ↗
                            </a>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Customer Support Footer Bar */}
                    <div className="track-order-card-footer">
                      <span>Questions about this order?</span>
                      <a
                        href={waLink(config.whatsapp, `Namaste Sonic Prints, I have a question regarding my order #${o._id} placed by ${o.customer?.name}.`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-gold btn-sm"
                      >
                        <Icon name="mail" size={15} /> WhatsApp Order Help Desk
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Initial State / Prompt */}
          {!loading && !searched && (
            <div className="panel track-initial-prompt" style={{ textAlign: "center", padding: "40px 24px" }}>
              <div className="om" style={{ fontSize: 44, color: "var(--gold-600)", marginBottom: 12 }}>ॐ</div>
              <h3 style={{ fontSize: 24, marginBottom: 8, color: "#0A2E2B" }}>Check Any Order Status Instantly</h3>
              <p style={{ color: "var(--muted)", maxWidth: 520, margin: "0 auto 24px" }}>
                Enter your mobile number above to retrieve all orders placed for the Ganesh Festival 2026 Collection.
              </p>
              <Link to="/#kits" className="btn btn-gold">
                Browse Ganesh Festival Kits
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
