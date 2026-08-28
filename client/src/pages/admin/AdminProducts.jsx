import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { adminGetProducts, adminUpdateProduct, adminDeleteProduct } from "../../api/client.js";
import { money } from "../../context/SiteContext.jsx";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  function load() {
    setLoading(true);
    adminGetProducts().then(setProducts).finally(() => setLoading(false));
  }
  useEffect(load, []);

  async function toggleActive(p) {
    const updated = await adminUpdateProduct(p._id, { active: !p.active });
    setProducts((prev) => prev.map((x) => (x._id === p._id ? updated : x)));
  }

  async function remove(p) {
    if (!window.confirm(`Delete "${p.name}"? This cannot be undone.`)) return;
    await adminDeleteProduct(p._id);
    setProducts((prev) => prev.filter((x) => x._id !== p._id));
  }

  return (
    <div>
      <h2>Products</h2>
      <p className="sub">The six festival kits shown on the storefront. Prices update live.</p>

      <div className="admin-card">
        {loading ? (
          <p>Loading…</p>
        ) : (
          <table className="admin-table">
            <thead><tr><th>Order</th><th>Name</th><th>Slug</th><th>Price</th><th>Active</th><th></th></tr></thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id}>
                  <td>{p.order}</td>
                  <td><b>{p.name}</b><br /><span style={{ color: "#8a9895" }}>{p.subtitle}</span></td>
                  <td>{p.slug}</td>
                  <td>{money(p.price)}{p.variants?.length ? " (+variants)" : ""}</td>
                  <td>
                    <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <input type="checkbox" checked={p.active} onChange={() => toggleActive(p)} /> {p.active ? "Live" : "Hidden"}
                    </label>
                  </td>
                  <td style={{ display: "flex", gap: 8 }}>
                    <Link className="admin-btn ghost" to={`/admin/products/${p._id}`}>Edit</Link>
                    <button className="admin-btn danger" onClick={() => remove(p)}>Delete</button>
                  </td>
                </tr>
              ))}
              {!products.length && <tr><td colSpan={6}>No products yet.</td></tr>}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
