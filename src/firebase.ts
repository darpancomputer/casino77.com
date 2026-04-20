import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';
import firebaseConfig from '../firebase-applet-config.json';

// Add databaseURL if not present
const config = {
  ...firebaseConfig,
  databaseURL: "https://gen-lang-client-0066341807-default-rtdb.asia-southeast1.firebasedatabase.app/"
};

const app = initializeApp(config);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const rtdb = getDatabase(app);
export const auth = getAuth(app);
