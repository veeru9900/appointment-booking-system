// src/firebase/bookingService.js
import {
  collection, addDoc, getDocs, doc,
  updateDoc, query, where, serverTimestamp, deleteDoc
} from "firebase/firestore";
import { db } from "./config";

// ── SERVICES ──────────────────────────────────────────────
export const getServices = async () => {
  const snap = await getDocs(collection(db, "services"));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const addService = async (service) => {
  return await addDoc(collection(db, "services"), {
    ...service,
    createdAt: serverTimestamp()
  });
};

export const deleteService = async (id) => {
  await deleteDoc(doc(db, "services", id));
};

// ── SLOTS ─────────────────────────────────────────────────
export const getSlots = async (serviceId, date) => {
  const q = query(
    collection(db, "slots"),
    where("serviceId", "==", serviceId),
    where("date", "==", date),
    where("isAvailable", "==", true)
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const getAllSlots = async () => {
  const snap = await getDocs(collection(db, "slots"));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const addSlot = async (slot) => {
  return await addDoc(collection(db, "slots"), {
    ...slot,
    isAvailable: true,
    createdAt: serverTimestamp()
  });
};

export const deleteSlot = async (id) => {
  await deleteDoc(doc(db, "slots", id));
};

// ── BOOKINGS ──────────────────────────────────────────────
export const createBooking = async (bookingData) => {
  const booking = await addDoc(collection(db, "bookings"), {
    ...bookingData,
    status: "Pending",
    createdAt: serverTimestamp()
  });
  // Mark slot as unavailable
  if (bookingData.slotId) {
    await updateDoc(doc(db, "slots", bookingData.slotId), { isAvailable: false });
  }
  return booking;
};

export const getUserBookings = async (uid) => {
  const q = query(
    collection(db, "bookings"),
    where("userId", "==", uid)
  );
  const snap = await getDocs(q);
  const results = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  return results.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
};

export const getAllBookings = async () => {
  const snap = await getDocs(collection(db, "bookings"));
  const results = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  return results.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
};

export const updateBookingStatus = async (bookingId, status, slotId) => {
  await updateDoc(doc(db, "bookings", bookingId), { status });
  // If rejected, re-open the slot
  if (status === "Rejected" && slotId) {
    await updateDoc(doc(db, "slots", slotId), { isAvailable: true });
  }
};

// ── USERS ─────────────────────────────────────────────────
export const getAllUsers = async () => {
  const snap = await getDocs(collection(db, "users"));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};