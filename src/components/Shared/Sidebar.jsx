// src/components/Shared/Sidebar.jsx
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { logoutUser } from "../../firebase/authService";
import toast from "react-hot-toast";
import {
  FiCalendar, FiClock, FiList, FiLogOut,
  FiUsers, FiGrid, FiTool
} from "react-icons/fi";

const userNav = [
  { label: "Dashboard", icon: <FiGrid />, path: "/dashboard" },
  { label: "Book Appointment", icon: <FiCalendar />, path: "/book" },
  { label: "My Bookings", icon: <FiList />, path: "/my-bookings" },
];

const adminNav = [
  { label: "Dashboard", icon: <FiGrid />, path: "/admin" },
  { label: "All Bookings", icon: <FiList />, path: "/admin/bookings" },
  { label: "Manage Services", icon: <FiTool />, path: "/admin/services" },
  { label: "Manage Slots", icon: <FiClock />, path: "/admin/slots" },
  { label: "Users", icon: <FiUsers />, path: "/admin/users" },
];

export default function Sidebar() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const nav = profile?.role === "admin" ? adminNav : userNav;

  const handleLogout = async () => {
    await logoutUser();
    toast.success("Logged out");
    navigate("/login");
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 36, height: 36, background: "var(--primary)",
            borderRadius: 10, display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: 18
          }}>📅</div>
          <div>
            <h2>AppointBook</h2>
            <span>{profile?.role === "admin" ? "Admin Panel" : "User Portal"}</span>
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: ".08em", padding: "4px 12px", marginBottom: 4 }}>
          Menu
        </div>
        {nav.map(item => (
          <button
            key={item.path}
            className={`nav-item ${location.pathname === item.path ? "active" : ""}`}
            onClick={() => navigate(item.path)}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 8, padding: "0 4px" }}>
          {profile?.name}
          <div style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 400 }}>{profile?.email}</div>
        </div>
        <button className="nav-item" onClick={handleLogout} style={{ color: "var(--danger)" }}>
          <FiLogOut /> Logout
        </button>
      </div>
    </aside>
  );
}