# 📅 Appointment Booking System
**Spherenex Internship Project | Full Stack Web Development**

---

## 🗂 Project File Structure

```
appointment-booking-system/
├── public/
│   └── index.html                   # HTML entry point
├── src/
│   ├── firebase/
│   │   ├── config.js                # 🔑 Firebase credentials (YOU EDIT THIS)
│   │   ├── authService.js           # Register / Login / Logout
│   │   └── bookingService.js        # CRUD for services, slots, bookings
│   │
│   ├── hooks/
│   │   └── useAuth.js               # Auth context + provider
│   │
│   ├── components/
│   │   └── Shared/
│   │       ├── Sidebar.jsx          # Navigation sidebar
│   │       └── ProtectedRoute.jsx   # Route guards
│   │
│   ├── pages/
│   │   ├── Login.jsx                # User/Admin login
│   │   ├── Register.jsx             # New user registration
│   │   ├── user/
│   │   │   ├── Dashboard.jsx        # User home with stats
│   │   │   ├── BookAppointment.jsx  # Select service → date → slot
│   │   │   └── MyBookings.jsx       # Booking history + status
│   │   └── admin/
│   │       ├── AdminDashboard.jsx   # Admin overview
│   │       ├── AdminBookings.jsx    # Approve / Reject bookings
│   │       ├── AdminServices.jsx    # Add / delete services
│   │       ├── AdminSlots.jsx       # Add / delete time slots
│   │       └── AdminUsers.jsx       # View all registered users
│   │
│   ├── styles/
│   │   └── global.css               # Complete design system
│   ├── App.jsx                      # Router + route definitions
│   └── index.js                     # React root
│
├── firestore.rules                  # Security rules for Firestore
├── package.json                     # Dependencies
└── README.md                        # This file
```

---

## ⚙️ Tech Stack

| Layer     | Technology                     |
|-----------|-------------------------------|
| Frontend  | React 18, React Router v6     |
| Styling   | Custom CSS (Design System)    |
| Auth      | Firebase Authentication       |
| Database  | Firebase Firestore (NoSQL)    |
| Icons     | React Icons (Feather)         |
| Toasts    | React Hot Toast               |

---

## 🚀 Step-by-Step Setup & Execution

### STEP 1 — Create a Firebase Project

1. Go to **https://console.firebase.google.com**
2. Click **"Add project"** → Enter project name (e.g. `appointment-booking`) → Continue
3. Disable Google Analytics (optional) → **Create project**

### STEP 2 — Enable Authentication

1. In Firebase Console → **Build → Authentication → Get started**
2. Click **Sign-in method** tab → Enable **Email/Password** → Save

### STEP 3 — Create Firestore Database

1. In Firebase Console → **Build → Firestore Database → Create database**
2. Choose **"Start in test mode"** (you'll add rules later) → Next
3. Select a region → **Enable**

### STEP 4 — Get Firebase Config Keys

1. In Firebase Console → ⚙️ **Project Settings** (gear icon) → **General** tab
2. Scroll down to **"Your apps"** → Click **`</>`** (Web app icon)
3. Register the app (any name) → Copy the `firebaseConfig` object

### STEP 5 — Add Config to the Project

Open `src/firebase/config.js` and replace with YOUR values:

```js
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

### STEP 6 — Create Admin Account

Since admin accounts can't be created from the UI, do it in two ways:

**Option A — Register normally then update Firestore:**
1. Register with any email/password through the app
2. Go to **Firebase Console → Firestore → users collection**
3. Find your document → Edit `role` field from `"user"` to `"admin"`

**Option B — Add directly in Firestore:**
1. Firebase Console → Firestore → `users` collection → **Add document**
2. Use the Firebase Auth UID as document ID
3. Add fields: `name`, `email`, `role: "admin"`, `uid`

### STEP 7 — Add Firestore Security Rules

1. Firebase Console → **Firestore → Rules tab**
2. Copy and paste the contents of `firestore.rules` → **Publish**

### STEP 8 — Install & Run the App

```bash
# Navigate into the project
cd appointment-booking-system

# Install dependencies
npm install

# Start development server
npm start
```

App runs at: **http://localhost:3000**

### STEP 9 — Build for Production

```bash
npm run build
```
Output goes to `/build` folder — deploy to Firebase Hosting, Vercel, or Netlify.

---

## 🔄 Application Flow

```
User Flow:
Register/Login → Dashboard → Book Appointment
  → Select Service → Pick Date → Choose Slot
  → Submit (Status: Pending)
  → My Bookings → See Status update

Admin Flow:
Login (admin role) → Admin Dashboard
  → Manage Services → Add/Delete services
  → Manage Slots → Add time slots per service
  → All Bookings → Approve / Reject
  → Users → View all registered users
```

---

## 🗄️ Firestore Collections

| Collection | Purpose                                       |
|------------|-----------------------------------------------|
| `users`    | User profiles with `role` field (user/admin)  |
| `services` | Services like Consultation, Haircut, etc.     |
| `slots`    | Available time slots per service per date     |
| `bookings` | All booking records with status               |

---

## 🛠️ Common Issues

| Problem | Solution |
|---------|----------|
| "Firebase app not initialized" | Check `config.js` credentials |
| Blank page after login | Check browser console for errors |
| "Permission denied" in Firestore | Update Firestore rules (Step 7) |
| Admin panel not showing | Set `role: "admin"` in Firestore user doc |
| Slots not appearing | Ensure slots match serviceId and date format `YYYY-MM-DD` |

---

## 📌 Modules Implemented (per Block Diagram)

- ✅ **User Module** — Register, Login, Browse Services, Book, History
- ✅ **Admin Module** — Login, View Bookings, Approve/Reject, Manage Slots, Reports
- ✅ **Frontend (UI)** — React (HTML/CSS/JS)
- ✅ **Backend** — Firebase (replaces Node.js/Express + RESTful API)
- ✅ **Service Module** — Add/View/Delete services
- ✅ **Booking Module** — Book appointment (select date & time)
- ✅ **Slot Management** — Manage available time slots
- ✅ **User Management** — View all users
- ✅ **Admin Approval Module** — Approve/Reject booking requests
- ✅ **Database** — Firebase Firestore (replaces MongoDB)
- ✅ **Booking History** — View past bookings
- ✅ **Booking Status** — Pending / Confirmed / Rejected

---

*Built for Spherenex Internship | Full Stack Web Development Track*
