
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// NOTTY SMM - Live Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyBJB5TpY_y_utmNjwnm2bWRPnd4dZyENhE",
  authDomain: "notty-smm.firebaseapp.com",
  projectId: "notty-smm",
  storageBucket: "notty-smm.firebasestorage.app",
  messagingSenderId: "824405927780",
  appId: "1:824405927780:web:c2a31b75e6a00ba4adbc71",
  measurementId: "G-B5HGNPWWLN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Auth and Firestore instances for use across the app
export const auth = getAuth(app);
export const db = getFirestore(app);
