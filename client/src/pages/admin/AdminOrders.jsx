import { Fragment, useEffect, useState } from "react";
import { adminGetOrders, adminUpdateOrderStatus } from "../../api/client.js";
import { money } from "../../context/SiteContext.jsx";

const STATUSES = ["new", "confirmed", "packed", "dispatched", "delivered", "cancelled"];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  function load() {
    setLoading(true);
    adminGetOrders().then(setOrders).finally(() => setLoading(false));
  }
  useEffect(load, []);

  async function updateStatus(id, status) {
    const updated = await adminUpdateOrderStatus(id, status);
    setOrders((prev) => prev.map((o) => (o._id === id ? updated : o)));
  }

  return (
    <div>
      <h2>Orders</h2>
      <p className="sub">{orders.length} order{orders.length === 1 ? "" : "s"} placed so far.</p>

      <div className="admin-card">
        {loading ? (
          <p>Loading…</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr><th>Customer</th><th>Items</th><th>Total</th><th>Payment</th><th>Status</th><th>Placed</th></tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <Fragment key={o._id}>
                  <tr style={{ cursor: "pointer" }} onClick={() => setExpanded(expanded === o._id ? null : o._id)}>
                    <td><b>{o.customer.name}</b><br /><span style={{ color: "#8a9895" }}>{o.customer.phone}</span></td>
                    <td>{o.items.reduce((s, i) => s + i.qty, 0)} items</td>
                    <td>{money(o.total)}</td>
                    <td>{o.paymentMethod === "online" ? `Online (${o.paymentStatus})` : "WhatsApp"}</td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <select className="status-select" value={o.status} onChange={(e) => updateStatus(o._id, e.target.value)}>
                        {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                    <td>{new Date(o.createdAt).toLocaleString("en-IN")}</td>
                  </tr>
                  {expanded === o._id && (
                    <tr>
                      <td colSpan={6} style={{ background: "#fafcfb" }}>
                        <div style={{ fontSize: 13, lineHeight: 1.7 }}>
                          <div><b>Email:</b> {o.customer.email || "—"}</div>
                          <div><b>City:</b> {o.customer.city || "—"}</div>
                          <div><b>Address:</b> {o.customer.address || "—"}</div>
                          <div><b>Buyer type:</b> {o.customer.buyerType}</div>
                          {o.note && <div><b>Note:</b> {o.note}</div>}
                          <div style={{ marginTop: 8 }}><b>Items:</b></div>
                          <ul style={{ margin: "4px 0 0 18px" }}>
                            {o.items.map((it, i) => (
                              <li key={i}>
                                {it.name}{it.variantName ? ` (${it.variantName})` : ""}{it.designName ? ` — ${it.designName}` : ""} × {it.qty} = {money(it.lineTotal)}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
              {!orders.length && <tr><td colSpan={6}>No orders yet.</td></tr>}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
