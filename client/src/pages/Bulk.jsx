import { useState } from "react";
import { useSite, money } from "../context/SiteContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { submitEnquiry } from "../api/client.js";
import { openWhatsApp, waLink } from "../utils/whatsapp.js";
import useReveal from "../hooks/useReveal.js";
import Magnetic from "../components/fx/Magnetic.jsx";
import Icon from "../components/Icon.jsx";
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
      toast("Please add your name and mobile number");
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
      toast("Opening WhatsApp with your enquiry…");
      openWhatsApp(config.whatsapp, whatsappText);
      setForm(EMPTY_FORM);
    } catch (err) {
      toast("Could not send just now — opening WhatsApp directly instead");
      const lines = [
        "*SONIC PRINTS — BULK ENQUIRY*", "Ganesh Festival Collection 2026", "",
        `Segment: ${form.segment}`, form.org && `Organisation: ${form.org}`,
        `Contact: ${form.name}`, `Mobile: ${form.phone}`, form.email && `Email: ${form.email}`,
        form.city && `City: ${form.city}`, form.kits.length && `Kits of interest: ${form.kits.join(", ")}`,
        `Approx. quantity: ${form.qty}`, form.date && `Needed by: ${form.date}`,
        `Branding required: ${form.brand}`, form.note && `Note: ${form.note}`
      ].filter(Boolean);
      openWhatsApp(config.whatsapp, lines.join("\n"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page">
      <header className="phead">
        <div className="wrap">
          <div className="eyebrow light">Bulk orders · Corporate · Schools · Retail · Dealers</div>
          <h1>Buy the festival<br />in volume.</h1>
          <p>
            Six kits, six kinds of buyer, one supply chain. Tell us who you are and roughly how many you need —
            we send a rate card the same working day and a physical sample before you commit.
          </p>
          <div className="btnrow" style={{ margin: "26px 0 0" }}>
            <Magnetic>
              <a className="btn btn-gold btn-lg" href="#bulkForm" onClick={(e) => { e.preventDefault(); document.getElementById("bulkForm")?.scrollIntoView({ behavior: "smooth" }); }}>
                Get a rate card
              </a>
            </Magnetic>
            <Magnetic>
              <a className="btn btn-ghost btn-lg" href={waLink(config.whatsapp, "Namaste Sonic Prints, I'd like to raise a bulk enquiry.")} target="_blank" rel="noopener noreferrer">
                WhatsApp our team
              </a>
            </Magnetic>
          </div>
        </div>
      </header>

      <section className="sec">
        <div className="wrap">
          <div className="sec-head center rv">
            <div className="eyebrow center">Step one</div>
            <h2>Which one are you?</h2>
            <p>Pick a segment — the enquiry form below fills itself in and our team replies with pricing built for that use case.</p>
          </div>
          <div className="segs">
            {BULK_SEGMENTS.map((seg, i) => (
              <button
                type="button"
                key={seg.id}
                className={`seg rv rv-d${i % 3}${form.segment === seg.name ? " on" : ""}`}
                onClick={() => pickSegment(seg)}
              >
                <div className="aud-ic"><Icon name={seg.icon} /></div>
                <h3>{seg.name}</h3>
                <div className="line">{seg.line}</div>
                <p>{seg.text}</p>
                <p style={{ marginTop: 12, fontSize: 12.5, color: "var(--gold-600)", fontWeight: 700 }}>
                  Recommended: {seg.recommended}
                </p>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="sec sec-cream">
        <div className="wrap">
          <div className="two" style={{ gap: 44, alignItems: "start" }}>
            <div className="rv">
              <div className="eyebrow">Step two</div>
              <h2 style={{ marginBottom: 10 }}>Tell us what you need</h2>
              <p style={{ color: "var(--muted)", marginBottom: 22 }}>
                Enquiring for <strong style={{ color: "var(--teal-700)" }}>{form.segment}</strong>.
                Nothing is committed at this stage — you will receive pricing, a sample plan and a delivery date first.
              </p>
              <div className="panel">
                <form id="bulkForm" className="form" noValidate onSubmit={handleSubmit}>
                  <div className="f2">
                    <div className="fld"><label>Your name *</label>
                      <input value={form.name} onChange={(e) => setField("name", e.target.value)} required placeholder="Full name" />
                    </div>
                    <div className="fld"><label>Mobile / WhatsApp *</label>
                      <input value={form.phone} onChange={(e) => setField("phone", e.target.value)} required inputMode="tel" placeholder="10-digit number" />
                    </div>
                  </div>
                  <div className="f2">
                    <div className="fld"><label>Organisation</label>
                      <input value={form.org} onChange={(e) => setField("org", e.target.value)} placeholder="Company / school / shop name" />
                    </div>
                    <div className="fld"><label>City</label>
                      <input value={form.city} onChange={(e) => setField("city", e.target.value)} placeholder="City & state" />
                    </div>
                  </div>
                  <div className="f2">
                    <div className="fld"><label>Email</label>
                      <input type="email" value={form.email} onChange={(e) => setField("email", e.target.value)} placeholder="name@company.com" />
                    </div>
                    <div className="fld"><label>Buyer segment</label>
                      <select value={form.segment} onChange={(e) => setField("segment", e.target.value)}>
                        {BULK_SEGMENTS.map((s) => <option key={s.id} value={s.name}>{s.name}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="fld">
                    <label>Kits you are interested in</label>
                    <div className="qtygrid">
                      {BULK_KIT_OPTIONS.map((k) => (
                        <label key={k}>
                          <input type="checkbox" checked={form.kits.includes(k)} onChange={() => toggleKit(k)} />{k}
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="f2">
                    <div className="fld"><label>Approximate quantity</label>
                      <select value={form.qty} onChange={(e) => setField("qty", e.target.value)}>
                        {BULK_QTY_OPTIONS.map((q) => <option key={q}>{q}</option>)}
                      </select>
                    </div>
                    <div className="fld"><label>Needed by</label>
                      <input type="date" value={form.date} onChange={(e) => setField("date", e.target.value)} />
                    </div>
                  </div>
                  <div className="fld">
                    <label>Branding required</label>
                    <select value={form.brand} onChange={(e) => setField("brand", e.target.value)}>
                      {BULK_BRANDING_OPTIONS.map((b) => <option key={b}>{b}</option>)}
                    </select>
                  </div>
                  <div className="fld">
                    <label>Anything else we should know</label>
                    <textarea value={form.note} onChange={(e) => setField("note", e.target.value)} placeholder="Delivery locations, budget per kit, number of sites, special requirements…" />
                  </div>
                  <Magnetic className="fx-block" strength={0.22} cap={5}>
                    <button className="btn btn-gold btn-lg btn-wide" type="submit" disabled={submitting}>
                      {submitting ? "Sending…" : "Send enquiry on WhatsApp"}
                    </button>
                  </Magnetic>
                  <p className="note-s">Your enquiry opens as a ready message in WhatsApp — just press send. We reply within one working day.</p>
                </form>
              </div>
            </div>

            <div className="rv rv-d1">
              <div className="eyebrow">Indicative slab pricing</div>
              <h2 style={{ marginBottom: 16 }}>Volume rates</h2>
              <div style={{ overflowX: "auto" }}>
                <table className="tbl">
                  <thead><tr><th>Kit</th><th className="num">MRP</th><th className="num">25 – 99</th><th className="num">100 – 499</th><th className="num">500 – 1,999</th><th className="num">2,000 +</th></tr></thead>
                  <tbody>
                    {VOLUME_RATE_TABLE.map((r) => (
                      <tr key={r.kit}>
                        <td>{r.kit}</td><td className="num">{money(r.mrp)}</td><td className="num">{money(r.t1)}</td>
                        <td className="num">{money(r.t2)}</td><td className="num">{money(r.t3)}</td><td className="num">{money(r.t4)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 12 }}>
                Per-unit rates in ₹, excluding GST and freight, for standard specification. Mandap and chakra slabs
                are quoted on the Mini size; larger sizes scale proportionally. Branded sleeves, name personalisation
                and premium prasadam are quoted separately.
              </p>

              <div className="panel" style={{ marginTop: 26, background: "linear-gradient(140deg,#175752,#0A2E2B)", border: 0, color: "#D6E7E3" }}>
                <div className="eyebrow light">Dealer &amp; distributor programme</div>
                <h3 style={{ color: "#fff", fontSize: 28, marginBottom: 12 }}>Run a festival counter</h3>
                <p style={{ color: "#B7CBC7", fontSize: 14.5 }}>
                  City, Zone and State partner tiers with trade pricing, a branded 3×3 m kiosk kit, display units,
                  reels and creatives, and a buyback on sealed unsold non-food stock within seven days of visarjan.
                </p>
                <ul style={{ listStyle: "none", padding: 0, margin: "16px 0 20px", display: "grid", gap: 9 }}>
                  <li style={{ fontSize: 13.5, color: "#CFE0DC" }}>✦ &nbsp;Trade pricing from your first 100 units</li>
                  <li style={{ fontSize: 13.5, color: "#CFE0DC" }}>✦ &nbsp;Branded kiosk with all six kits on display</li>
                  <li style={{ fontSize: 13.5, color: "#CFE0DC" }}>✦ &nbsp;Marketing creatives and WhatsApp catalogue provided</li>
                  <li style={{ fontSize: 13.5, color: "#CFE0DC" }}>✦ &nbsp;Buyback on sealed unsold non-food stock</li>
                </ul>
                <p style={{ fontSize: 12.5, color: "#8FA7A3", borderTop: "1px solid rgba(255,255,255,.12)", paddingTop: 14, margin: 0 }}>
                  Sonic Prints partners buy stock at a trade price and sell at MRP — you keep the margin you earn.
                  We do not promise guaranteed returns or income.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
