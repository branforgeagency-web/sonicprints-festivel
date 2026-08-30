import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { adminGetProduct, adminUpdateProduct } from "../../api/client.js";
import Icon from "../../components/Icon.jsx";

const JSON_FIELDS = [
  ["highlights", "Highlights (4 shown on the product page: [{title, text}])"],
  ["ledeParagraphs", '"Why this kit exists" paragraphs (array of strings)'],
  ["contents", '"Inside the box" items (array of strings)'],
  ["specs", "Specification table rows ([{label, value}])"],
  ["bulkPricing", "Bulk pricing tiers ([{range, price, savingsLabel}])"],
  ["variants", "Size/variant options, if any ([{id, name, price, note}])"],
  ["designs", "Design options, if any ([{id, name, note, img, sheet}])"],
  ["processSteps", 'Optional step grid ({eyebrow, headline, steps: [{title, text}]})']
];

export default function AdminProductEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [jsonText, setJsonText] = useState({});
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    adminGetProduct(id).then((p) => {
      setProduct(p);
      const texts = {};
      JSON_FIELDS.forEach(([key]) => {
        texts[key] = JSON.stringify(p[key] ?? (key === "processSteps" ? {} : []), null, 2);
      });
      setJsonText(texts);
    });
  }, [id]);

  function setField(name, value) {
    setProduct((p) => ({ ...p, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    const payload = {
      name: product.name,
      subtitle: product.subtitle,
      badge: product.badge,
      tag: product.tag,
      whyHeadline: product.whyHeadline,
      shortDescription: product.shortDescription,
      kitDescription: product.kitDescription,
      kitWho: product.kitWho,
      bestFor: product.bestFor,
      price: Number(product.price),
      img: product.img,
      active: product.active,
      order: Number(product.order)
    };
    try {
      for (const [key] of JSON_FIELDS) {
        payload[key] = JSON.parse(jsonText[key]);
      }
    } catch (err) {
      setError("One of the JSON configuration fields contains invalid syntax — verify quotes, commas and brackets.");
      return;
    }

    setSaving(true);
    try {
      await adminUpdateProduct(product._id, payload);
      navigate("/admin/products");
    } catch (err) {
      setError(err?.response?.data?.message || "Could not update this product");
    } finally {
      setSaving(false);
    }
  }

  if (!product) {
    return (
      <div className="admin-page">
        <div className="admin-card admin-loading-state" style={{ padding: 36, textAlign: "center" }}>
          <span className="pageLoader-ring" style={{ width: 32, height: 32, margin: "0 auto 12px" }} />
          <p>Loading product record…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-header-row">
        <div>
          <span className="admin-eyebrow">
            <Link to="/admin/products" style={{ color: "#DFB76C", textDecoration: "none" }}>
              ← Products Catalog
            </Link>{" "}
            · Edit Kit
          </span>
          <h2 className="admin-title">Editing: {product.name}</h2>
          <p className="admin-subtitle">Modify kit pricing, badges, descriptions, and structured specifications.</p>
        </div>
        <div className="admin-header-actions">
          <Link to={`/kit/${product.slug}`} target="_blank" rel="noreferrer" className="admin-btn ghost btn-icon">
            <Icon name="eye" size={15} /> Preview Live Page ↗
          </Link>
        </div>
      </div>

      {error && <div className="admin-error">⚠️ {error}</div>}

      <form className="admin-form" onSubmit={handleSubmit}>
        <div className="admin-card">
          <h3 className="admin-card-title" style={{ marginBottom: 18 }}>
            Core Details &amp; Pricing
          </h3>
          <div className="admin-grid2">
            <div>
              <label>Kit Name</label>
              <input value={product.name || ""} onChange={(e) => setField("name", e.target.value)} required />
            </div>
            <div>
              <label>Subtitle / Category</label>
              <input value={product.subtitle || ""} onChange={(e) => setField("subtitle", e.target.value)} />
            </div>
            <div>
              <label>Highlight Badge</label>
              <input value={product.badge || ""} onChange={(e) => setField("badge", e.target.value)} placeholder="e.g. Best Seller" />
            </div>
            <div>
              <label>Tagline</label>
              <input value={product.tag || ""} onChange={(e) => setField("tag", e.target.value)} />
            </div>
            <div>
              <label>Base Price (₹)</label>
              <input type="number" value={product.price ?? 0} onChange={(e) => setField("price", e.target.value)} required />
            </div>
            <div>
              <label>Image Asset Key</label>
              <input value={product.img || ""} onChange={(e) => setField("img", e.target.value)} placeholder="e.g. mini" />
            </div>
            <div>
              <label>Display Sort Order</label>
              <input type="number" value={product.order ?? 0} onChange={(e) => setField("order", e.target.value)} />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 26 }}>
              <input
                type="checkbox"
                checked={!!product.active}
                onChange={(e) => setField("active", e.target.checked)}
                id="active"
                style={{ width: 18, height: 18, accentColor: "#DFB76C", margin: 0 }}
              />
              <label htmlFor="active" style={{ margin: 0, color: "#FFF", fontSize: 14, cursor: "pointer" }}>
                Visible &amp; active on storefront
              </label>
            </div>
          </div>

          <label style={{ marginTop: 14 }}>Short Description</label>
          <textarea value={product.shortDescription || ""} onChange={(e) => setField("shortDescription", e.target.value)} />

          <label>"Why This Kit Exists" Headline</label>
          <input value={product.whyHeadline || ""} onChange={(e) => setField("whyHeadline", e.target.value)} />

          <label>Best For / Ideal Audience</label>
          <input value={product.bestFor || ""} onChange={(e) => setField("bestFor", e.target.value)} />
        </div>

        {JSON_FIELDS.map(([key, label]) => (
          <div className="admin-card" key={key}>
            <label style={{ color: "#DFB76C" }}>{label}</label>
            <textarea
              style={{
                fontFamily: "monospace",
                fontSize: 13,
                minHeight: 140,
                background: "rgba(4, 16, 14, 0.9)",
                color: "#6EE7B7",
                border: "1px solid rgba(223, 183, 108, 0.25)"
              }}
              value={jsonText[key] || ""}
              onChange={(e) => setJsonText((t) => ({ ...t, [key]: e.target.value }))}
            />
          </div>
        ))}

        <div style={{ display: "flex", gap: 14, marginTop: 16 }}>
          <button className="admin-btn btn-icon" type="submit" disabled={saving}>
            <Icon name="check" size={16} /> {saving ? "Saving Changes…" : "Save Product Changes"}
          </button>
          <Link to="/admin/products" className="admin-btn ghost">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
