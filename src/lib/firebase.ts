// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  "projectId": "studio-5035248768-2e3c6",
  "appId": "1:426696898611:web:6d32b80159ac176a09cb46",
  "apiKey": "AIzaSyAaeyYp6moEgfgtmjWFHtTIPkgR3VpZ5V8",
  "authDomain": "studio-5035248768-2e3c6.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "426696898611"
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, app };
