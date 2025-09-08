import { getHtml } from '@/lib/actions';
import { notFound } from 'next/navigation';

// This page will always be dynamically rendered to get the latest content.
export const dynamic = 'force-dynamic';

export default async function ViewPage({ params }: { params: { id: string } }) {
  if (!params.id) {
    notFound();
  }

  const htmlContent = await getHtml(params.id);

  return (
    <div style={{ width: '100%', height: '100vh', margin: 0, padding: 0, overflow: 'hidden', backgroundColor: 'white' }}>
      <iframe
        srcDoc={htmlContent}
        style={{ width: '100%', height: '100%', border: 'none' }}
        title="Live Preview"
        sandbox="allow-scripts allow-same-origin"
      />
    </div>
  );
}
