'use server';

import { revalidatePath } from 'next/cache';
import { getHtmlFromDb, saveHtmlToDb } from './db';
import { getInitialHtml, getSolutionHtml as readSolutionHtml } from './initial-html';
import { notFound } from 'next/navigation';

export async function getHtml(id: string): Promise<string> {
  try {
    const content = await getHtmlFromDb(id);
    if (content !== null) {
      return content;
    }
    
    // Si le document n'existe pas, lisez le HTML initial et sauvegardez-le.
    const initialContent = await getInitialHtml();
    await saveHtmlToDb(id, initialContent);
    return initialContent;
  } catch (error) {
    // Si une erreur se produit (par ex. client hors ligne), retournez le HTML par défaut
    // pour éviter de planter l'application.
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
