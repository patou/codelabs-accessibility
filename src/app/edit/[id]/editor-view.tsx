
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
  const [previewVersion, setPreviewVersion] = useState(0);
  const [isHtmlValid, setIsHtmlValid] = useState(true);

  useEffect(() => {
    setIsMounted(true);

    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault();
        // Optionnel : on pourrait déclencher une sauvegarde manuelle ici si besoin.
        // Pour l'instant, on empêche juste la popup du navigateur.
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    // Only save if content has changed and is valid
    if (isMounted && debouncedContent !== initialContent && isHtmlValid) {
      startSaveTransition(async () => {
        const result = await saveHtml(id, debouncedContent);
        if (result.error) {
          toast({
            title: "Erreur d'enregistrement",
            description: result.error,
            variant: 'destructive',
          });
        } else {
          // Increment version to force iframe reload
          setPreviewVersion((v) => v + 1);
        }
      });
    }
  }, [debouncedContent, id, toast, isMounted, initialContent, isHtmlValid]);

  const previewUrl = `/view/${id}`;

  const handleEditorValidation = (markers: any[]) => {
    // A marker with severity 8 is an error.
    const hasErrors = markers.some(m => m.severity === 8);
    setIsHtmlValid(!hasErrors);
  };

  return (
    <div className="flex flex-col h-full w-full">
      <ActionsPanel id={id} content={content} isSaving={isSaving} isHtmlValid={isHtmlValid} />
      <div className="flex flex-1 flex-col md:flex-row min-h-0">
        <div className="w-full md:w-1/2 h-1/2 md:h-full flex flex-col border-t md:border-t-0 md:border-r">
          <Editor
            height="100%"
            language="html"
            theme="vs-dark"
            value={content}
            onChange={(value) => setContent(value || '')}
            onValidate={handleEditorValidation}
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
              key={previewVersion} // Force re-render on version change
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
