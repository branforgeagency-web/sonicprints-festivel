import { Link } from "react-router-dom";
import { useSite, money } from "../context/SiteContext.jsx";
import SEOHead from "../components/SEOHead.jsx";
import Icon from "../components/Icon.jsx";
import { BLOG_POSTS } from "../data/blogs.js";

export default function SitemapPage() {
  const { products, config } = useSite();

  const mainPages = [
    { title: "Home — Ganesh Festival Collection 2026", path: "/", desc: "Complete 2026 festival showcase, interactive 3D kit carousel, and animated celebration features." },
    { title: "Bulk & Corporate Orders", path: "/bulk", desc: "Volume slabs for 25 to 5,000+ units for offices, schools, academies, and dealers." },
    { title: "Festival Guides & Blog", path: "/blog", desc: "Authoritative guides on eco visarjan, 10-minute mandap setups, and festive traditions." },
    { title: "Track Your Orders (Live Fulfillment)", path: "/track", desc: "Check live status, items, delivery schedule, and GPS map tracking with mobile lookup." },
    { title: "Checkout & Instant Payment", path: "/checkout", desc: "Secure online checkout with Cashfree / Razorpay or direct WhatsApp ordering." }
  ];

  return (
    <div className="page sitemap-page">
      <SEOHead
        title="HTML & XML Sitemap | Sonic Prints Ganesh Festival Collection 2026"
        description="Comprehensive index of all festival kits, puja sets, mandaps, bulk corporate ordering, and order tracking pages on Sonic Prints."
        canonical="/sitemap"
      />

      <header className="phead" style={{ padding: "48px 0 36px" }}>
        <div className="wrap">
          <div className="eyebrow light">Site Directory</div>
          <h1 style={{ fontSize: "clamp(32px,4vw,52px)" }}>Website Sitemap</h1>
          <p>
            Browse all pages, product landing catalogs, and quick links across the Sonic Prints Ganesh Festival 2026 store.
          </p>
        </div>
      </header>

      <section className="sec" style={{ paddingTop: 20 }}>
        <div className="wrap" style={{ maxWidth: 960 }}>
          <div className="sitemap-grid" style={{ display: "grid", gap: 32 }}>
            {/* 1. Main Navigation & Storefront */}
            <div className="panel" style={{ padding: "28px 32px", borderRadius: 18, border: "1.5px solid rgba(184, 142, 68, 0.25)", background: "#FFF" }}>
              <h2 style={{ fontSize: 22, fontFamily: "var(--serif, serif)", color: "#0A2E2B", marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
                <span>🏛️</span> Storefront &amp; Main Pages
              </h2>
              <div style={{ display: "grid", gap: 14 }}>
                {mainPages.map((p) => (
                  <div key={p.path} style={{ borderBottom: "1px dashed rgba(0,0,0,0.08)", paddingBottom: 12 }}>
                    <Link to={p.path} style={{ fontSize: 16, fontWeight: 700, color: "#8C651F", textDecoration: "none" }}>
                      {p.title} →
                    </Link>
                    <p style={{ margin: "4px 0 0", fontSize: 13.5, color: "#5C7370" }}>{p.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Products & Kits Catalog */}
            <div className="panel" style={{ padding: "28px 32px", borderRadius: 18, border: "1.5px solid rgba(184, 142, 68, 0.25)", background: "#FFF" }}>
              <h2 style={{ fontSize: 22, fontFamily: "var(--serif, serif)", color: "#0A2E2B", marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
                <span>📦</span> Festival Kits Catalog (2026 Collection)
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
                {(products || []).map((p) => (
                  <div key={p.slug} style={{ background: "#FAF7F2", border: "1px solid rgba(184,142,68,0.2)", borderRadius: 12, padding: "16px 18px" }}>
                    <Link to={`/kit/${p.slug}`} style={{ fontSize: 15, fontWeight: 700, color: "#0A2E2B", textDecoration: "none", display: "block", marginBottom: 4 }}>
                      {p.name} →
                    </Link>
                    <span style={{ fontSize: 12, color: "#8C651F", fontWeight: 600, display: "block" }}>
                      {p.subtitle || p.badge} · {money(p.price)}
                    </span>
                    <p style={{ fontSize: 12.5, color: "#5C7370", margin: "6px 0 0", lineHeight: 1.4 }}>
                      {p.desc ? p.desc.slice(0, 85) + "…" : "100% natural clay, non-toxic colors & sealed prasadam."}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Festival Collection Blog */}
            <div className="panel" style={{ padding: "28px 32px", borderRadius: 18, border: "1.5px solid rgba(184, 142, 68, 0.25)", background: "#FFF" }}>
              <h2 style={{ fontSize: 22, fontFamily: "var(--serif, serif)", color: "#0A2E2B", marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
                <span>📖</span> Festival Collection Blog
              </h2>
              <p style={{ margin: "0 0 16px", fontSize: 14, color: "#5C7370" }}>
                Complete design stories, Vedic traditions, and setup guides for all six festival products on one dedicated page:
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
                <div style={{ background: "#FAF7F2", border: "1.5px solid rgba(184,142,68,0.3)", borderRadius: 12, padding: "18px 20px" }}>
                  <Link to="/ganesh-chaturthi-2026-celebration-ideas" style={{ fontSize: 15.5, fontWeight: 700, color: "#0A2E2B", textDecoration: "none", display: "block", marginBottom: 4 }}>
                    Planning Ganesh Chaturthi 2026? Here Are 6 Ideas to Try →
                  </Link>
                  <span style={{ fontSize: 12, color: "#8C651F", fontWeight: 600, display: "block" }}>
                    Flagship 2026 Celebration Guide
                  </span>
                  <p style={{ fontSize: 12.5, color: "#5C7370", margin: "6px 0 0", lineHeight: 1.4 }}>
                    From festive home setups and kids&apos; activities to décor, gifting and office celebrations, find ideas to make Ganesh Chaturthi 2026 memorable.
                  </p>
                </div>
                <div style={{ background: "#FAF7F2", border: "1px solid rgba(184,142,68,0.2)", borderRadius: 12, padding: "18px 20px" }}>
                  <Link to="/blog" style={{ fontSize: 15.5, fontWeight: 700, color: "#0A2E2B", textDecoration: "none", display: "block", marginBottom: 4 }}>
                    Festival Collection Stories &amp; 6 Kits →
                  </Link>
                  <span style={{ fontSize: 12, color: "#8C651F", fontWeight: 600, display: "block" }}>
                    Complete 2026 Collection Feature
                  </span>
                  <p style={{ fontSize: 12.5, color: "#5C7370", margin: "6px 0 0", lineHeight: 1.4 }}>
                    Shubharambh Mini, Employee Puja Box, Bal Ganesh Kids Kit, Make Your Own Ganesha, Gruha Ganapathi Mandap, and Rotating Chakra.
                  </p>
                </div>
              </div>
            </div>

            {/* 4. Search Engine Feeds & XML Sitemap */}
            <div className="panel" style={{ padding: "24px 28px", borderRadius: 16, background: "linear-gradient(135deg, #FAF7F0 0%, #F5ECDD 100%)", border: "1px solid rgba(184,142,68,0.3)" }}>
              <h3 style={{ fontSize: 17, color: "#0A2E2B", margin: "0 0 8px" }}>🤖 Search Engine &amp; Developer Feeds</h3>
              <p style={{ fontSize: 13.5, color: "#5C7370", margin: "0 0 12px" }}>
                Machine-readable XML sitemap for Google Search Console, Bing Webmaster, and automated indexers:
              </p>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <a href="/sitemap.xml" target="_blank" rel="noopener noreferrer" className="btn btn-gold btn-sm">
                  📄 View XML Sitemap (sitemap.xml) ↗
                </a>
                <a href="/robots.txt" target="_blank" rel="noopener noreferrer" className="btn btn-line btn-sm">
                  🤖 View robots.txt ↗
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
