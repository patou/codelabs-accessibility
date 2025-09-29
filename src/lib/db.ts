import * as admin from 'firebase-admin';

// Collection Firestore où les documents HTML seront stockés
const HTML_COLLECTION = 'html_documents';

/**
 * Initialise Firebase Admin si ce n'est pas déjà fait et retourne l'instance de Firestore.
 * Cela évite les initialisations multiples en environnement de développement avec rechargement à chaud.
 */
function getFirestoreInstance() {
  if (!admin.apps.length) {
    admin.initializeApp();
  }
  return admin.firestore();
}

/**
 * Récupère le contenu HTML depuis Firestore.
 * @param id L'identifiant unique du document.
 * @returns Le contenu HTML sous forme de chaîne de caractères.
 */
export async function getHtmlFromDb(id: string): Promise<string | null> {
  const db = getFirestoreInstance();
  const docRef = db.collection(HTML_COLLECTION).doc(id);
  const docSnap = await docRef.get();

  if (docSnap.exists) {
    // Le 'content' peut être undefined si le document est vide.
    return docSnap.data()?.content ?? null;
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
  const db = getFirestoreInstance();
  const docRef = db.collection(HTML_COLLECTION).doc(id);
  await docRef.set({ content }, { merge: true });
}
