// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "portail-habitat-2ac32.firebaseapp.com",
  databaseURL: "https://portail-habitat-2ac32-default-rtdb.firebaseio.com",
  projectId: "portail-habitat-2ac32",
  storageBucket: "portail-habitat-2ac32.firebasestorage.app",
  messagingSenderId: "184081016935",
  appId: "1:184081016935:web:931ffaf87cb894e8048cc2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
