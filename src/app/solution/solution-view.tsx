'use client';

import { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Skeleton } from '@/components/ui/skeleton';
import { Code, Home, QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { QRCodeCanvas } from 'qrcode.react';

export function SolutionView({ content }: { content: string }) {
  const [isMounted, setIsMounted] = useState(false);
  const [qrUrl, setQrUrl] = useState('');

  const previewUrl = '/view/solution';

  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== 'undefined') {
      setQrUrl(`${window.location.origin}${previewUrl}`);
    }
  }, [previewUrl]);

  return (
    <div className="flex flex-col h-full w-full">
      <header className="flex items-center justify-between p-2 border-b bg-card">
        <div className="flex items-center gap-2">
          <Code className="h-6 w-6 text-primary" />
          <h1 className="text-lg font-semibold">Solution Accessible</h1>
        </div>
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="/" passHref>
                  <Button variant="outline" size="sm" className="p-2 md:px-3">
                    <Home className="h-4 w-4 md:mr-2" />
                    <span className="hidden md:inline">Retour à l'éditeur</span>
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent className="md:hidden">
                <p>Retour à l'éditeur</p>
              </TooltipContent>
            </Tooltip>

            <Dialog>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="p-2 md:px-3">
                      <QrCode className="h-4 w-4 md:mr-2" />
                      <span className="hidden md:inline">Vue Mobile</span>
                    </Button>
                  </DialogTrigger>
                </TooltipTrigger>
                <TooltipContent className="md:hidden">
                  <p>Vue Mobile</p>
                </TooltipContent>
              </Tooltip>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Voir sur Mobile</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col items-center justify-center gap-4 p-4">
                  <p className="text-center text-muted-foreground">Scannez ce code QR avec votre appareil mobile pour voir un aperçu en direct de la page de solution.</p>
                  {qrUrl ? (
                    <div className="p-4 bg-white rounded-lg flex items-center justify-center">
                      <QRCodeCanvas value={qrUrl} size={200} bgColor="#ffffff" fgColor="#000000" />
                    </div>
                  ) : (
                    <Skeleton className="w-[232px] h-[232px]" />
                  )}
                   {qrUrl ? (
                    <a href={qrUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline break-all max-w-full text-center">
                      {qrUrl}
                    </a>
                  ) : (
                    <Skeleton className="h-4 w-full max-w-xs" />
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </TooltipProvider>
        </div>
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
              readOnly: true,
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
              sandbox="allow-scripts allow-same-origin allow-forms"
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
