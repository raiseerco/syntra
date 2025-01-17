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

  clientEmail:
    'firebase-adminsdk-6dwvg@demosphere-web3.iam.gserviceaccount.com',
  privateKey:
    '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCldpDZ9jnuMmMI\nleGeRE9c2qWTHohCu1EvoBJWi/sXwdDapONcvAW6BaONhnjaO94ZlQawVKwod0iK\nf9P3kWuHpVSQArC+rjLVNj+sseRJGsavEq1hMcWdCwy55R/qhXZTQTfR9fX2YboH\npPgXzAl6cd0HRTHlsW6arq1HsNcDvw1FM19+sF0wMnYhn1WGl6jPUDFPvrgJ90BN\nF5jtAr+uaDiHO6weEkMybDDfDoazyw40uuz7RSCi720l1wStn0SsaYXeKEM0JraH\nppX8KNT+8OwjYhLS1Lhyj6vvpYlUbz8AWVX3Y7j39JuZjS8M8QadX6/hoFN3QKC+\nCn70oZTdAgMBAAECggEAC0syu2HaVecUCeW7EuOsPBUDeK18lPt2oObO4Z/n2VkG\nEapwB2ghBu+0GGidjp3H/NyGapo47wEnTybG986x9X4ELdk1Kaq3twRfJ8EzqQa+\nGXyPn4L3b07uBTE9srL93tRkhD0C1xiYC0YIFg279uLXOJQRQhGQkFfMZYiNQIjZ\neqax/qUM+KhyyzVjkW42EL16u7wYctxZRA0tbZk77oFm9RPYJEntmxUpLmc6mB4M\niuwsVmhR4M04MguslPvlJIkrxLpZXFacXG6U+390FzHrmkxbLgLqW/2NuM+Ny0+j\nrETrX7k1XuxpPPxmG1C2wwBumhOXT7M3hNGM00sUYQKBgQDTYbsNavSNFJ1aq+Q7\ntkqNR6+Zmj21E8QxHkI+Xbe/UTXJRP+mRbH1Qo+jAx2Gm7eo+sKffDaINOYo0qwp\nYWDBPSZYozC8OH5yKj3M2+wCc4fljpdOLdHxSxmauQPoWm2eYXwVWoU4Ga1hGVkU\nTmrV4hkotjdBnAGZWo+krVk1IQKBgQDIY5E8S9gbJtjMN5zPkbvcQGOLhXD6F/2S\nTOzC+QOxN4HBmSXvJXIJhNtEBAHExUV52/HK1nN8/u9FT6tqGp0TxTPZuX5h7kgY\nslctpO1Ig4pm3vabXIKtlABKvIRvnCPhRBujYcoq2Gy7oTsuZ4vWWr9gJzUVY1Iw\nJeIV7zZsPQKBgAqQKLPL83qVXCOq0VX2jxUuTuUjIxBIc5Zsx6ysLEGAQmrTat8Z\nPoJeGCVyQ2h1oaDtHwqvP15hHltN49KRji856g+l4AqX3CHCYKI7HzkkItdi38bF\nXWdsdFQaCMr0seOnRXcfteaOye4/QQdVv9r+WHmDWZGKxT2vm9wD2aBhAoGBAJQ1\nB9rXoXrbbWcFDqZ6e733pWgwhpGCItoMqOO/NprgmchtE6BfSot9xon0iLZWzP7G\nzHsfxwTArIjP1tC/5EMWDDZQugeGK66QYGfy3khOeZOB/lSDxGbK2rhr22uMyQC3\n1dUt409zCGBxbArzLHqaXYapGNq7vbK8og1lAhRlAoGAVnSUHCbukvOZEQxV7SM/\nMgIYz7oNgXvGaZLp93bFk7H5Hd+AwLgRWeFW7jkMP+5tZyzkHibqhxOLbqcHANnm\nw3YLRdt+U3kNHoF8Kj00ec4exzmhq8dDyMCAVzfHoPv37j9754uNWs7rce2rhllo\nPb5sGES/RHKAq8o6UvxqUro=\n-----END PRIVATE KEY-----\n',
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
