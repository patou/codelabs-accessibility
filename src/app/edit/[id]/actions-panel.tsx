'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { QRCodeCanvas } from 'qrcode.react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip';
import { Code, QrCode, Save, Loader2, PlusSquare, GraduationCap } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export function ActionsPanel({ id, content, isSaving }: { id: string; content: string; isSaving: boolean }) {
  const [qrUrl, setQrUrl] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setQrUrl(`${window.location.origin}/view/${id}`);
    }
  }, [id]);

  const handleNewDocument = () => {
    // This logic runs on the client, so we can use browser APIs.
    const array = new Uint8Array(8);
    window.crypto.getRandomValues(array);
    const newId = Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
    router.push(`/edit/${newId}`);
  };

  return (
    <header className="flex items-center justify-between p-2 border-b bg-card">
      <div className="flex items-center gap-2">
        <Code className="h-6 w-6 text-primary" />
        <h1 className="text-lg font-semibold">Codelabs Accessibilité</h1>
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
        
        <TooltipProvider>
          <AlertDialog>
            <Tooltip>
              <TooltipTrigger asChild>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm" className="p-2 md:px-3">
                    <PlusSquare className="h-4 w-4 md:mr-2" />
                    <span className="hidden md:inline">Nouveau</span>
                  </Button>
                </AlertDialogTrigger>
              </TooltipTrigger>
              <TooltipContent className="md:hidden">
                <p>Nouveau</p>
              </TooltipContent>
            </Tooltip>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Créer un nouveau document ?</AlertDialogTitle>
                <AlertDialogDescription>
                  Vous êtes sur le point de quitter cette session d'édition pour en commencer une nouvelle. Vos modifications actuelles sont enregistrées. Voulez-vous continuer ?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction onClick={handleNewDocument}>
                  Continuer
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href="/tutorial" passHref>
                <Button variant="outline" size="sm" className="p-2 md:px-3">
                  <GraduationCap className="h-4 w-4 md:mr-2" />
                  <span className="hidden md:inline">Tutoriel</span>
                </Button>
              </Link>
            </TooltipTrigger>
            <TooltipContent className="md:hidden">
              <p>Tutoriel</p>
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
        </TooltipProvider>
      </div>
    </header>
  );
}