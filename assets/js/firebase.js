// ==========================================
// FRISORANDO - Zentrale Firebase Anbindung
// ==========================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Deine Firebase Testumgebung Konfiguration
const firebaseConfig = {
  apiKey: "AIzaSyCbfAJFizefkyNlFtdEr3Law2hGrN3GNlg",
  authDomain: "frisorando-dev-f40fd.firebaseapp.com",
  projectId: "frisorando-dev-f40fd",
  storageBucket: "frisorando-dev-f40fd.firebasestorage.app",
  messagingSenderId: "398947266719",
  appId: "1:398947266719:web:99108e06dc7669e97832aa",
  measurementId: "G-V0E0GSK7P4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
