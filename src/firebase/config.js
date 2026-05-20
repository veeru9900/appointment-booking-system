import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBWzMbMOiYoIBwDEU8ERCXQos1kxz_kRaY",
  authDomain: "appointment-3bb65.firebaseapp.com",
  projectId: "appointment-3bb65",
  storageBucket: "appointment-3bb65.firebasestorage.app",
  messagingSenderId: "759049836675",
  appId: "1:759049836675:web:a39d4027dcab57452523b6"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;