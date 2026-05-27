// src/pages/user/Dashboard.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { getUserBookings } from "../../firebase/bookingService";
import Sidebar from "../../components/Shared/Sidebar";
import { FiCalendar, FiClock, FiCheckCircle, FiXCircle } from "react-icons/fi";

export default function UserDashboard() {
  const { profile } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (profile?.uid) {
      getUserBookings(profile.uid).then(b => {
        setBookings(b);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [profile]);

  const pending   = bookings.filter(b => b.status === "Pending").length;
  const confirmed = bookings.filter(b => b.status === "Confirmed").length;
  const rejected  = bookings.filter(b => b.status === "Rejected").length;

  const recent = bookings.slice(0, 5);

  return (
    <div className="layout">
      <Sidebar />
      <main className="main-content">
        <div className="page-header">
          <h1>Welcome, {profile?.name} 👋</h1>
          <p>Here's a summary of your appointments</p>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon" style={{ background: "#eff6ff" }}>📋</div>
            <div className="stat-value">{bookings.length}</div>
            <div className="stat-label">Total Bookings</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: "#fef3c7" }}>⏳</div>
            <div className="stat-value" style={{ color: "var(--warning)" }}>{pending}</div>
            <div className="stat-label">Pending</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: "#d1fae5" }}>✅</div>
            <div className="stat-value" style={{ color: "var(--success)" }}>{confirmed}</div>
            <div className="stat-label">Confirmed</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: "#fee2e2" }}>❌</div>
            <div className="stat-value" style={{ color: "var(--danger)" }}>{rejected}</div>
            <div className="stat-label">Rejected</div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h2>Recent Bookings</h2>
            <button className="btn btn-primary btn-sm" onClick={() => navigate("/book")}>
              + New Booking
            </button>
          </div>

          {loading ? (
            <div className="empty-state"><div className="spinner" style={{ margin: "0 auto" }} /></div>
          ) : recent.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <h3>No bookings yet</h3>
              <p>Book your first appointment to get started</p>
              <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => navigate("/book")}>
                Book Now
              </button>
            </div>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Service</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recent.map(b => (
                    <tr key={b.id}>
                      <td><strong>{b.serviceName}</strong></td>
                      <td>{b.date}</td>
                      <td>{b.time}</td>
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