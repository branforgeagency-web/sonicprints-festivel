import { useEffect, useState } from "react";
import { adminGetEnquiries, adminUpdateEnquiryStatus } from "../../api/client.js";
import Icon from "../../components/Icon.jsx";

const STATUSES = ["new", "contacted", "quoted", "won", "lost"];

export default function AdminEnquiries() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  function load() {
    setLoading(true);
    adminGetEnquiries()
      .then((res) => setEnquiries(Array.isArray(res) ? res : []))
      .catch((err) => console.error("Error fetching enquiries:", err))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function updateStatus(id, status) {
    const updated = await adminUpdateEnquiryStatus(id, status);
    setEnquiries((prev) => prev.map((e) => (e._id === id ? updated : e)));
  }

  const safeEnquiries = Array.isArray(enquiries) ? enquiries : [];

  return (
    <div className="admin-page">
      <div className="admin-header-row">
        <div>
          <span className="admin-eyebrow">💼 Corporate &amp; Bulk Enquiries</span>
          <h2 className="admin-title">Bulk Trade Enquiries</h2>
          <p className="admin-subtitle">
            {safeEnquiries.length} enquir{safeEnquiries.length === 1 ? "y" : "ies"} received from corporate, school &amp; retail buyers.
          </p>
        </div>
        <div className="admin-header-actions">
          <button onClick={load} className="admin-btn ghost btn-icon">
            <Icon name="sparkle" size={15} /> Refresh List
          </button>
        </div>
      </div>

      <div className="admin-card admin-table-card">
        {loading ? (
          <div className="admin-loading-state" style={{ padding: 36, textAlign: "center" }}>
            <span className="pageLoader-ring" style={{ width: 32, height: 32, margin: "0 auto 12px" }} />
            <p>Loading enquiries database…</p>
          </div>
        ) : (
          <div className="admin-table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Contact Details</th>
                  <th>Segment &amp; City</th>
                  <th>Kits Interested / Qty</th>
                  <th>Status</th>
                  <th>Received Date</th>
                </tr>
              </thead>
              <tbody>
                {safeEnquiries.map((e) => (
                  <tr key={e._id}>
                    <td>
                      <div className="admin-cust-cell">
                        <strong className="cust-name">{e.name || "Anonymous Prospect"}</strong>
                        {e.organisation && <span style={{ color: "#DFB76C", fontSize: 12.5, fontWeight: 600 }}>{e.organisation}</span>}
                        <span className="cust-phone">📱 {e.phone || "—"} {e.email ? `· ✉️ ${e.email}` : ""}</span>
                      </div>
                    </td>
                    <td>
                      <strong style={{ color: "#FFF" }}>{e.segment || "General"}</strong>
                      <br />
                      <span className="date-cell">📍 {e.city || "Not specified"}</span>
                    </td>
                    <td>
                      <span style={{ color: "#F3D085", fontWeight: 600 }}>
                        {e.kitsInterested?.join(", ") || "General Enquiry"}
                      </span>
                      <br />
                      <span className="item-count-pill" style={{ marginTop: 4 }}>
                        Approx. {e.approxQty || "N/A"} units
                      </span>
                    </td>
                    <td>
                      <select
                        className="status-select"
                        value={e.status || "new"}
                        onChange={(ev) => updateStatus(e._id, ev.target.value)}
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s.toUpperCase()}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="date-cell">
                      {e.createdAt ? new Date(e.createdAt).toLocaleString("en-IN") : "—"}
                    </td>
                  </tr>
                ))}
                {!safeEnquiries.length && (
                  <tr>
                    <td colSpan={5} style={{ textAlign: "center", padding: "32px", color: "#8FA7A3" }}>
                      No bulk enquiries received yet.
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
