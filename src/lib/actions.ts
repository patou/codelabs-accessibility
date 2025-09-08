'use server';

import { revalidatePath } from 'next/cache';
import { htmlStore } from './db';
import { initialHtml } from './initial-html';

export async function getHtml(id: string): Promise<string> {
  if (htmlStore.has(id)) {
    return htmlStore.get(id)!;
  }
  // Store the initial HTML for the new ID if it doesn't exist
  htmlStore.set(id, initialHtml);
  return initialHtml;
}

export async function saveHtml(id: string, content: string): Promise<{ success: boolean; error?: string }> {
  try {
    htmlStore.set(id, content);
    // Revalidate both the edit and view paths to ensure content consistency
    revalidatePath(`/edit/${id}`);
    revalidatePath(`/view/${id}`);
    return { success: true };
  } catch (error) {
    console.error('Failed to save HTML:', error);
    return { success: false, error: 'Failed to save content.' };
  }
}
