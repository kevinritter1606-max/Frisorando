// ==========================================
// FRISORANDO - Zentrale Firebase Anbindung
// ==========================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Deine Firebase Testumgebung Konfiguration
const firebaseConfig = {
  apiKey: "AIzaSyBmJ62-6_2d4gbSdMObFHE5XI",
  authDomain: "frisorando-dev.firebaseapp.com",
  projectId: "frisorando-dev",
  storageBucket: "frisorando-dev.appspot.com",
  messagingSenderId: "947221498541",
  appId: "1:947221498541:web:04dd9ca3f9e3",
  measurementId: "G-1W0LP8GB2K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
