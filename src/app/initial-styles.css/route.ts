import fs from 'fs';
import path from 'path';
import { type NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const css = fs.readFileSync(
      path.join(process.cwd(), 'src/lib/initial-styles.css'),
      'utf8'
    );
    return new Response(css, {
      status: 200,
      headers: {
        'Content-Type': 'text/css; charset=utf-8',
      },
    });
  } catch (error) {
    return new Response('Not Found', { status: 404 });
  }
}
