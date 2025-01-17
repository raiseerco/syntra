import { getApp, getApps, initializeApp } from 'firebase/app';

import { getDatabase } from 'firebase/database';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  // apiKey: process.env.FIREBASE_API_KEY as string,
  // authDomain: process.env.FIREBASE_AUTH_DOMAIN as string,
  // databaseURL: process.env.FIREBASE_DB_URL as string,
  // projectId: process.env.FIREBASE_PROJECT_ID as string,
  // storageBucket: process.env.FIREBASE_STORAGE_BUCKET_CLIEN as string,
  // messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID as string,
  // appId: process.env.FIREBASE_APP_ID as string,

  // clientEmail: process.env.FIREBASE_EMAIL as string,
  // privateKey: process.env.FIREBASE_ADMIN_PK as string,

  apiKey: 'AIzaSyA5a2g9h6JZkiIHxpwzJ00WNsZa69Rmfk4',
  authDomain: 'demosphere-web3.firebaseapp.com',
  databaseURL: 'https://demosphere-web3-default-rtdb.firebaseio.com',
  projectId: 'demosphere-web3',
  storageBucket: 'demosphere-web3.firebasestorage.app',
  messagingSenderId: '37949963488',
  appId: '1:37949963488:web:90296ecb9a4b25d2f0a485',

  clientEmail: process.env.FIREBASE_EMAIL as string,
  privateKey: process.env.FIREBASE_ADMIN_PK as string,
};

let app;

if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

const db = getFirestore(app);
const database = getDatabase(app);

export { firebaseConfig, app, database, db };

// const serviceAccount = JSON.parse(
//   process.env.FIREBASE_SERVICE_ACCOUNT_KEY || '{}',
// );
