// src/pages/admin/AdminBookings.jsx
import { useEffect, useState } from "react";
import { getAllBookings, updateBookingStatus } from "../../firebase/bookingService";
import Sidebar from "../../components/Shared/Sidebar";
import toast from "react-hot-toast";
import { FiCheck, FiX } from "react-icons/fi";

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  const load = () => getAllBookings().then(b => { setBookings(b); setLoading(false); });
  useEffect(() => { load(); }, []);

  const handleStatus = async (id, status, slotId) => {
    try {
      await updateBookingStatus(id, status, slotId);
      toast.success(`Booking ${status}`);
      load();
    } catch {
      toast.error("Failed to update status");
    }
  };

  const filters = ["All", "Pending", "Confirmed", "Rejected"];
  const filtered = filter === "All" ? bookings : bookings.filter(b => b.status === filter);

  return (
    <div className="layout">
      <Sidebar />
      <main className="main-content">
        <div className="page-header">
          <h1>Manage Bookings</h1>
          <p>Approve or reject user booking requests</p>
        </div>

        <div className="card">
          <div className="card-header">
            <h2>All Bookings ({filtered.length})</h2>
            <div style={{ display: "flex", gap: 6 }}>
              {filters.map(f => (
                <button key={f} className={`btn btn-sm ${filter === f ? "btn-primary" : "btn-outline"}`}
                  onClick={() => setFilter(f)}>{f}</button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="empty-state"><div className="spinner" style={{ margin: "0 auto" }} /></div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <h3>No bookings found</h3>
            </div>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Service</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Notes</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(b => (
                    <tr key={b.id}>
                      <td>
                        <strong>{b.userName}</strong>
                        <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{b.userEmail}</div>
                      </td>
                      <td>{b.serviceName}</td>
                      <td>{b.date}</td>
                      <td>{b.time}</td>
                      <td style={{ maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "var(--text-muted)" }}>
                        {b.notes || "—"}
                      </td>
                      <td><span className={`badge badge-${b.status.toLowerCase()}`}>{b.status}</span></td>
                      <td>
                        {b.status === "Pending" && (
                          <div style={{ display: "flex", gap: 6 }}>
                            <button className="btn btn-success btn-sm"
                              onClick={() => handleStatus(b.id, "Confirmed", b.slotId)}>
                              <FiCheck /> Approve
                            </button>
                            <button className="btn btn-danger btn-sm"
                              onClick={() => handleStatus(b.id, "Rejected", b.slotId)}>
                              <FiX /> Reject
                            </button>
                          </div>
                        )}
                        {b.status !== "Pending" && (
                          <span style={{ color: "var(--text-muted)", fontSize: 13 }}>—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
