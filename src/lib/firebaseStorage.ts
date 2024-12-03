import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';

import fs from 'fs';
import { initializeApp } from 'firebase/app';

// Configuración de Firebase
const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_AUTH_DOMAIN',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_STORAGE_BUCKET',
  messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
  appId: 'YOUR_APP_ID',
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export async function uploadToFirebaseStorage(
  filePath: string,
  folder: string,
): Promise<string | null> {
  try {
    const fileBuffer = await fs.promises.readFile(filePath);
    const fileName = `${folder}/${filePath.split('/').pop() || 'file'}`;
    const storageRef = ref(storage, fileName);

    await uploadBytes(storageRef, fileBuffer);

    // Obtén la URL de descarga
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading to Firebase Storage:', error);
    return null;
  }
}
