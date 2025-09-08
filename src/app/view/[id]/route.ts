'use server';

import { getHtml } from '@/lib/actions';
import { type NextRequest, NextResponse } from 'next/server';

// This page will always be dynamically rendered to get the latest content.
export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!params.id) {
    return new Response('Not Found', { status: 404 });
  }

  const htmlContent = await getHtml(params.id);

  return new Response(htmlContent, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
    },
  });
}
