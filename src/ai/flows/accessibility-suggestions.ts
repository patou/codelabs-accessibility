'use server';

/**
 * @fileOverview An AI agent that provides accessibility suggestions for HTML code.
 *
 * - getAccessibilitySuggestions - A function that takes HTML code as input and returns accessibility suggestions.
 * - AccessibilitySuggestionsInput - The input type for the getAccessibilitySuggestions function.
 * - AccessibilitySuggestionsOutput - The return type for the getAccessibilitySuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AccessibilitySuggestionsInputSchema = z.object({
  htmlCode: z.string().describe('The HTML code to analyze for accessibility issues.'),
});
export type AccessibilitySuggestionsInput = z.infer<typeof AccessibilitySuggestionsInputSchema>;

const AccessibilitySuggestionsOutputSchema = z.object({
  suggestions: z
    .array(z.string())
    .describe('A list of accessibility suggestions for the given HTML code.'),
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
  prompt: `You are an AI expert in web accessibility.

  Analyze the following HTML code and provide a list of suggestions to improve its accessibility.
  Be specific and provide actionable recommendations.

  HTML Code:
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
