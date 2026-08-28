import { useEffect, useState } from "react";
import { adminGetEnquiries, adminUpdateEnquiryStatus } from "../../api/client.js";

const STATUSES = ["new", "contacted", "quoted", "won", "lost"];

export default function AdminEnquiries() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminGetEnquiries().then(setEnquiries).finally(() => setLoading(false));
  }, []);

  async function updateStatus(id, status) {
    const updated = await adminUpdateEnquiryStatus(id, status);
    setEnquiries((prev) => prev.map((e) => (e._id === id ? updated : e)));
  }

  return (
    <div>
      <h2>Bulk enquiries</h2>
      <p className="sub">{enquiries.length} enquir{enquiries.length === 1 ? "y" : "ies"} received.</p>

      <div className="admin-card">
        {loading ? (
          <p>Loading…</p>
        ) : (
          <table className="admin-table">
            <thead><tr><th>Contact</th><th>Segment</th><th>Kits / qty</th><th>Status</th><th>Received</th></tr></thead>
            <tbody>
              {enquiries.map((e) => (
                <tr key={e._id}>
                  <td>
                    <b>{e.name}</b>{e.organisation ? ` · ${e.organisation}` : ""}<br />
                    <span style={{ color: "#8a9895" }}>{e.phone}{e.email ? ` · ${e.email}` : ""}</span>
                  </td>
                  <td>{e.segment}<br /><span style={{ color: "#8a9895" }}>{e.city}</span></td>
                  <td>
                    {e.kitsInterested?.join(", ") || "—"}<br />
                    <span style={{ color: "#8a9895" }}>{e.approxQty}</span>
                  </td>
                  <td>
                    <select className="status-select" value={e.status} onChange={(ev) => updateStatus(e._id, ev.target.value)}>
                      {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td>{new Date(e.createdAt).toLocaleString("en-IN")}</td>
                </tr>
              ))}
              {!enquiries.length && <tr><td colSpan={5}>No enquiries yet.</td></tr>}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
