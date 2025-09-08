import { getHtml } from '@/lib/actions';
import { notFound } from 'next/navigation';
import { EditorView } from './editor-view';

// This page should be dynamic to fetch the latest state on load
export const dynamic = 'force-dynamic';

export default async function EditPage({ params }: { params: { id: string } }) {
  if (!params.id) {
    notFound();
  }

  const initialContent = await getHtml(params.id);

  return (
    <div className="h-screen w-screen bg-background text-foreground overflow-hidden">
      <EditorView id={params.id} initialContent={initialContent} />
    </div>
  );
}
