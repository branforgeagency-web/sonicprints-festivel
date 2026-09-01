import { useState, useEffect } from "react";
import { useSite, money } from "../context/SiteContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { submitEnquiry } from "../api/client.js";
import { openWhatsApp, waLink } from "../utils/whatsapp.js";
import useReveal from "../hooks/useReveal.js";
import Magnetic from "../components/fx/Magnetic.jsx";
import Icon from "../components/Icon.jsx";
import SEOHead from "../components/SEOHead.jsx";
import {
  BULK_SEGMENTS, BULK_KIT_OPTIONS, BULK_QTY_OPTIONS, BULK_BRANDING_OPTIONS, VOLUME_RATE_TABLE
} from "../data/content.js";

const EMPTY_FORM = {
  segment: BULK_SEGMENTS[0].name, name: "", phone: "", org: "", city: "", email: "",
  kits: [], qty: BULK_QTY_OPTIONS[0], date: "", brand: BULK_BRANDING_OPTIONS[0], note: ""
};

export default function Bulk() {
  const { config } = useSite();
  const toast = useToast();
  useReveal();
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  function setField(name, value) {
    setForm((f) => ({ ...f, [name]: value }));
  }

  function toggleKit(kit) {
    setForm((f) => ({
      ...f,
      kits: f.kits.includes(kit) ? f.kits.filter((k) => k !== kit) : [...f.kits, kit]
    }));
  }

  function pickSegment(seg) {
    setField("segment", seg.name);
    document.getElementById("bulkForm")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) {
      toast("Please enter your contact name and mobile number");
      return;
    }
    setSubmitting(true);
    const payload = {
      segment: form.segment, organisation: form.org, name: form.name, phone: form.phone,
      email: form.email, city: form.city, kitsInterested: form.kits, approxQty: form.qty,
      neededBy: form.date, brandingRequired: form.brand, note: form.note
    };
    try {
      const { whatsappText } = await submitEnquiry(payload);
      toast("Opening WhatsApp with your corporate enquiry…");
      openWhatsApp(config.whatsapp, whatsappText);
      setForm(EMPTY_FORM);
    } catch (err) {
      toast("Opening WhatsApp directly with your enquiry details…");
      const lines = [
        "*SONIC PRINTS — EXECUTIVE BULK ENQUIRY*",
        "Ganesh Festival Collection 2026", "",
        `Segment: ${form.segment}`, form.org && `Organisation: ${form.org}`,
        `Contact Name: ${form.name}`, `Mobile / WA: ${form.phone}`, form.email && `Email: ${form.email}`,
        form.city && `City: ${form.city}`, form.kits.length && `Kits of interest: ${form.kits.join(", ")}`,
        `Approx. Quantity: ${form.qty}`, form.date && `Needed By: ${form.date}`,
        `Branding Required: ${form.brand}`, form.note && `Special Requirements: ${form.note}`
      ].filter(Boolean);
      openWhatsApp(config.whatsapp, lines.join("\n"));
    } finally {
      setSubmitting(false);
    }
  }

  const bulkSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Corporate Ganesh Gifting & Bulk Puja Kits Supply",
    "provider": {
      "@type": "Organization",
      "name": "Sonic Prints",
      "url": "https://sonicprints.shop"
    },
    "serviceType": "Corporate Gift Supplier",
    "description": "Bulk supply of eco-friendly clay Ganesh idols, customized corporate puja boxes, school DIY activity kits, and retail dealer display stands for Ganesh Chaturthi 2026.",
    "areaServed": {
      "@type": "Country",
      "name": "India"
    },
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "INR",
      "lowPrice": "185",
      "highPrice": "1999",
      "offerCount": "6"
    }
  };

  return (
    <div className="page luxury-bulk-page light-gold-theme">
      <SEOHead
        title="Corporate Ganesh Festival Gifting & Bulk Puja Kits Wholesale 2026 | Sonic Prints"
        description="Direct factory rates on corporate Ganesh gifts, branded employee puja boxes, school DIY kits, and dealer displays for Ganesh Chaturthi 2026. Request rate card & samples."
        keywords="Corporate Ganesh gifting, bulk ganesh idols, wholesale ganesh puja kit, employee festival gift box, ganesh return gifts wholesale, dealer ganesh display stand, custom logo ganesh kit"
        canonical="/bulk"
        schema={bulkSchema}
      />
      {/* Light Gold Hero Header with Divine Ganesha Background */}
      <header className="phead luxury-phead phead-light-gold">
        <div className="phead-bg" aria-hidden="true">
          <img
            src="/assets/img/cartoon-ganesha-mouse-bg.jpg"
            alt="Cartoon Lord Ganesha playing with mouse companion Mooshika"
            loading="eager"
            decoding="async"
            fetchpriority="high"
          />
          <span className="phead-overlay phead-overlay-gold" />
        </div>

        <div className="wrap">
          <div className="phead-badge-row">
            <span className="phead-gold-badge light-badge">👑 Sonic Corporate &amp; Volume Suite</span>
            <span className="phead-subtitle-tag" style={{ color: "#7A5E26" }}>Direct Factory Rates · Custom Branding</span>
          </div>

          <h1 className="phead-title" style={{ color: "#0A2E2B" }}>
            Buy the Festival<br />
            <span className="phead-title-gold" style={{ background: "linear-gradient(135deg, #B88E44 0%, #8C651F 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              in Volume.
            </span>
          </h1>

          <p className="phead-desc" style={{ color: "#4A615D" }}>
            Six signature kits, direct factory pricing, and one seamless supply chain.
            Whether gifting 500 corporate boxes, stocking a retail counter, or organising a school activity —
            we provide same-day rate cards and physical samples before you commit.
          </p>

          <div className="btnrow" style={{ margin: "28px 0 36px" }}>
            <Magnetic>
              <a
                className="btn btn-gold btn-lg"
                href="#top"
                onClick={(e) => {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                ✦ Request Executive Rate Card
              </a>
            </Magnetic>
            <Magnetic>
              <a
                className="btn btn-ghost btn-lg"
                style={{ borderColor: "rgba(184, 142, 68, 0.4)", color: "#8C651F" }}
                href={waLink(config.whatsapp, "Namaste Sonic Prints, I would like to request a corporate rate card and sample box.")}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon name="mail" size={16} /> WhatsApp Corporate Desk
              </a>
            </Magnetic>
          </div>

          {/* Light Gold Executive Metrics Bar */}
          <div className="phead-metrics-bar light-metrics-bar">
            <div className="pm-item pm-item-light">
              <span className="pm-icon">🚚</span>
              <div>
                <strong style={{ color: "#0A2E2B" }}>48-Hour Dispatch</strong>
                <span style={{ color: "#5C7370" }}>Pan-South India delivery slots</span>
              </div>
            </div>
            <div className="pm-item pm-item-light">
              <span className="pm-icon">🎨</span>
              <div>
                <strong style={{ color: "#0A2E2B" }}>Custom Branding</strong>
                <span style={{ color: "#5C7370" }}>Printed sleeves &amp; MD video QR card</span>
              </div>
            </div>
            <div className="pm-item pm-item-light">
              <span className="pm-icon">📜</span>
              <div>
                <strong style={{ color: "#0A2E2B" }}>GST &amp; FSSAI Certified</strong>
                <span style={{ color: "#5C7370" }}>Official B2B invoice &amp; sealed prasadam</span>
              </div>
            </div>
            <div className="pm-item pm-item-light">
              <span className="pm-icon">🎁</span>
              <div>
                <strong style={{ color: "#0A2E2B" }}>Sample Before Order</strong>
                <span style={{ color: "#5C7370" }}>Physical sample delivered to your desk</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Step 1: Fresh Mint Teal Buyer Segment Selection */}
      <section className="sec sec-bulk-segment" id="segments">
        <div className="wrap">
          <div className="sec-head center rv">
            <div className="eyebrow center" style={{ color: "#175752" }}>Step One · Select Your Segment</div>
            <h2 style={{ fontSize: "clamp(28px,4vw,44px)", color: "#0A2E2B" }}>Which buyer segment are you?</h2>
            <p style={{ color: "#3A5C56", maxWidth: 640, margin: "0 auto" }}>
              Choose your profile below. The enquiry form automatically configures itself with tailored pricing and delivery slabs.
            </p>
          </div>

          <div className="segs segs-luxury">
            {BULK_SEGMENTS.map((seg, i) => {
              const isSelected = form.segment === seg.name;
              return (
                <button
                  type="button"
                  key={seg.id}
                  className={`seg seg-lux seg-lux-light rv rv-d${i % 3}${isSelected ? " on" : ""}`}
                  onClick={() => pickSegment(seg)}
                >
                  <div className="seg-top-row">
                    <div className="aud-ic-lux aud-ic-lux-gold"><Icon name={seg.icon} /></div>
                    {isSelected && <span className="seg-selected-tag light-tag">✓ Selected</span>}
                  </div>
                  <h3 style={{ color: "#0A2E2B" }}>{seg.name}</h3>
                  <div className="line" style={{ color: "#946C24" }}>{seg.line}</div>
                  <p style={{ color: "#5C7370" }}>{seg.text}</p>
                  <div className="seg-rec-pill" style={{ color: "#8C651F" }}>
                    <strong>Recommended:</strong> {seg.recommended}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Step 2: Warm Sandalwood Enquiry Form Section */}
      <section className="sec sec-bulk-form" id="bulkForm">
        <div className="wrap">
          <div className="sec-head center rv" style={{ marginBottom: 36 }}>
            <div className="eyebrow center" style={{ color: "#946C24" }}>Step Two · Raised Enquiry</div>
            <h2 style={{ fontSize: "clamp(28px,4vw,44px)", color: "#0A2E2B" }}>
              Tell us your requirement
            </h2>
            <p style={{ color: "#5C7370", maxWidth: 600, margin: "0 auto" }}>
              Enquiring as <strong style={{ color: "#0A2E2B" }}>{form.segment}</strong>.
              Zero obligation — receive pricing, artwork layout mockup, and a physical sample box first.
            </p>
          </div>

          <div className="panel panel-luxury" style={{ maxWidth: 860, margin: "0 auto" }}>
            <form className="form" noValidate onSubmit={handleSubmit}>
              <div className="f2">
                <div className="fld">
                  <label style={{ color: "#8C651F" }}>Contact Name *</label>
                  <input
                    value={form.name}
                    onChange={(e) => setField("name", e.target.value)}
                    required
                    placeholder="e.g. Rajesh Kumar"
                  />
                </div>
                <div className="fld">
                  <label style={{ color: "#8C651F" }}>Mobile / WhatsApp Number *</label>
                  <input
                    value={form.phone}
                    onChange={(e) => setField("phone", e.target.value)}
                    required
                    inputMode="tel"
                    placeholder="10-digit mobile number"
                  />
                </div>
              </div>

              <div className="f2">
                <div className="fld">
                  <label style={{ color: "#8C651F" }}>Organisation / Company Name</label>
                  <input
                    value={form.org}
                    onChange={(e) => setField("org", e.target.value)}
                    placeholder="e.g. Infosys / DPS / Retail Store"
                  />
                </div>
                <div className="fld">
                  <label style={{ color: "#8C651F" }}>City &amp; State</label>
                  <input
                    value={form.city}
                    onChange={(e) => setField("city", e.target.value)}
                    placeholder="e.g. Chennai, Tamil Nadu"
                  />
                </div>
              </div>

              <div className="f2">
                <div className="fld">
                  <label style={{ color: "#8C651F" }}>Official Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setField("email", e.target.value)}
                    placeholder="name@organisation.com"
                  />
                </div>
                <div className="fld">
                  <label style={{ color: "#8C651F" }}>Buyer Category</label>
                  <select value={form.segment} onChange={(e) => setField("segment", e.target.value)}>
                    {BULK_SEGMENTS.map((s) => (
                      <option key={s.id} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="fld">
                <label style={{ color: "#8C651F" }}>Select Kits of Interest</label>
                <div className="qtygrid qtygrid-lux">
                  {BULK_KIT_OPTIONS.map((k) => {
                    const checked = form.kits.includes(k);
                    return (
                      <label key={k} className={checked ? "checked-pill" : ""}>
                        <input type="checkbox" checked={checked} onChange={() => toggleKit(k)} />
                        <span>{checked ? "✓ " : ""}{k}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="f2">
                <div className="fld">
                  <label style={{ color: "#8C651F" }}>Approximate Quantity Slabs</label>
                  <select value={form.qty} onChange={(e) => setField("qty", e.target.value)}>
                    {BULK_QTY_OPTIONS.map((q) => (
                      <option key={q}>{q}</option>
                    ))}
                  </select>
                </div>
                <div className="fld">
                  <label style={{ color: "#8C651F" }}>Target Delivery Date</label>
                  <input type="date" value={form.date} onChange={(e) => setField("date", e.target.value)} />
                </div>
              </div>

              <div className="fld">
                <label style={{ color: "#8C651F" }}>Custom Branding Options</label>
                <select value={form.brand} onChange={(e) => setField("brand", e.target.value)}>
                  {BULK_BRANDING_OPTIONS.map((b) => (
                    <option key={b}>{b}</option>
                  ))}
                </select>
              </div>

              <div className="fld">
                <label style={{ color: "#8C651F" }}>Special Instructions / Multi-Location Delivery Notes</label>
                <textarea
                  value={form.note}
                  onChange={(e) => setField("note", e.target.value)}
                  placeholder="Multiple delivery locations, specific budget limits, sample requests, custom message for QR card..."
                />
              </div>

              <Magnetic className="fx-block" strength={0.22} cap={5}>
                <button className="btn btn-gold btn-lg btn-wide" type="submit" disabled={submitting}>
                  {submitting ? "Processing Enquiry…" : "✦ Send Executive Enquiry on WhatsApp"}
                </button>
              </Magnetic>
              
              <p className="note-s" style={{ textAlign: "center", marginTop: 10 }}>
                🔒 Direct connection to our corporate desk · Instant rate card dispatch within 1 working hour.
              </p>
            </form>
          </div>
        </div>
      </section>

      {/* Step 3: Imperial Dark Obsidian Volume Pricing Matrix */}
      <section className="sec sec-bulk-pricing" id="rateSlabs">
        <div className="wrap">
          <div className="sec-head center rv">
            <div className="eyebrow center" style={{ color: "#F3D085" }}>Step Three · Indicative Rate Slabs</div>
            <h2 style={{ fontSize: "clamp(28px,4vw,44px)", color: "#FFFFFF" }}>
              Volume Pricing Matrix
            </h2>
            <p style={{ color: "#A3C0BC", maxWidth: 640, margin: "0 auto" }}>
              Direct factory pricing tiers for bulk orders. Additional discounts applied for 2,000+ custom branded runs.
            </p>
          </div>

          <div className="admin-table-responsive" style={{ borderRadius: 18, overflow: "hidden", maxWidth: 960, margin: "0 auto" }}>
            <table className="tbl tbl-luxury">
              <thead>
                <tr>
                  <th>Kit Name</th>
                  <th className="num">MRP</th>
                  <th className="num">25–99</th>
                  <th className="num">100–499</th>
                  <th className="num">500–1,999</th>
                  <th className="num">2,000+</th>
                </tr>
              </thead>
              <tbody>
                {VOLUME_RATE_TABLE.map((r) => (
                  <tr key={r.kit}>
                    <td><strong style={{ color: "#FFFFFF", fontWeight: 600 }}>{r.kit}</strong></td>
                    <td className="num" style={{ color: "#A7C7C2" }}>{money(r.mrp)}</td>
                    <td className="num" style={{ color: "#E5F3F0" }}>{money(r.t1)}</td>
                    <td className="num"><strong style={{ color: "#F8E2AC", fontWeight: 700 }}>{money(r.t2)}</strong></td>
                    <td className="num" style={{ color: "#E5F3F0" }}>{money(r.t3)}</td>
                    <td className="num"><strong style={{ color: "#5EEAD4", fontWeight: 700 }}>{money(r.t4)}</strong></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p style={{ fontSize: 13.5, color: "#8FA7A3", marginTop: 18, textAlign: "center", maxWidth: 700, marginInline: "auto", lineHeight: 1.6 }}>
            Rates shown in ₹, excluding GST and freight for standard specifications. Custom branded sleeves, named individual employee delivery, and premium dry fruit prasadam upgrades are quoted separately.
          </p>
        </div>
      </section>

      {/* Step 4: Rich Champagne Gold Dealer & Stockist Partnership */}
      <section className="sec sec-bulk-dealer" id="stockistPartner">
        <div className="wrap">
          <div
            className="panel"
            style={{
              maxWidth: 920,
              margin: "0 auto",
              background: "linear-gradient(135deg, #FFFDF8 0%, #F5EBD9 100%)",
              border: "2px solid #D4A853",
              borderRadius: 22,
              padding: "clamp(32px, 5vw, 48px)",
              color: "#122B27",
              boxShadow: "0 20px 50px rgba(196, 151, 70, 0.16)"
            }}
          >
            <div className="eyebrow" style={{ color: "#946C24" }}>Step Four · Dealer &amp; Stockist Partnership</div>
            <h3 style={{ color: "#0A2E2B", fontSize: "clamp(26px, 3.5vw, 36px)", margin: "8px 0 14px", fontFamily: "var(--serif, serif)" }}>
              Run a Festival Counter
            </h3>
            <p style={{ color: "#5C7370", fontSize: 16, lineHeight: 1.6, maxWidth: 760 }}>
              City, Zone and State partner tiers with wholesale trade pricing, a branded 3×3 m kiosk setup, POS display units, digital video assets, and a 100% buyback guarantee on sealed unsold non-food inventory within 7 days of visarjan.
            </p>

            <ul style={{ listStyle: "none", padding: 0, margin: "24px 0 28px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14 }}>
              <li style={{ fontSize: 14.5, color: "#8C651F" }}>✦ Wholesale trade pricing starting from 100 units</li>
              <li style={{ fontSize: 14.5, color: "#8C651F" }}>✦ Complete branded kiosk display unit with all 6 kits</li>
              <li style={{ fontSize: 14.5, color: "#8C651F" }}>✦ Marketing creative kit &amp; digital WhatsApp catalog</li>
              <li style={{ fontSize: 14.5, color: "#8C651F" }}>✦ Post-festival buyback on sealed unsold non-food stock</li>
            </ul>

            <a
              href={waLink(config.whatsapp, "Namaste Sonic Prints, I am interested in becoming a stockist / dealer partner for Ganesh Chaturthi 2026.")}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-gold btn-lg btn-wide"
              style={{ textAlign: "center", display: "inline-block", maxWidth: 420 }}
            >
              Apply for Stockist / Dealer Partner Desk ↗
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
