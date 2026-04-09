import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyA1toLM4K6Qr6FVYBkyq8uvInjMUOY9dAo",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "autocar-c2bdd.firebaseapp.com",
  databaseURL:
    process.env.REACT_APP_FIREBASE_DATABASE_URL ||
    "https://autocar-c2bdd-default-rtdb.firebaseio.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "autocar-c2bdd",
  storageBucket:
    process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "autocar-c2bdd.firebasestorage.app",
  messagingSenderId:
    process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "547455332890",
  appId:
    process.env.REACT_APP_FIREBASE_APP_ID ||
    "1:547455332890:web:554bf518dd869f24b157a3",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
