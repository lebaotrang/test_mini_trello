import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCiAaG6cc6uvHQqzplsZYTr0SdHhfcsDYw",
  authDomain: "testproject-1538578862843.firebaseapp.com",
  databaseURL: "https://testproject-1538578862843.firebaseio.com",
  projectId: "testproject-1538578862843",
  storageBucket: "testproject-1538578862843.firebasestorage.app",
  messagingSenderId: "729690523253",
  appId: "1:729690523253:web:a437b2dc5b9cba9a259a3c",
  measurementId: "G-4SY4951VP9"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
