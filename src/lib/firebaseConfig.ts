import { getApp, getApps, initializeApp } from 'firebase/app';

import { getDatabase } from 'firebase/database';
import { getFirestore } from 'firebase/firestore';

const serviceAccount = JSON.parse(
  process.env.FIREBASE_SERVICE_ACCOUNT_KEY || '{}',
);

export const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY as string,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN as string,
  projectId: process.env.FIREBASE_PROJECT_ID as string,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET_CLIENT as string,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  databaseURL: process.env.FIREBASE_DB_URL,
  clientEmail: process.env.FIREBASE_EMAIL as string,
  privateKey: process.env.FIREBASE_ADMIN_PK as string,
};

const params = {};

let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

// const firebaseAuth = getAuth(firebaseApp);
const db = getFirestore(app);
const database = getDatabase(app);

export { app, database, db };
