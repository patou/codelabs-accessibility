import * as admin from 'firebase-admin';
import 'dotenv/config';

// Collection Firestore où les documents HTML seront stockés
const HTML_COLLECTION = 'html_documents';

/**
 * Initialise Firebase Admin si ce n'est pas déjà fait et retourne l'instance de Firestore.
 * Cela évite les initialisations multiples en environnement de développement avec rechargement à chaud.
 */
function getFirestoreInstance() {
  if (!admin.apps.length) {
    if (process.env.NODE_ENV === 'development') {
      // En développement, utilisez les identifiants du compte de service depuis les variables d'environnement.
      if (process.env.FIREBASE_PRIVATE_KEY) {
        admin.initializeApp({
          credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            // Remplacez les échappements de nouvelle ligne par de vraies nouvelles lignes
            privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
          }),
        });
      } else {
        // Avertissement si les variables ne sont pas définies en local
        console.warn(`
          ********************************************************************************
          * VARIABLES D'ENVIRONNEMENT FIREBASE NON DÉFINIES POUR LE DÉVELOPPEMENT LOCAL *
          *------------------------------------------------------------------------------*
          * L'application ne pourra pas se connecter à Firestore.                        *
          * Veuillez créer un fichier .env.local à la racine du projet et y ajouter   *
          * les variables d'environnement de votre compte de service Firebase.         *
          * Consultez le README.md pour plus d'instructions.                           *
          ********************************************************************************
        `);
      }
    } else {
      // En production (sur App Hosting), initialisez sans paramètres.
      // Le SDK les utilisera automatiquement.
      admin.initializeApp();
    }
  }
  return admin.firestore();
}

/**
 * Récupère le contenu HTML depuis Firestore.
 * @param id L'identifiant unique du document.
 * @returns Le contenu HTML sous forme de chaîne de caractères.
 */
export async function getHtmlFromDb(id: string): Promise<string | null> {
  try {
    const db = getFirestoreInstance();
    const docRef = db.collection(HTML_COLLECTION).doc(id);
    const docSnap = await docRef.get();

    if (docSnap.exists) {
      // Le 'content' peut être undefined si le document est vide.
      return docSnap.data()?.content ?? null;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Erreur lors de la récupération depuis Firestore:', error);
    // Si la connexion échoue (par ex. en local sans config), on retourne null.
    // L'action appelante se chargera de fournir un contenu par défaut.
    return null;
  }
}

/**
 * Sauvegarde le contenu HTML dans Firestore.
 * @param id L'identifiant unique du document.
 * @param content Le contenu HTML à sauvegarder.
 */
export async function saveHtmlToDb(id: string, content: string): Promise<void> {
  try {
    const db = getFirestoreInstance();
    const docRef = db.collection(HTML_COLLECTION).doc(id);
    await docRef.set({ content }, { merge: true });
  } catch (error) {
    console.error('Erreur lors de la sauvegarde dans Firestore:', error);
    // Ne propage pas l'erreur pour ne pas faire planter l'application,
    // surtout si le client est hors ligne.
    throw error;
  }
}
