import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { adminGetOrders, adminGetEnquiries } from "../../api/client.js";
import { money } from "../../context/SiteContext.jsx";

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([adminGetOrders(), adminGetEnquiries()])
      .then(([o, e]) => { setOrders(o); setEnquiries(e); })
      .finally(() => setLoading(false));
  }, []);

  const revenue = orders.filter((o) => o.status !== "cancelled").reduce((s, o) => s + o.total, 0);
  const newOrders = orders.filter((o) => o.status === "new").length;
  const newEnquiries = enquiries.filter((e) => e.status === "new").length;

  return (
    <div>
      <h2>Dashboard</h2>
      <p className="sub">A quick look at what's come in.</p>

      {loading ? (
        <p>Loading…</p>
      ) : (
        <>
          <div className="admin-stats">
            <div className="admin-card admin-stat"><b>{orders.length}</b><span>Total orders</span></div>
            <div className="admin-card admin-stat"><b>{newOrders}</b><span>New / unconfirmed orders</span></div>
            <div className="admin-card admin-stat"><b>{money(revenue)}</b><span>Order value (excl. cancelled)</span></div>
            <div className="admin-card admin-stat"><b>{enquiries.length}</b><span>Bulk enquiries</span></div>
            <div className="admin-card admin-stat"><b>{newEnquiries}</b><span>New enquiries to follow up</span></div>
          </div>

          <div className="admin-card">
            <h3 style={{ marginTop: 0 }}>Latest orders</h3>
            <table className="admin-table">
              <thead><tr><th>Customer</th><th>Items</th><th>Total</th><th>Status</th><th>Placed</th></tr></thead>
              <tbody>
                {orders.slice(0, 6).map((o) => (
                  <tr key={o._id}>
                    <td>{o.customer.name}<br /><span style={{ color: "#8a9895" }}>{o.customer.phone}</span></td>
                    <td>{o.items.reduce((s, i) => s + i.qty, 0)} items</td>
                    <td>{money(o.total)}</td>
                    <td><span className={`admin-badge ${o.status}`}>{o.status}</span></td>
                    <td>{new Date(o.createdAt).toLocaleDateString("en-IN")}</td>
                  </tr>
                ))}
                {!orders.length && <tr><td colSpan={5}>No orders yet.</td></tr>}
              </tbody>
            </table>
            <div style={{ marginTop: 14 }}><Link to="/admin/orders" className="admin-btn ghost">View all orders</Link></div>
          </div>
        </>
      )}
    </div>
  );
}
