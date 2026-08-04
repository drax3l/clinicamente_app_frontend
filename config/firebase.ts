import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Firebase configuration using credentials from google-services.json
const firebaseConfig = {
  apiKey: "AIzaSyBhaitCKWtj73s1c1ob3wjsPvmfREoejiA",
  authDomain: "lacasainformatica-bba3e.firebaseapp.com",
  projectId: "lacasainformatica-bba3e",
  storageBucket: "lacasainformatica-bba3e.firebasestorage.app",
  messagingSenderId: "15136440422",
  appId: "1:15136440422:android:ad991ef0aa8ab9fc432da7"
};

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase Auth with AsyncStorage persistence for React Native
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// Initialize Firestore and Storage
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
