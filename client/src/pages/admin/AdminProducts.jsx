import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { adminGetProducts, adminUpdateProduct, adminDeleteProduct } from "../../api/client.js";
import { money } from "../../context/SiteContext.jsx";
import Icon from "../../components/Icon.jsx";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  function load() {
    setLoading(true);
    adminGetProducts()
      .then((res) => setProducts(Array.isArray(res) ? res : []))
      .catch((err) => console.error("Error loading products:", err))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function toggleActive(p) {
    const updated = await adminUpdateProduct(p._id, { active: !p.active });
    setProducts((prev) => prev.map((x) => (x._id === p._id ? updated : x)));
  }

  async function remove(p) {
    if (!window.confirm(`Delete "${p.name}"? This action cannot be undone.`)) return;
    await adminDeleteProduct(p._id);
    setProducts((prev) => prev.filter((x) => x._id !== p._id));
  }

  const safeProducts = Array.isArray(products) ? products : [];

  return (
    <div className="admin-page">
      <div className="admin-header-row">
        <div>
          <span className="admin-eyebrow">🎁 Catalog Management</span>
          <h2 className="admin-title">Products &amp; Pricing Catalog</h2>
          <p className="admin-subtitle">
            Manage product offerings, live storefront visibility, pricing slabs, and specifications.
          </p>
        </div>
        <div className="admin-header-actions">
          <button onClick={load} className="admin-btn ghost btn-icon">
            <Icon name="sparkle" size={15} /> Refresh Catalog
          </button>
        </div>
      </div>

      <div className="admin-card admin-table-card">
        {loading ? (
          <div className="admin-loading-state" style={{ padding: 36, textAlign: "center" }}>
            <span className="pageLoader-ring" style={{ width: 32, height: 32, margin: "0 auto 12px" }} />
            <p>Loading products catalog…</p>
          </div>
        ) : (
          <div className="admin-table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Sort Order</th>
                  <th>Product Name &amp; Subtitle</th>
                  <th>URL Slug</th>
                  <th>Base Price</th>
                  <th>Visibility</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {safeProducts.map((p) => (
                  <tr key={p._id}>
                    <td>
                      <span className="item-count-pill">#{p.order ?? 0}</span>
                    </td>
                    <td>
                      <div className="admin-cust-cell">
                        <strong className="cust-name">{p.name}</strong>
                        <span className="cust-phone">{p.subtitle}</span>
                      </div>
                    </td>
                    <td>
                      <code style={{ background: "rgba(255,255,255,0.08)", padding: "3px 8px", borderRadius: 6, color: "#DFB76C", fontSize: 12 }}>
                        /kit/{p.slug}
                      </code>
                    </td>
                    <td>
                      <strong className="order-price">{money(p.price || 0)}</strong>
                      {p.variants?.length ? <span style={{ fontSize: 11.5, color: "#8FA7A3", display: "block" }}>+{p.variants.length} sizes</span> : ""}
                    </td>
                    <td>
                      <label style={{ display: "inline-flex", alignItems: "center", gap: 8, cursor: "pointer", userSelect: "none" }}>
                        <input
                          type="checkbox"
                          checked={!!p.active}
                          onChange={() => toggleActive(p)}
                          style={{ width: 16, height: 16, accentColor: "#DFB76C" }}
                        />
                        <span className={`admin-badge ${p.active ? "badge-confirmed" : "badge-cancelled"}`}>
                          {p.active ? "● Live On Store" : "Hidden"}
                        </span>
                      </label>
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: 8 }}>
                        <Link className="admin-table-action-btn" to={`/admin/products/${p._id}`}>
                          Edit Kit →
                        </Link>
                        <button
                          className="admin-btn-logout"
                          onClick={() => remove(p)}
                          title="Delete Product"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!safeProducts.length && (
                  <tr>
                    <td colSpan={6} style={{ textAlign: "center", padding: "32px", color: "#8FA7A3" }}>
                      No products found in the catalog database.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
