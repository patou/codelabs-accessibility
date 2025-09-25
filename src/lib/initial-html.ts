import fs from 'fs/promises';
import path from 'path';

/**
 * Lit et retourne le contenu du template HTML initial à la demande.
 */
export async function getInitialHtml(): Promise<string> {
  const filePath = path.join(process.cwd(), 'src/lib/initial.html');
  const content = await fs.readFile(filePath, 'utf8');
  return content;
}

/**
 * Lit et retourne le contenu du template HTML de la solution à la demande.
 */
export async function getSolutionHtml(): Promise<string> {
  const filePath = path.join(process.cwd(), 'src/lib/solution.html');
  const content = await fs.readFile(filePath, 'utf8');
  return content;
}
