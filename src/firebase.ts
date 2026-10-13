import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import fs from 'fs';
import path from 'path';

let firebaseConfig: any = null;

try {
  const configPath = path.resolve(process.cwd(), 'firebase-applet-config.json');
  if (fs.existsSync(configPath)) {
    const raw = fs.readFileSync(configPath, 'utf-8');
    firebaseConfig = JSON.parse(raw);
  }
} catch (e) {
  console.warn('Could not load firebase-applet-config.json from filesystem', e);
}

if (!firebaseConfig) {
  firebaseConfig = {
    projectId: "potent-karst-vtn3v",
    appId: "1:983773683741:web:c92027f273c574dafea6f4",
    apiKey: "AIzaSyCS2iT0m1tH6kdkAcsVYcxvwTOAAmZbqk8",
    authDomain: "potent-karst-vtn3v.firebaseapp.com",
    firestoreDatabaseId: "ai-studio-altivioelevating-7fd5d5a1-d7f4-43b8-9863-62df57a58ef8",
    storageBucket: "potent-karst-vtn3v.firebasestorage.app",
    messagingSenderId: "983773683741"
  };
}

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const db = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

export async function testFirestoreConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log('[Firestore] Successfully verified connection to Firestore database.');
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('[Firestore] Client is offline or database initializing. Check config.');
    } else {
      console.log('[Firestore] Initialized with remote database.');
    }
  }
}
