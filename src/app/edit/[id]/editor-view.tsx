
'use client';

import { useState, useEffect, useTransition } from 'react';
import Editor from '@monaco-editor/react';
import { saveHtml } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { ActionsPanel } from './actions-panel';

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}

export function EditorView({ id, initialContent }: { id: string; initialContent: string }) {
  const [content, setContent] = useState(initialContent);
  const debouncedContent = useDebounce(content, 500);
  const [isSaving, startSaveTransition] = useTransition();
  const { toast } = useToast();
  const [isMounted, setIsMounted] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    // Create a Blob URL from the HTML content to refresh the iframe reliably
    const blob = new Blob([debouncedContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    setPreviewUrl(url);

    // Clean up the object URL to avoid memory leaks
    return () => URL.revokeObjectURL(url);
  }, [debouncedContent]);


  useEffect(() => {
    // Only save if the content has changed from the initial state or subsequent debounced states
    if (isMounted && debouncedContent !== initialContent) {
      startSaveTransition(async () => {
        const result = await saveHtml(id, debouncedContent);
        if (result.error) {
          toast({
            title: "Erreur d'enregistrement",
            description: result.error,
            variant: 'destructive',
          });
        }
      });
    }
  }, [debouncedContent, id, toast, isMounted, initialContent]);

  return (
    <div className="flex flex-col h-full w-full">
      <ActionsPanel id={id} content={content} isSaving={isSaving} />
      <div className="flex flex-1 flex-col md:flex-row min-h-0">
        <div className="w-full md:w-1/2 h-1/2 md:h-full flex flex-col border-t md:border-t-0 md:border-r">
          <Editor
            height="100%"
            language="html"
            theme="vs-dark"
            value={content}
            onChange={(value) => setContent(value || '')}
            loading={<Skeleton className="w-full h-full" />}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              wordWrap: 'on',
              automaticLayout: true,
              scrollBeyondLastLine: false,
            }}
          />
        </div>
        <div className="w-full md:w-1/2 h-1/2 md:h-full bg-white relative">
          {isMounted ? (
            <iframe
              key={previewUrl} // Force re-render on URL change
              src={previewUrl}
              title="Aperçu en direct"
              sandbox="allow-scripts allow-same-origin"
              className="w-full h-full border-0 transition-opacity duration-300"
            />
          ) : (
            <Skeleton className="w-full h-full" />
          )}
           <div className="absolute top-2 left-2 bg-slate-800 text-white text-xs px-2 py-1 rounded-full opacity-70 pointer-events-none">
            Aperçu en direct
          </div>
        </div>
      </div>
    </div>
  );
}
