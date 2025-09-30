'use server';
import * as admin from 'firebase-admin';

let db: admin.firestore.Firestore | null = null;

function initializeDb() {
  if (admin.apps.length > 0) {
    db = admin.firestore();
    return;
  }
  try {
    // initializeApp() sans argument fonctionne pour :
    // 1. App Hosting (détecte automatiquement les identifiants)
    // 2. Environnement local si GOOGLE_APPLICATION_CREDENTIALS est défini
    admin.initializeApp();
    db = admin.firestore();
    console.log('Firebase Admin SDK initialisé avec succès.');
  } catch (error: any) {
    console.error(
      'Échec de l’initialisation de Firebase Admin SDK:',
      error.message
    );
    console.warn(`
      ************************************************************************
      * ERREUR DE CONFIGURATION FIREBASE                                     *
      *----------------------------------------------------------------------*
      * Pour le développement local, assurez-vous que la variable            *
      * d'environnement GOOGLE_APPLICATION_CREDENTIALS est bien définie      *
      * et pointe vers un fichier de clé de service valide.                  *
      *                                                                      *
      * En production (App Hosting), cela devrait fonctionner                *
      * automatiquement. Si cette erreur apparaît en production, vérifiez    *
      * les permissions IAM de votre compte de service.                      *
      *                                                                      *
      * L'application va continuer en mode hors ligne.                       *
      ************************************************************************
    `);
  }
}

/**
 * Retourne une instance de Firestore.
 * Tente d'initialiser si ce n'est pas déjà fait.
 */
function getFirestoreInstance(): admin.firestore.Firestore | null {
  if (!db) {
    initializeDb();
  }
  return db;
}

/**
 * Récupère le contenu HTML depuis Firestore.
 * @param id L'identifiant unique du document.
 * @returns Le contenu HTML sous forme de chaîne de caractères ou null.
 */
export async function getHtmlFromDb(id: string): Promise<string | null> {
  const firestore = getFirestoreInstance();
  if (!firestore) {
    console.warn(
      "Firestore n'est pas disponible. Lecture depuis la base de données annulée."
    );
    return null;
  }

  try {
    const docRef = firestore.collection('html_documents').doc(id);
    const docSnap = await docRef.get();

    if (docSnap.exists) {
      return docSnap.data()?.content ?? null;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Erreur lors de la récupération depuis Firestore:', error);
    return null;
  }
}

/**
 * Sauvegarde le contenu HTML dans Firestore.
 * @param id L'identifiant unique du document.
 * @param content Le contenu HTML à sauvegarder.
 */
export async function saveHtmlToDb(id: string, content: string): Promise<void> {
  const firestore = getFirestoreInstance();
  if (!firestore) {
    console.warn(
      "Firestore n'est pas disponible. Sauvegarde en base de données annulée."
    );
    // On propage l'erreur pour que l'appelant sache que la sauvegarde a échoué.
    throw new Error('Firestore is not available.');
  }

  try {
    const docRef = firestore.collection('html_documents').doc(id);
    await docRef.set({ content }, { merge: true });
  } catch (error) {
    console.error('Erreur lors de la sauvegarde dans Firestore:', error);
    throw error;
  }
}
