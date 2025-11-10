// Import the functions you need from the SDKs you need
import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDLy1rqQQTFzsLEbfS7cf4DO8cP6UVkkKs",
  authDomain: "viengiac-info-50693.firebaseapp.com",
  projectId: "viengiac-info-50693",
  storageBucket: "viengiac-info-50693.firebasestorage.app",
  messagingSenderId: "540843088611",
  appId: "1:540843088611:web:4c58233c4208890a47c3d6",
  measurementId: "G-0G97W12RG0"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
export const firebaseDb = getFirestore(firebaseApp);