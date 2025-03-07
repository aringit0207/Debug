import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    // apiKey: import.meta.env.FIREBASE_API_KEY,
    apiKey: "AIzaSyBQjQhtVo34RUd647g7lGq0RlTevPtobUM",
    authDomain: "mellow-92950.firebaseapp.com",
    projectId: "mellow-92950",
    storageBucket: "mellow-92950.firebasestorage.app",
    messagingSenderId: "216617044702",
    appId: "1:216617044702:web:83fa9ece066ab52812904f",
    measurementId: "G-70BZH203QW"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider(); // Make sure to rename it properly
export const db = getFirestore(app);
export default app;
