// Importe les fonctions nécessaires du SDK Firebase dont vous avez besoin
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

// La configuration de votre application web Firebase
// Assurez-vous que ces variables d'environnement sont définies dans votre fichier .env.local
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Initialise Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

// Collection Firestore où les documents HTML seront stockés
const HTML_COLLECTION = 'html_documents';

/**
 * Récupère le contenu HTML depuis Firestore.
 * @param id L'identifiant unique du document.
 * @returns Le contenu HTML sous forme de chaîne de caractères.
 */
export async function getHtmlFromDb(id: string): Promise<string | null> {
  const docRef = doc(db, HTML_COLLECTION, id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data().content;
  } else {
    return null;
  }
}

/**
 * Sauvegarde le contenu HTML dans Firestore.
 * @param id L'identifiant unique du document.
 * @param content Le contenu HTML à sauvegarder.
 */
export async function saveHtmlToDb(id: string, content: string): Promise<void> {
  const docRef = doc(db, HTML_COLLECTION, id);
  await setDoc(docRef, { content }, { merge: true });
}
