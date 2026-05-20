// src/pages/admin/AdminSlots.jsx
import { useEffect, useState } from "react";
import { getServices, getAllSlots, addSlot, deleteSlot } from "../../firebase/bookingService";
import Sidebar from "../../components/Shared/Sidebar";
import toast from "react-hot-toast";
import { FiTrash2, FiPlus } from "react-icons/fi";

export default function AdminSlots() {
  const [services, setServices] = useState([]);
  const [slots, setSlots] = useState([]);
  const [form, setForm] = useState({ serviceId: "", serviceName: "", date: "", time: "" });
  const [loading, setLoading] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  const load = () => {
    getServices().then(setServices);
    getAllSlots().then(setSlots);
  };
  useEffect(() => { load(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.serviceId || !form.date || !form.time) { toast.error("All fields are required"); return; }
    setLoading(true);
    try {
      const svc = services.find(s => s.id === form.serviceId);
      await addSlot({ ...form, serviceName: svc?.name || "" });
      toast.success("Slot added!");
      setForm({ serviceId: "", serviceName: "", date: "", time: "" });
      load();
    } catch { toast.error("Failed to add slot"); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this slot?")) return;
    await deleteSlot(id);
    toast.success("Slot deleted");
    load();
  };

  const grouped = slots.reduce((acc, slot) => {
    const key = `${slot.serviceName} — ${slot.date}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(slot);
    return acc;
  }, {});

  return (
    <div className="layout">
      <Sidebar />
      <main className="main-content">
        <div className="page-header">
          <h1>Manage Slots</h1>
          <p>Add available time slots for each service</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: 20, alignItems: "start" }}>
          <div className="card">
            <h2 style={{ marginBottom: 20, fontSize: 16 }}>Add New Slot</h2>
            <form onSubmit={handleAdd}>
              <div className="form-group">
                <label>Service *</label>
                <select className="form-control" value={form.serviceId}
                  onChange={e => setForm({ ...form, serviceId: e.target.value })} required>
                  <option value="">-- Select Service --</option>
                  {services.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Date *</label>
                <input className="form-control" type="date" min={today} value={form.date}
                  onChange={e => setForm({ ...form, date: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Time *</label>
                <input className="form-control" type="time" value={form.time}
                  onChange={e => setForm({ ...form, time: e.target.value })} required />
              </div>
              <button className="btn btn-primary" type="submit" disabled={loading}>
                <FiPlus /> {loading ? "Adding..." : "Add Slot"}
              </button>
            </form>
          </div>

          <div className="card">
            <h2 style={{ marginBottom: 20, fontSize: 16 }}>All Slots ({slots.length})</h2>
            {Object.keys(grouped).length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🕐</div>
                <h3>No slots yet</h3>
                <p>Add time slots for your services</p>
              </div>
            ) : (
              Object.entries(grouped).map(([group, groupSlots]) => (
                <div key={group} style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 8 }}>
                    {group}
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {groupSlots.map(slot => (
                      <div key={slot.id} style={{
                        display: "flex", alignItems: "center", gap: 6,
                        padding: "5px 10px", border: "1.5px solid var(--border)",
                        borderRadius: 20, fontSize: 13,
                        background: slot.isAvailable ? "#f0fdf4" : "#fef2f2",
                        borderColor: slot.isAvailable ? "#bbf7d0" : "#fecaca"
                      }}>
                        {slot.time}
                        <span style={{ fontSize: 10, color: slot.isAvailable ? "var(--success)" : "var(--danger)" }}>
                          {slot.isAvailable ? "Free" : "Booked"}
                        </span>
                        <button onClick={() => handleDelete(slot.id)}
                          style={{ background: "none", border: "none", cursor: "pointer", color: "var(--danger)", display: "flex", padding: 0 }}>
                          <FiTrash2 size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
