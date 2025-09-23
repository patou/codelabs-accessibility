import fs from 'fs/promises';
import path from 'path';

/**
 * Lit et retourne le contenu du template HTML initial à la demande.
 * Cela garantit que la version la plus récente du fichier est toujours utilisée.
 */
export async function getInitialHtml(): Promise<string> {
  // Le chemin vers le fichier initial.html
  const filePath = path.join(process.cwd(), 'src/lib/initial.html');
  // Lit le fichier de manière asynchrone
  const content = await fs.readFile(filePath, 'utf8');
  return content;
}
