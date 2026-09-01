import { useEffect, useState } from "react";
import { getSiteConfig, adminUpdateConfig } from "../../api/client.js";
import Icon from "../../components/Icon.jsx";

const FIELDS = [
  ["whatsapp", "WhatsApp Number (digits with country code, no +)", "+91 93845 56755"],
  ["phone", "Storefront Display Phone Number", "+91 93845 56755"],
  ["phoneHref", "Tel: Link Dial String", "+91 93845 56755"],
  ["email", "Official Contact Email", "branforgeagency@gmail.com"],
  ["city", "City & Region (Footer)", "Coimbatore, Tamil Nadu"],
  ["address", "Full Headquarters Address", "Sonic Prints, Coimbatore, Tamil Nadu, India"],
  ["instagram", "Instagram Profile URL", "https://www.instagram.com/sonicprints.in"],
  ["freeShipAbove", "Free Delivery Threshold (₹)", "1499", "number"],
  ["shipFlat", "Flat Shipping Rate Below Threshold (₹)", "79", "number"],
  ["bulkThreshold", "Bulk Slab Pricing Threshold (Qty)", "25", "number"],
  ["cashfreeAppId", "Cashfree App ID (Client ID)", "CF123456..."],
  ["cashfreeSecretKey", "Cashfree Secret Key", "cfsk_ma_test_..."],
  ["cashfreeMode", "Cashfree Environment (sandbox / production)", "sandbox"],
  ["razorpayKeyId", "Razorpay Key ID (Fallback)", "rzp_live_..."],
  ["festivalDateISO", "Ganesh Chaturthi Date (ISO String)", "2026-09-14T06:00:00+05:30"],
  ["orderCutoffLabel", "Top Banner Cutoff Notice", "Order by 6 Sept for guaranteed pre-festival delivery"]
];

export default function AdminSettings() {
  const [config, setConfig] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getSiteConfig().then(setConfig).catch(console.error);
  }, []);

  function setField(name, value) {
    setConfig((c) => ({ ...c, [name]: value }));
    setSaved(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await adminUpdateConfig({
        ...config,
        freeShipAbove: Number(config.freeShipAbove),
        shipFlat: Number(config.shipFlat),
        bulkThreshold: Number(config.bulkThreshold)
      });
      setConfig(updated);
      setSaved(true);
    } catch (err) {
      console.error("Config save error:", err);
    } finally {
      setSaving(false);
    }
  }

  if (!config) {
    return (
      <div className="admin-page">
        <div className="admin-card admin-loading-state" style={{ padding: 36, textAlign: "center" }}>
          <span className="pageLoader-ring" style={{ width: 32, height: 32, margin: "0 auto 12px" }} />
          <p>Loading site configuration…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-header-row">
        <div>
          <span className="admin-eyebrow">⚙️ Store Configuration</span>
          <h2 className="admin-title">Site &amp; Business Settings</h2>
          <p className="admin-subtitle">
            Configure contact handles, shipping thresholds, payment gateway credentials, and festival countdown timers.
          </p>
        </div>
        <div className="admin-header-actions">
          {saved && <span style={{ color: "#6EE7B7", fontSize: 13.5, fontWeight: 600 }}>✓ Settings Saved</span>}
        </div>
      </div>

      <form className="admin-form admin-card" onSubmit={handleSubmit}>
        <div className="admin-grid2">
          {FIELDS.map(([key, label, placeholder, type]) => (
            <div key={key}>
              <label>{label}</label>
              <input
                type={type || "text"}
                value={config[key] ?? ""}
                placeholder={placeholder}
                onChange={(e) => setField(key, e.target.value)}
              />
            </div>
          ))}
        </div>
        <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 14 }}>
          <button className="admin-btn btn-icon" type="submit" disabled={saving}>
            <Icon name="check" size={16} /> {saving ? "Saving Changes…" : "Save Site Settings"}
          </button>
          {saved && <span style={{ color: "#6EE7B7", fontSize: 13.5, fontWeight: 600 }}>Changes applied live to storefront ✓</span>}
        </div>
      </form>
    </div>
  );
}
