// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC8VZCq10dAFPO7RJ-LJBASTpe3FABk1S8",
  authDomain: "sideproject-fd499.firebaseapp.com",
  projectId: "sideproject-fd499",
  storageBucket: "sideproject-fd499.firebasestorage.app",
  messagingSenderId: "857634815747",
  appId: "1:857634815747:web:db586f0f0b65ce41d27336"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);