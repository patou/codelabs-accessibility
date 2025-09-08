import { getHtmlFromDb } from '@/lib/db';
import { type NextRequest } from 'next/server';
import { initialHtml } from '@/lib/initial-html';

// This page will always be dynamically rendered to get the latest content.
export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!params.id) {
    return new Response('Not Found', { status: 404 });
  }

  let htmlContent = await getHtmlFromDb(params.id);

  if (htmlContent === null) {
    htmlContent = initialHtml;
  }

  return new Response(htmlContent, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
    },
  });
}
