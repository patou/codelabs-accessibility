'use server';

/**
 * @fileOverview Un agent IA qui fournit des suggestions d'accessibilité pour le code HTML.
 *
 * - getAccessibilitySuggestions - Une fonction qui prend du code HTML en entrée et renvoie des suggestions d'accessibilité.
 * - AccessibilitySuggestionsInput - Le type d'entrée pour la fonction getAccessibilitySuggestions.
 * - AccessibilitySuggestionsOutput - Le type de retour pour la fonction getAccessibilitySuggestions.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AccessibilitySuggestionsInputSchema = z.object({
  htmlCode: z.string().describe("Le code HTML à analyser pour les problèmes d'accessibilité."),
});
export type AccessibilitySuggestionsInput = z.infer<typeof AccessibilitySuggestionsInputSchema>;

const AccessibilitySuggestionsOutputSchema = z.object({
  suggestions: z
    .array(z.string())
    .describe("Une liste de suggestions d'accessibilité pour le code HTML donné."),
});
export type AccessibilitySuggestionsOutput = z.infer<typeof AccessibilitySuggestionsOutputSchema>;

export async function getAccessibilitySuggestions(
  input: AccessibilitySuggestionsInput
): Promise<AccessibilitySuggestionsOutput> {
  return accessibilitySuggestionsFlow(input);
}

const accessibilitySuggestionsPrompt = ai.definePrompt({
  name: 'accessibilitySuggestionsPrompt',
  input: {schema: AccessibilitySuggestionsInputSchema},
  output: {schema: AccessibilitySuggestionsOutputSchema},
  prompt: `Vous êtes un expert en accessibilité web.

  Analysez le code HTML suivant et fournissez une liste de suggestions pour améliorer son accessibilité.
  Soyez précis et fournissez des recommandations concrètes.

  Code HTML:
  {{htmlCode}}

  Suggestions:`,
});

const accessibilitySuggestionsFlow = ai.defineFlow(
  {
    name: 'accessibilitySuggestionsFlow',
    inputSchema: AccessibilitySuggestionsInputSchema,
    outputSchema: AccessibilitySuggestionsOutputSchema,
  },
  async input => {
    const {output} = await accessibilitySuggestionsPrompt(input);
    return output!;
  }
);
