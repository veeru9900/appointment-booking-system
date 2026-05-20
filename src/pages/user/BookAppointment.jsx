// src/pages/user/BookAppointment.jsx
import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { getServices, getSlots, createBooking } from "../../firebase/bookingService";
import Sidebar from "../../components/Shared/Sidebar";
import toast from "react-hot-toast";
import { FiCheck } from "react-icons/fi";

export default function BookAppointment() {
  const { profile } = useAuth();
  const [services, setServices] = useState([]);
  const [slots, setSlots] = useState([]);
  const [form, setForm] = useState({ serviceId: "", serviceName: "", date: "", slotId: "", time: "", notes: "" });
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => { getServices().then(setServices); }, []);

  useEffect(() => {
    if (form.serviceId && form.date) {
      getSlots(form.serviceId, form.date).then(setSlots);
    } else {
      setSlots([]);
    }
  }, [form.serviceId, form.date]);

  const handleChange = e => {
    const { name, value } = e.target;
    if (name === "serviceId") {
      const svc = services.find(s => s.id === value);
      setForm({ ...form, serviceId: value, serviceName: svc?.name || "", slotId: "", time: "" });
    } else if (name === "slotId") {
      const slot = slots.find(s => s.id === value);
      setForm({ ...form, slotId: value, time: slot?.time || "" });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleBook = async (e) => {
    e.preventDefault();
    if (!form.serviceId || !form.date || !form.slotId) {
      toast.error("Please fill all required fields");
      return;
    }
    setLoading(true);
    try {
      await createBooking({
        userId: profile.uid,
        userName: profile.name,
        userEmail: profile.email,
        serviceId: form.serviceId,
        serviceName: form.serviceName,
        date: form.date,
        slotId: form.slotId,
        time: form.time,
        notes: form.notes
      });
      toast.success("Appointment booked! Waiting for admin approval.");
      setForm({ serviceId: "", serviceName: "", date: "", slotId: "", time: "", notes: "" });
      setStep(3);
    } catch (err) {
      toast.error("Failed to book appointment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="layout">
      <Sidebar />
      <main className="main-content">
        <div className="page-header">
          <h1>Book Appointment</h1>
          <p>Select a service, date, and available time slot</p>
        </div>

        {step === 3 ? (
          <div className="card" style={{ textAlign: "center", padding: 60 }}>
            <div style={{ width: 72, height: 72, background: "#d1fae5", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: 36 }}>✅</div>
            <h2 style={{ color: "var(--success)", marginBottom: 8 }}>Booking Submitted!</h2>
            <p style={{ color: "var(--text-muted)", marginBottom: 24 }}>Your appointment is <strong>Pending</strong> admin approval. You'll see status updates in My Bookings.</p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <button className="btn btn-primary" onClick={() => setStep(1)}>Book Another</button>
              <button className="btn btn-outline" onClick={() => window.location.href = "/my-bookings"}>View My Bookings</button>
            </div>
          </div>
        ) : (
          <div className="card" style={{ maxWidth: 560 }}>
            <form onSubmit={handleBook}>
              <div className="form-group">
                <label>Service *</label>
                <select className="form-control" name="serviceId" value={form.serviceId} onChange={handleChange} required>
                  <option value="">-- Select a Service --</option>
                  {services.map(s => (
                    <option key={s.id} value={s.id}>{s.name} {s.duration ? `(${s.duration} min)` : ""}</option>
                  ))}
                </select>
              </div>

              {form.serviceId && (
                <div className="form-group">
                  <label>Date *</label>
                  <input className="form-control" type="date" name="date" value={form.date}
                    min={today} onChange={handleChange} required />
                </div>
              )}

              {form.serviceId && form.date && (
                <div className="form-group">
                  <label>Available Time Slot *</label>
                  {slots.length === 0 ? (
                    <p style={{ fontSize: 13, color: "var(--text-muted)", padding: "10px 0" }}>
                      No available slots for this date. Try another date.
                    </p>
                  ) : (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 4 }}>
                      {slots.map(slot => (
                        <button
                          key={slot.id}
                          type="button"
                          onClick={() => setForm({ ...form, slotId: slot.id, time: slot.time })}
                          className={`btn ${form.slotId === slot.id ? "btn-primary" : "btn-outline"} btn-sm`}
                        >
                          {form.slotId === slot.id && <FiCheck />} {slot.time}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="form-group">
                <label>Notes (optional)</label>
                <textarea className="form-control" name="notes" rows={3} placeholder="Any special requirements..."
                  value={form.notes} onChange={handleChange} />
              </div>

              <button className="btn btn-primary" type="submit" disabled={loading || !form.slotId}>
                {loading ? "Booking..." : "Confirm Booking"}
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
