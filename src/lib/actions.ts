'use server';

import { revalidatePath } from 'next/cache';
import { getHtmlFromDb, saveHtmlToDb } from './db';
import { getInitialHtml, getSolutionHtml as readSolutionHtml } from './initial-html';
import { notFound } from 'next/navigation';

export async function getHtml(id: string): Promise<string> {
  try {
    const content = await getHtmlFromDb(id);
    // Si le contenu est trouvé, on le retourne
    if (content !== null) {
      return content;
    }
    
    // Si le document n'existe pas en base, on utilise le contenu initial...
    const initialContent = await getInitialHtml();
    // ... et on essaie de le sauvegarder pour la prochaine fois, sans bloquer l'utilisateur.
    // Cette opération peut échouer si le client est hors ligne, mais ce n'est pas grave.
    await saveHtmlToDb(id, initialContent).catch(e => {
        console.warn(`Impossible de faire la sauvegarde initiale pour l'ID ${id}. Le client est peut-être hors ligne.`, e);
    });
    return initialContent;

  } catch (error) {
    // Si une erreur se produit pendant la récupération (par ex. client hors ligne),
    // on retourne le HTML initial par défaut pour éviter de planter l'application.
    console.warn(`Impossible de récupérer le HTML pour l'ID ${id} depuis la base de données. Retour au contenu par défaut. Erreur:`, error);
    return getInitialHtml();
  }
}

export async function saveHtml(id: string, content: string): Promise<{ success: boolean; error?: string }> {
  try {
    await saveHtmlToDb(id, content);
    // Revalidez les chemins pour s'assurer que le contenu est à jour
    revalidatePath(`/edit/${id}`);
    revalidatePath(`/view/${id}`);
    return { success: true };
  } catch (error) {
    console.error('Échec de la sauvegarde du HTML:', error);
    return { success: false, error: "Échec de l'enregistrement du contenu dans la base de données." };
  }
}

export async function getSolutionHtml(): Promise<string> {
    try {
        return await readSolutionHtml();
    } catch (error) {
        console.error("Failed to read solution.html", error);
        // This will be caught by Next.js and render a 404 page
        notFound();
    }
}
