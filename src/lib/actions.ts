'use server';

import { revalidatePath } from 'next/cache';
import { getHtmlFromDb, saveHtmlToDb } from './db';
import { getInitialHtml, getSolutionHtml as readSolutionHtml } from './initial-html';
import { notFound } from 'next/navigation';

export async function getHtml(id: string): Promise<string> {
  const content = await getHtmlFromDb(id);

  // Si le contenu est trouvé en base, on le retourne.
  if (content !== null) {
    return content;
  }
  
  // Sinon (document non trouvé ou erreur DB), on retourne le contenu initial par défaut.
  // La sauvegarde ne se fera que lors de la première modification dans l'éditeur.
  return getInitialHtml();
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
