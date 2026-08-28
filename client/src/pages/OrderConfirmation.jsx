import { Link, useLocation, Navigate } from "react-router-dom";
import { useSite } from "../context/SiteContext.jsx";
import { waLink } from "../utils/whatsapp.js";

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
      <div className="sec">
        <div className="wrap">
          <div className="okbox narrow">
            <div className="tick">
              <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
            </div>
            <h1 style={{ fontSize: "clamp(32px,4vw,50px)", marginBottom: 12 }}>
              {paid ? "Payment received" : "Order sent"}
            </h1>
            <p style={{ fontSize: 17, color: "var(--muted)", maxWidth: 560, margin: "0 auto 26px" }}>
              {paid
                ? `Thank you, ${name}. Your payment is confirmed and our team will WhatsApp you the delivery schedule shortly.`
                : `Thank you, ${name}. Your order has opened in WhatsApp — press send there and our team will confirm availability, price and the delivery date on the same chat.`}
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <Link className="btn btn-gold" to="/#kits">Continue shopping</Link>
              <a
                className="btn btn-line"
                href={waLink(config.whatsapp, "Namaste Sonic Prints, I have a question about the Ganesh Festival Collection 2026.")}
                target="_blank" rel="noopener noreferrer"
              >
                Chat with us
              </a>
            </div>
            <p style={{ marginTop: 28, fontFamily: "var(--serif)", fontSize: 24, color: "var(--gold-600)" }}>
              गणपति बाप्पा मोर्या
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
