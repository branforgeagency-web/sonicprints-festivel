import { Link, useLocation, Navigate } from "react-router-dom";
import { useSite } from "../context/SiteContext.jsx";
import { waLink } from "../utils/whatsapp.js";
import SEOHead from "../components/SEOHead.jsx";

const ORDER_CONFIRMATION_KEY = "sonicprints_last_order_v1";
function readRememberedOrder() {
  try {
    const raw = sessionStorage.getItem(ORDER_CONFIRMATION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export default function OrderConfirmation() {
  const { state } = useLocation();
  const { config } = useSite();

  // Prefer the freshly-navigated router state; fall back to the copy saved
  // to sessionStorage at checkout so a refresh on this page (or opening it
  // again from history) still shows the confirmation instead of bouncing home.
  const remembered = !state?.name ? readRememberedOrder() : null;
  const effective = state?.name ? state : remembered;

  if (!effective?.name) return <Navigate to="/" replace />;
  const { name, paid } = effective;

  return (
    <div className="page">
      <SEOHead
        title="Order Confirmation | Sonic Prints"
        description="Thank you for ordering with Sonic Prints Ganesh Festival Collection."
        canonical="/order-confirmation"
      />
      <div className="sec">
        <div className="wrap">
          <div className="okbox narrow">
            <div className="tick">
              <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
            </div>
            <h1 style={{ fontSize: "clamp(32px,4vw,50px)", marginBottom: 12 }}>
              {paid ? "Payment received" : "Order sent"}
            </h1>
            {effective?.orderId && (
              <div style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 24px",
                background: "#FFF8EC",
                border: "1.5px solid #D4AF37",
                borderRadius: 999,
                margin: "0 auto 24px",
                fontSize: 15,
                fontWeight: 600,
                boxShadow: "0 4px 14px rgba(212, 175, 55, 0.15)"
              }}>
                <span style={{ color: "#7A5310", fontWeight: 700 }}>Order Reference:</span>
                <span style={{
                  fontFamily: "monospace",
                  color: "#0A2E2B",
                  fontSize: 16,
                  fontWeight: 800,
                  background: "rgba(212, 175, 55, 0.2)",
                  padding: "3px 10px",
                  borderRadius: 6,
                  letterSpacing: "0.5px"
                }}>
                  {effective.orderId}
                </span>
              </div>
            )}
            <p style={{ fontSize: 17, color: "var(--muted)", maxWidth: 560, margin: "0 auto 26px" }}>
              {paid
                ? `Thank you, ${name}. Your payment is confirmed and our team will WhatsApp you the delivery schedule shortly.`
                : `Thank you, ${name}. Your order has opened in WhatsApp — press send there and our team will confirm availability, price and the delivery date on the same chat.`}
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <Link className="btn btn-gold" to="/track">📦 Track Your Order Live →</Link>
              <Link className="btn btn-line" to="/#kits" style={{ background: "#FFFFFF", borderColor: "#B88E44", color: "#0A2E2B", fontWeight: 700 }}>
                Continue shopping
              </Link>
              <a
                className="btn btn-line"
                href={waLink(config.whatsapp, "Namaste Sonic Prints, I have a question about the Ganesh Festival Collection 2026.")}
                target="_blank" rel="noopener noreferrer"
              >
                Chat with us
              </a>
            </div>
            <p style={{ marginTop: 28, fontFamily: "var(--serif)", fontSize: 24, fontWeight: 700, color: "#8C651F", letterSpacing: "0.04em" }}>
              Ganpati Bappa Morya!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
