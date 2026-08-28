import { useEffect, useState } from "react";
import { getSiteConfig, adminUpdateConfig } from "../../api/client.js";

const FIELDS = [
  ["whatsapp", "WhatsApp number (digits only, country code, no +)", "+91 63827 18655"],
  ["phone", "Phone number shown on site (display format)", "+91 63827 18655"],
  ["phoneHref", "Phone number for tel: links", "+91 63827 18655"],
  ["email", "Contact email", "branforgeagency@gmail.com"],
  ["city", "City / region shown in footer", "Coimbatore, Tamil Nadu"],
  ["address", "Full address", "Sonic Prints, Coimbatore, Tamil Nadu, India"],
  ["instagram", "Instagram URL", "https://instagram.com/sonicprints"],
  ["freeShipAbove", "Free delivery above (₹)", "1499", "number"],
  ["shipFlat", "Flat delivery charge below that (₹)", "79", "number"],
  ["bulkThreshold", "Bulk pricing kicks in at (qty)", "25", "number"],
  ["cashfreeAppId", "Cashfree App ID (Client ID)", "CF123456..."],
  ["cashfreeMode", "Cashfree Mode (sandbox or production)", "sandbox"],
  ["razorpayKeyId", "Razorpay Key ID (legacy / fallback)", "rzp_live_..."],
  ["festivalDateISO", "Festival date/time (ISO, drives the countdown)", "2026-09-14T06:00:00+05:30"],
  ["orderCutoffLabel", "Cutoff message shown in the top bar", "Order by 6 Sept for guaranteed pre-festival delivery"]
];

export default function AdminSettings() {
  const [config, setConfig] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => { getSiteConfig().then(setConfig); }, []);

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
    } finally {
      setSaving(false);
    }
  }

  if (!config) return <p>Loading…</p>;

  return (
    <div>
      <h2>Site settings</h2>
      <p className="sub">Contact details, WhatsApp number and commerce rules used across the storefront.</p>

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
        <button className="admin-btn" type="submit" disabled={saving}>{saving ? "Saving…" : "Save settings"}</button>
        {saved && <span style={{ marginLeft: 12, color: "#1c7a35", fontSize: 13.5 }}>Saved ✓</span>}
      </form>
    </div>
  );
}
