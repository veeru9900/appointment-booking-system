// src/pages/Register.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../firebase/authService";
import toast from "react-hot-toast";
import { FiUser, FiMail, FiLock, FiUserPlus } from "react-icons/fi";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "", role: "user" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      toast.error("Passwords do not match");
      return;
    }
    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      await registerUser(form.name, form.email, form.password, form.role);
      toast.success("Account created successfully!");
      navigate(form.role === "admin" ? "/admin" : "/dashboard");
    } catch (err) {
      toast.error(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="logo-icon">📅</div>
          <h1>AppointBook</h1>
          <p>Create your account</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <div style={{ position: "relative" }}>
              <FiUser style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
              <input className="form-control" style={{ paddingLeft: 36 }} type="text" name="name"
                placeholder="John Doe" value={form.name} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <div style={{ position: "relative" }}>
              <FiMail style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
              <input className="form-control" style={{ paddingLeft: 36 }} type="email" name="email"
                placeholder="you@example.com" value={form.email} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-group">
            <label>Password</label>
            <div style={{ position: "relative" }}>
              <FiLock style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
              <input className="form-control" style={{ paddingLeft: 36 }} type="password" name="password"
                placeholder="Min. 6 characters" value={form.password} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <div style={{ position: "relative" }}>
              <FiLock style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
              <input className="form-control" style={{ paddingLeft: 36 }} type="password" name="confirm"
                placeholder="Repeat password" value={form.confirm} onChange={handleChange} required />
            </div>
          </div>

          {/* Role Selection */}
          <div className="form-group">
            <label>Register As</label>
            <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
              <div
                onClick={() => setForm({ ...form, role: "user" })}
                style={{
                  flex: 1, padding: "12px 16px", borderRadius: 10, cursor: "pointer",
                  border: `2px solid ${form.role === "user" ? "var(--primary)" : "var(--border)"}`,
                  background: form.role === "user" ? "var(--primary-light)" : "transparent",
                  textAlign: "center", transition: "all .18s"
                }}
              >
                <div style={{ fontSize: 22, marginBottom: 4 }}>👤</div>
                <div style={{ fontWeight: 600, fontSize: 14, color: form.role === "user" ? "var(--primary)" : "var(--text)" }}>User</div>
                <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>Book appointments</div>
              </div>

              <div
                onClick={() => setForm({ ...form, role: "admin" })}
                style={{
                  flex: 1, padding: "12px 16px", borderRadius: 10, cursor: "pointer",
                  border: `2px solid ${form.role === "admin" ? "var(--primary)" : "var(--border)"}`,
                  background: form.role === "admin" ? "var(--primary-light)" : "transparent",
                  textAlign: "center", transition: "all .18s"
                }}
              >
                <div style={{ fontSize: 22, marginBottom: 4 }}>🛡️</div>
                <div style={{ fontWeight: 600, fontSize: 14, color: form.role === "admin" ? "var(--primary)" : "var(--text)" }}>Admin</div>
                <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>Manage bookings</div>
              </div>
            </div>
          </div>

          <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: 8 }} disabled={loading}>
            {loading ? "Creating..." : <><FiUserPlus /> Create Account as {form.role === "admin" ? "Admin" : "User"}</>}
          </button>
        </form>

        <div className="auth-divider">Already have an account?</div>
        <Link to="/login">
          <button className="btn btn-outline" style={{ width: "100%", justifyContent: "center" }}>
            Sign In
          </button>
        </Link>
      </div>
    </div>
  );
}