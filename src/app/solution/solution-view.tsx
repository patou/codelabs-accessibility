'use client';

import { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Skeleton } from '@/components/ui/skeleton';
import { Code, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function SolutionView({ content }: { content: string }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Create a blob URL for the iframe content to ensure it's self-contained
  const blob = new Blob([content], { type: 'text/html' });
  const previewUrl = URL.createObjectURL(blob);

  // Clean up blob URL on unmount
  useEffect(() => {
    return () => {
        if(previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }
    }
  },[previewUrl])

  return (
    <div className="flex flex-col h-full w-full">
      <header className="flex items-center justify-between p-2 border-b bg-card">
        <div className="flex items-center gap-2">
          <Code className="h-6 w-6 text-primary" />
          <h1 className="text-lg font-semibold">Solution Accessible</h1>
        </div>
        <Link href="/" passHref>
          <Button variant="outline" size="sm">
            <Home className="mr-2 h-4 w-4" />
            Retour à l'éditeur
          </Button>
        </Link>
      </header>
      <div className="flex flex-1 flex-col md:flex-row min-h-0">
        <div className="w-full md:w-1/2 h-1/2 md:h-full flex flex-col border-t md:border-t-0 md:border-r">
          <Editor
            height="100%"
            language="html"
            theme="vs-dark"
            value={content}
            loading={<Skeleton className="w-full h-full" />}
            options={{
              readOnly: true, // Make the editor non-editable
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
              src={previewUrl}
              title="Aperçu de la solution accessible"
              sandbox="allow-scripts allow-same-origin"
              className="w-full h-full border-0"
            />
          ) : (
            <Skeleton className="w-full h-full" />
          )}
           <div className="absolute top-2 left-2 bg-slate-800 text-white text-xs px-2 py-1 rounded-full opacity-70 pointer-events-none">
            Aperçu de la solution
          </div>
        </div>
      </div>
    </div>
  );
}
