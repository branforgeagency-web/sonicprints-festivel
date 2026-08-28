import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="page">
      <div className="sec">
        <div className="wrap">
          <div className="okbox narrow">
            <div className="eyebrow center">404</div>
            <h1 style={{ fontSize: "clamp(32px,4.4vw,54px)", marginBottom: 12 }}>
              This page wandered off during visarjan.
            </h1>
            <p style={{ fontSize: 17, color: "var(--muted)", maxWidth: 560, margin: "0 auto 26px" }}>
              We couldn't find what you were looking for. It may have been moved, or the link might be
              off by a letter — let's get you back to the collection.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <Link className="btn btn-gold" to="/">Back to the homepage</Link>
              <Link className="btn btn-line" to="/#kits">Browse the collection</Link>
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
