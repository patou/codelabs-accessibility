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
  const debouncedContent = useDebounce(content, 1000);
  const [isSaving, startSaveTransition] = useTransition();
  const { toast } = useToast();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    // Only save if the content has changed from the initial state or subsequent debounced states
    if (isMounted && debouncedContent !== initialContent) {
      startSaveTransition(async () => {
        const result = await saveHtml(id, debouncedContent);
        if (result.error) {
          toast({
            title: 'Error saving',
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
          <iframe
            srcDoc={content}
            title="Live Preview"
            sandbox="allow-scripts allow-same-origin"
            className="w-full h-full border-0 transition-opacity duration-300"
          />
           <div className="absolute top-2 left-2 bg-slate-800 text-white text-xs px-2 py-1 rounded-full opacity-70 pointer-events-none">
            Live Preview
          </div>
        </div>
      </div>
    </div>
  );
}
