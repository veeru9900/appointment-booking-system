// src/pages/user/MyBookings.jsx
import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { getUserBookings } from "../../firebase/bookingService";
import Sidebar from "../../components/Shared/Sidebar";

export default function MyBookings() {
  const { profile } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    if (profile?.uid) {
      getUserBookings(profile.uid).then(b => { setBookings(b); setLoading(false); });
    } else {
      setLoading(false);
    }
  }, [profile]);

  const filters = ["All", "Pending", "Confirmed", "Rejected"];
  const filtered = filter === "All" ? bookings : bookings.filter(b => b.status === filter);

  return (
    <div className="layout">
      <Sidebar />
      <main className="main-content">
        <div className="page-header">
          <h1>My Bookings</h1>
          <p>Track all your appointment requests and their status</p>
        </div>

        <div className="card">
          <div className="card-header">
            <h2>Booking History</h2>
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
              <h3>No {filter !== "All" ? filter.toLowerCase() : ""} bookings found</h3>
              <p>Your bookings will appear here</p>
            </div>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Service</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Notes</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((b, i) => (
                    <tr key={b.id}>
                      <td style={{ color: "var(--text-muted)" }}>{i + 1}</td>
                      <td><strong>{b.serviceName}</strong></td>
                      <td>{b.date}</td>
                      <td>{b.time}</td>
                      <td style={{ color: "var(--text-muted)", maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {b.notes || "—"}
                      </td>
                      <td>
                        <span className={`badge badge-${b.status.toLowerCase()}`}>{b.status}</span>
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