import * as admin from 'firebase-admin';

// Initialise Firebase Admin
// Si les variables d'environnement de Google Cloud sont définies (comme sur App Hosting),
// le SDK les utilisera automatiquement.
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

// Collection Firestore où les documents HTML seront stockés
const HTML_COLLECTION = 'html_documents';

/**
 * Récupère le contenu HTML depuis Firestore.
 * @param id L'identifiant unique du document.
 * @returns Le contenu HTML sous forme de chaîne de caractères.
 */
export async function getHtmlFromDb(id: string): Promise<string | null> {
  const docRef = db.collection(HTML_COLLECTION).doc(id);
  const docSnap = await docRef.get();

  if (docSnap.exists) {
    return docSnap.data()?.content;
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
  const docRef = db.collection(HTML_COLLECTION).doc(id);
  await docRef.set({ content }, { merge: true });
}
