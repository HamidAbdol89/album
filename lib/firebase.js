// lib/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBD_ED2kTMoR9pviU-Z0JDDMHEbzQnXias",
  authDomain: "album-ffe47.firebaseapp.com",
  projectId: "album-ffe47",
  storageBucket: "album-ffe47.firebasestorage.app",
  messagingSenderId: "452013409409",
  appId: "1:452013409409:web:93462f1ed5568f2b59b980",
  measurementId: "G-1L9S91SPQC"
};


const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;