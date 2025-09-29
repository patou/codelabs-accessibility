import * as admin from 'firebase-admin';
import * as fs from 'fs';
import * as path from 'path';

// Collection Firestore où les documents HTML seront stockés
const HTML_COLLECTION = 'html_documents';

/**
 * Initialise Firebase Admin si ce n'est pas déjà fait et retourne l'instance de Firestore.
 * Cela évite les initialisations multiples en environnement de développement avec rechargement à chaud.
 */
function getFirestoreInstance() {
  if (admin.apps.length > 0) {
    return admin.firestore();
  }

  // En production (sur App Hosting), le SDK détecte automatiquement les identifiants.
  if (process.env.NODE_ENV === 'production' && process.env.K_SERVICE) {
    admin.initializeApp();
  } else {
    // En développement local, on utilise un fichier de clé de compte de service.
    const serviceAccountPath = path.join(process.cwd(), 'firebase-service-account.json');
    
    if (fs.existsSync(serviceAccountPath)) {
      try {
        const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
        });
      } catch (error) {
        console.error("Erreur de parsing du fichier firebase-service-account.json:", error);
        console.warn("Assurez-vous que le fichier est un JSON valide.");
      }
    } else {
      console.warn(`
        ************************************************************************
        * FICHIER DE COMPTE DE SERVICE FIREBASE INTROUVABLE (LOCAL)            *
        *----------------------------------------------------------------------*
        * Pour le développement local, l'application ne peut pas se connecter  *
        * à Firestore sans identifiants.                                       *
        *                                                                      *
        * Veuillez télécharger un fichier de clé de compte de service depuis   *
        * la console Firebase, le renommer en 'firebase-service-account.json'  *
        * et le placer à la racine de votre projet.                            *
        *                                                                      *
        * Consultez le README.md pour les instructions détaillées.             *
        ************************************************************************
      `);
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
    // Si l'initialisation a échoué, db peut ne pas avoir de méthodes.
    if (!db || typeof db.collection !== 'function') {
        console.warn("Firestore n'est pas disponible. L'opération de lecture a été annulée.");
        return null;
    }
    
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
     // Si l'initialisation a échoué, ne rien faire.
    if (!db || typeof db.collection !== 'function') {
        console.warn("Firestore n'est pas disponible. L'opération de sauvegarde a été annulée.");
        return;
    }

    const docRef = db.collection(HTML_COLLECTION).doc(id);
    await docRef.set({ content }, { merge: true });
  } catch (error) {
    console.error('Erreur lors de la sauvegarde dans Firestore:', error);
    // Ne propage pas l'erreur pour ne pas faire planter l'application,
    // surtout si le client est hors ligne.
    throw error;
  }
}
