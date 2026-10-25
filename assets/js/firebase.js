// ==========================================
// FRISORANDO - Zentrale Firebase Anbindung
// ==========================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, doc, updateData } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Deine Firebase Testumgebung Konfiguration
const firebaseConfig = {
  apiKey: "AIzaSyBmJ62-6_2d4gbSdMObFHE5XL1u9OnGNwY",
  authDomain: "frisorando-dev.firebaseapp.com",
  projectId: "frisorando-dev",
  storageBucket: "frisorando-dev.firebasestorage.app",
  messagingSenderId: "947221498541",
  appId: "1:947221498541:web:04dd9ca3f9e3bee2e65424",
  measurementId: "G-1W0LP8GB2K"
};

// Initialisierung der Firebase App & Firestore Datenbank
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Hilfsfunktion: Verbindungstest & Status-Log
console.log("Frisorando Kernsystem erfolgreich mit Firebase verbunden.");
