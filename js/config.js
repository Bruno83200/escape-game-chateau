// js/config.js — Configuration Firebase originale du projet L'Héritage du Sang
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

export const firebaseConfig = {
  apiKey: "AIzaSyAjBCb60VDIgsPcb3-cJtC2PXbKHjAahYk",
  authDomain: "l-heritage-du-sang-3436a.firebaseapp.com",
  projectId: "l-heritage-du-sang-3436a",
  storageBucket: "l-heritage-du-sang-3436a.firebasestorage.app",
  messagingSenderId: "65199383138",
  appId: "1:65199383138:web:c17379bfa3410fe6f35ebb"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
