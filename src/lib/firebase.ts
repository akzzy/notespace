// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAfcwm2IH0_7DkWumVx_zAzCcEMYyVinQI",
  authDomain: "mynotes-18f33.firebaseapp.com",
  projectId: "mynotes-18f33",
  storageBucket: "mynotes-18f33.firebasestorage.app",
  messagingSenderId: "604697726775",
  appId: "1:604697726775:web:37873c588c8662023ed4b2",
  measurementId: "G-WJ8HF3W6BF"
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, app };
