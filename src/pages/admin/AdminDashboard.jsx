// src/pages/admin/AdminDashboard.jsx
import { useEffect, useState } from "react";
import { getAllBookings, getAllUsers, getServices } from "../../firebase/bookingService";
import Sidebar from "../../components/Shared/Sidebar";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([getAllBookings(), getAllUsers(), getServices()]).then(([b, u, s]) => {
      setBookings(b); setUsers(u); setServices(s); setLoading(false);
    });
  }, []);

  const pending   = bookings.filter(b => b.status === "Pending").length;
  const confirmed = bookings.filter(b => b.status === "Confirmed").length;
  const rejected  = bookings.filter(b => b.status === "Rejected").length;

  const recent = bookings.slice(0, 8);

  return (
    <div className="layout">
      <Sidebar />
      <main className="main-content">
        <div className="page-header">
          <h1>Admin Dashboard</h1>
          <p>Overview of all bookings, users, and services</p>
        </div>

        <div className="stats-grid">
          {[
            { label: "Total Bookings", value: bookings.length, icon: "📋", color: "#eff6ff" },
            { label: "Pending",        value: pending,          icon: "⏳", color: "#fef3c7", c: "var(--warning)" },
            { label: "Confirmed",      value: confirmed,        icon: "✅", color: "#d1fae5", c: "var(--success)" },
            { label: "Rejected",       value: rejected,         icon: "❌", color: "#fee2e2", c: "var(--danger)" },
            { label: "Total Users",    value: users.length,     icon: "👥", color: "#f0fdf4" },
            { label: "Services",       value: services.length,  icon: "🛠", color: "#faf5ff" },
          ].map(s => (
            <div className="stat-card" key={s.label}>
              <div className="stat-icon" style={{ background: s.color }}>{s.icon}</div>
              <div className="stat-value" style={{ color: s.c }}>{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="card">
          <div className="card-header">
            <h2>Recent Bookings</h2>
            <button className="btn btn-primary btn-sm" onClick={() => navigate("/admin/bookings")}>View All</button>
          </div>

          {loading ? (
            <div className="empty-state"><div className="spinner" style={{ margin: "0 auto" }} /></div>
          ) : recent.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <h3>No bookings yet</h3>
            </div>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr><th>User</th><th>Service</th><th>Date</th><th>Time</th><th>Status</th></tr>
                </thead>
                <tbody>
                  {recent.map(b => (
                    <tr key={b.id}>
                      <td><strong>{b.userName}</strong><div style={{ fontSize: 12, color: "var(--text-muted)" }}>{b.userEmail}</div></td>
                      <td>{b.serviceName}</td>
                      <td>{b.date}</td>
                      <td>{b.time}</td>
                      <td><span className={`badge badge-${b.status.toLowerCase()}`}>{b.status}</span></td>
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
