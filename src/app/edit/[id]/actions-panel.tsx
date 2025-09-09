'use client';

import { useState, useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Code, QrCode, Save, Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export function ActionsPanel({ id, content, isSaving }: { id: string; content: string; isSaving: boolean }) {
  const [qrUrl, setQrUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setQrUrl(`${window.location.origin}/view/${id}`);
    }
  }, [id]);

  return (
    <header className="flex items-center justify-between p-2 border-b bg-card">
      <div className="flex items-center gap-2">
        <Code className="h-6 w-6 text-primary" />
        <h1 className="text-lg font-semibold">HTML Alter</h1>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mr-4">
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Enregistrement...</span>
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              <span>Enregistré</span>
            </>
          )}
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <QrCode className="mr-2 h-4 w-4" />
              Vue Mobile
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Voir sur Mobile</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col items-center justify-center gap-4 p-4">
              <p className="text-center text-muted-foreground">Scannez ce code QR avec votre appareil mobile pour voir un aperçu en direct de votre page.</p>
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
      </div>
    </header>
  );
}
