// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "realestate-49120.firebaseapp.com",
  projectId: "realestate-49120",
  storageBucket: "realestate-49120.appspot.com",
  messagingSenderId: "232738328412",
  appId: "1:232738328412:web:39c0b057b6b4b1b56cfb99"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);