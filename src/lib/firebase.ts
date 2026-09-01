import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
  Auth
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  Firestore,
  serverTimestamp
} from 'firebase/firestore';
import firebaseConfigData from '../../firebase-applet-config.json';

let app: FirebaseApp | null = null;
let authInstance: Auth | null = null;
let dbInstance: Firestore | null = null;

try {
  if (firebaseConfigData && firebaseConfigData.apiKey) {
    app = getApps().length === 0 ? initializeApp(firebaseConfigData) : getApp();
    authInstance = getAuth(app);
    dbInstance = firebaseConfigData.firestoreDatabaseId
      ? getFirestore(app, firebaseConfigData.firestoreDatabaseId)
      : getFirestore(app);
  }
} catch (err) {
  console.warn('Firebase initialization warning:', err);
}

export const auth = authInstance;
export const db = dbInstance;
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export {
  signInWithPopup,
  firebaseSignOut,
  onAuthStateChanged,
  doc,
  setDoc,
  getDoc,
  serverTimestamp
};
export type { User };
