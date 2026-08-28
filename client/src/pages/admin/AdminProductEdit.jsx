import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { adminGetProduct, adminUpdateProduct } from "../../api/client.js";

// Simple fields get friendly inputs. The structured bits (variants, designs,
// highlights, specs, bulk pricing, contents, lede paragraphs, process steps)
// are edited as JSON — flexible, and matches the shape returned by the API,
// without needing a bespoke sub-form for every nested array.
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
      JSON_FIELDS.forEach(([key]) => { texts[key] = JSON.stringify(p[key] ?? (key === "processSteps" ? {} : []), null, 2); });
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
      name: product.name, subtitle: product.subtitle, badge: product.badge, tag: product.tag,
      whyHeadline: product.whyHeadline, shortDescription: product.shortDescription,
      kitDescription: product.kitDescription, kitWho: product.kitWho, bestFor: product.bestFor,
      price: Number(product.price), img: product.img, active: product.active, order: Number(product.order)
    };
    try {
      for (const [key] of JSON_FIELDS) {
        payload[key] = JSON.parse(jsonText[key]);
      }
    } catch (err) {
      setError("One of the JSON fields is not valid JSON — check for a stray comma or missing bracket.");
      return;
    }

    setSaving(true);
    try {
      await adminUpdateProduct(product._id, payload);
      navigate("/admin/products");
    } catch (err) {
      setError(err?.response?.data?.message || "Could not save this product");
    } finally {
      setSaving(false);
    }
  }

  if (!product) return <p>Loading…</p>;

  return (
    <div>
      <h2>Edit {product.name}</h2>
      <p className="sub"><Link to="/admin/products">← Back to products</Link></p>

      {error && <div className="admin-error">{error}</div>}

      <form className="admin-form" onSubmit={handleSubmit}>
        <div className="admin-card">
          <div className="admin-grid2">
            <div><label>Name</label><input value={product.name} onChange={(e) => setField("name", e.target.value)} /></div>
            <div><label>Subtitle</label><input value={product.subtitle} onChange={(e) => setField("subtitle", e.target.value)} /></div>
            <div><label>Badge</label><input value={product.badge} onChange={(e) => setField("badge", e.target.value)} /></div>
            <div><label>Tagline</label><input value={product.tag} onChange={(e) => setField("tag", e.target.value)} /></div>
            <div><label>Price (₹)</label><input type="number" value={product.price} onChange={(e) => setField("price", e.target.value)} /></div>
            <div><label>Image key (filename under /assets/img, no extension)</label><input value={product.img} onChange={(e) => setField("img", e.target.value)} /></div>
            <div><label>Display order</label><input type="number" value={product.order} onChange={(e) => setField("order", e.target.value)} /></div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 22 }}>
              <input type="checkbox" checked={product.active} onChange={(e) => setField("active", e.target.checked)} id="active" />
              <label htmlFor="active" style={{ margin: 0 }}>Visible on storefront</label>
            </div>
          </div>
          <label>Short description (card + product page)</label>
          <textarea value={product.shortDescription} onChange={(e) => setField("shortDescription", e.target.value)} />
          <label>"Why this kit exists" headline</label>
          <input value={product.whyHeadline} onChange={(e) => setField("whyHeadline", e.target.value)} />
          <label>Best for</label>
          <input value={product.bestFor} onChange={(e) => setField("bestFor", e.target.value)} />
        </div>

        {JSON_FIELDS.map(([key, label]) => (
          <div className="admin-card" key={key}>
            <label>{label}</label>
            <textarea
              style={{ fontFamily: "monospace", minHeight: 140 }}
              value={jsonText[key] || ""}
              onChange={(e) => setJsonText((t) => ({ ...t, [key]: e.target.value }))}
            />
          </div>
        ))}

        <button className="admin-btn" type="submit" disabled={saving}>{saving ? "Saving…" : "Save changes"}</button>
      </form>
    </div>
  );
}
