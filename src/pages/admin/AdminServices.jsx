// src/pages/admin/AdminServices.jsx
import { useEffect, useState } from "react";
import { getServices, addService, deleteService } from "../../firebase/bookingService";
import Sidebar from "../../components/Shared/Sidebar";
import toast from "react-hot-toast";
import { FiTrash2, FiPlus } from "react-icons/fi";

export default function AdminServices() {
  const [services, setServices] = useState([]);
  const [form, setForm] = useState({ name: "", description: "", duration: "" });
  const [loading, setLoading] = useState(false);

  const load = () => getServices().then(setServices);
  useEffect(() => { load(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { toast.error("Service name is required"); return; }
    setLoading(true);
    try {
      await addService(form);
      toast.success("Service added!");
      setForm({ name: "", description: "", duration: "" });
      load();
    } catch { toast.error("Failed to add service"); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this service?")) return;
    await deleteService(id);
    toast.success("Service deleted");
    load();
  };

  return (
    <div className="layout">
      <Sidebar />
      <main className="main-content">
        <div className="page-header">
          <h1>Manage Services</h1>
          <p>Add, view, or remove available services</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: 20, alignItems: "start" }}>
          <div className="card">
            <h2 style={{ marginBottom: 20, fontSize: 16 }}>Add New Service</h2>
            <form onSubmit={handleAdd}>
              <div className="form-group">
                <label>Service Name *</label>
                <input className="form-control" placeholder="e.g. General Consultation"
                  value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea className="form-control" rows={2} placeholder="Brief description..."
                  value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Duration (minutes)</label>
                <input className="form-control" type="number" placeholder="e.g. 30"
                  value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} />
              </div>
              <button className="btn btn-primary" type="submit" disabled={loading}>
                <FiPlus /> {loading ? "Adding..." : "Add Service"}
              </button>
            </form>
          </div>

          <div className="card">
            <h2 style={{ marginBottom: 20, fontSize: 16 }}>All Services ({services.length})</h2>
            {services.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🛠</div>
                <h3>No services yet</h3>
                <p>Add your first service</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {services.map(s => (
                  <div key={s.id} style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "12px 16px", border: "1px solid var(--border)", borderRadius: 8
                  }}>
                    <div>
                      <strong>{s.name}</strong>
                      {s.duration && <span style={{ marginLeft: 8, fontSize: 12, color: "var(--text-muted)" }}>{s.duration} min</span>}
                      {s.description && <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 2 }}>{s.description}</div>}
                    </div>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(s.id)}>
                      <FiTrash2 />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
