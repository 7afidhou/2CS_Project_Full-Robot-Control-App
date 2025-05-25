// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCBcLMF8W-15-w6NVtsZredb2k_EE1qiS0",
  authDomain: "project2cs2025.firebaseapp.com",
  projectId: "project2cs2025",
  storageBucket: "project2cs2025.firebasestorage.app",
  messagingSenderId: "651874613957",
  appId: "1:651874613957:web:0db019f9705ddf8fa70eac"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export { db };