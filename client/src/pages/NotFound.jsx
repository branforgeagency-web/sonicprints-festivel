import { useEffect } from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  useEffect(() => {
    document.title = "404 Page Not Found — Sonic Prints";
  }, []);

  const popularKits = [
    { title: "Shubharambh Mini", path: "/kit/shubharambh-mini", desc: "Complete Puja Kit in a Box" },
    { title: "Employee Puja Box", path: "/kit/employee-puja-box", desc: "Shubharambh Corporate Edition" },
    { title: "Bal Ganesh Kit", path: "/kit/bal-ganesh-kids-kit", desc: "My First Ganesh Chaturthi Kit" },
    { title: "Make Your Own Ganesha", path: "/kit/make-your-own-ganesha", desc: "DIY Kids Activity Kit" },
    { title: "Gruha Ganapathi Mandap", path: "/kit/gruha-ganapathi-mandap", desc: "Instant Flat-Pack Mandap" },
    { title: "Motorized Rotating Chakra", path: "/kit/rotating-chakra-backdrop", desc: "Moving Mandap Backdrop" }
  ];

  return (
    <div className="page" style={{ paddingTop: 32, paddingBottom: 64 }}>
      <div className="sec">
        <div className="wrap">
          <div className="okbox" style={{ maxWidth: 760, margin: "0 auto", textAlign: "center" }}>
            <div className="eyebrow center" style={{ fontSize: 14, letterSpacing: "0.15em" }}>404 · ERROR</div>
            
            <h1 style={{ fontSize: "clamp(32px,4.5vw,52px)", margin: "8px 0 16px", lineHeight: 1.15 }}>
              This page wandered off during visarjan.
            </h1>

            <p style={{ fontSize: 17, color: "var(--muted)", maxWidth: 620, margin: "0 auto 32px", lineHeight: 1.6 }}>
              We couldn't find what you were looking for. The link might have changed or moved.
              Explore our Ganesh Chaturthi 2026 collection below to get back on track.
            </p>

            <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", marginBottom: 44 }}>
              <Link className="btn btn-gold btn-lg" to="/">
                ✦ Back to Homepage
              </Link>
              <Link className="btn btn-line btn-lg" to="/bulk">
                Corporate &amp; Bulk Enquiries
              </Link>
            </div>

            {/* Quick Links Grid */}
            <div style={{ textAlign: "left", marginTop: 36, paddingTop: 28, borderTop: "1px dashed var(--line)" }}>
              <h3 style={{ fontSize: 18, marginBottom: 16, textAlign: "center", color: "var(--ink)" }}>
                Popular Kits &amp; Collections
              </h3>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: 14
                }}
              >
                {popularKits.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    style={{
                      display: "block",
                      padding: "14px 16px",
                      borderRadius: 10,
                      background: "rgba(255,255,255,0.7)",
                      border: "1px solid var(--line)",
                      textDecoration: "none",
                      color: "inherit",
                      transition: "all 0.2s ease"
                    }}
                  >
                    <strong style={{ display: "block", fontSize: 15, color: "var(--teal-800)", marginBottom: 4 }}>
                      {item.title} →
                    </strong>
                    <span style={{ fontSize: 13, color: "var(--muted)" }}>{item.desc}</span>
                  </Link>
                ))}
              </div>
            </div>

            <p style={{ marginTop: 40, fontFamily: "var(--serif)", fontSize: 24, color: "var(--gold-600)" }}>
              गणपति बाप्पा मोर्या
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
