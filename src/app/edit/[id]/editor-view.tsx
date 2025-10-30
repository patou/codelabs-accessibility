
'use client';

import { useState, useEffect, useTransition } from 'react';
import Editor from '@monaco-editor/react';
import { saveHtml } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { ActionsPanel } from './actions-panel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useIsMobile } from '@/hooks/use-mobile';
import {
  ResizablePanel,
  ResizablePanelGroup,
  ResizableHandle,
} from "@/components/ui/resizable"

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
  const isMobile = useIsMobile();


  useEffect(() => {
    setIsMounted(true);

    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (isMounted && debouncedContent !== initialContent) {
        startSaveTransition(async () => {
          const result = await saveHtml(id, debouncedContent);
          if (result.error) {
            toast({
              title: "Erreur d'enregistrement",
              description: result.error,
              variant: 'destructive',
            });
          } else {
            setPreviewVersion((v) => v + 1);
          }
        });
    }
  }, [debouncedContent, id, toast, isMounted, initialContent]);

  const previewUrl = `/view/${id}`;

  const editorComponent = (
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
  );

  const previewComponent = (
    <div className="w-full h-full bg-white relative">
      {isMounted ? (
        <iframe
          key={previewVersion}
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
  );

  return (
    <div className="flex flex-col h-full w-full">
      <ActionsPanel id={id} content={content} isSaving={isSaving} />
      
      {isMobile ? (
        <Tabs defaultValue="code" className="flex flex-col flex-1 min-h-0 w-full">
          <TabsList className="grid w-full grid-cols-2 rounded-none">
            <TabsTrigger value="code">Code</TabsTrigger>
            <TabsTrigger value="preview">Aperçu</TabsTrigger>
          </TabsList>
          <TabsContent value="code" className="flex-1 min-h-0 data-[state=inactive]:hidden">
            {editorComponent}
          </TabsContent>
          <TabsContent value="preview" className="flex-1 min-h-0 data-[state=inactive]:hidden">
            {previewComponent}
          </TabsContent>
        </Tabs>
      ) : (
        <ResizablePanelGroup direction="horizontal" className="flex flex-1 flex-row min-h-0">
          <ResizablePanel defaultSize={50}>
            <div className="w-full h-full flex flex-col">
              {editorComponent}
            </div>
          </ResizablePanel>
          <ResizableHandle className="w-px bg-border hover:bg-primary transition-colors data-[resize-handle-state=drag]:bg-primary" />
          <ResizablePanel defaultSize={50}>
            {previewComponent}
          </ResizablePanel>
        </ResizablePanelGroup>
      )}
    </div>
  );
}
