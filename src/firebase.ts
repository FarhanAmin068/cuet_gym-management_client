import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';
import { collection, addDoc } from 'firebase/firestore';

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyAcJ46LWqUcpqDpJygFswutoCE4JWlvexo",
  authDomain: "cuet-gym-management.firebaseapp.com",
  projectId: "cuet-gym-management",
  storageBucket: "cuet-gym-management.appspot.com", // Fix here!
  messagingSenderId: "681193775679",
  appId: "1:681193775679:web:bb0cf2141268baed120e8a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app);

// Export Firestore functions correctly
export { collection, addDoc };

export default app;
