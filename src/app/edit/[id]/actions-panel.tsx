'use client';

import { useState, useEffect } from 'react';
import QRCode from 'qrcode.react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { getAccessibilitySuggestions } from '@/ai/flows/accessibility-suggestions';
import { Code, QrCode, Sparkles, Loader2, Save } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export function ActionsPanel({ id, content, isSaving }: { id: string; content: string; isSaving: boolean }) {
  const [qrUrl, setQrUrl] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isAiLoading, setIsAiLoading] = useState(false);

  useEffect(() => {
    // Ensure window is defined before using it
    if (typeof window !== 'undefined') {
      setQrUrl(`${window.location.origin}/view/${id}`);
    }
  }, [id]);

  const handleGetSuggestions = async () => {
    setIsAiLoading(true);
    setSuggestions([]);
    try {
      const result = await getAccessibilitySuggestions({ htmlCode: content });
      setSuggestions(result.suggestions);
    } catch (error) {
      console.error('Failed to get AI suggestions:', error);
      setSuggestions(['An error occurred while fetching suggestions. Please try again.']);
    } finally {
      setIsAiLoading(false);
    }
  };

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
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              <span>Saved</span>
            </>
          )}
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <QrCode className="mr-2 h-4 w-4" />
              Mobile View
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>View on Mobile</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col items-center justify-center gap-4 p-4">
              <p className="text-center text-muted-foreground">Scan this QR code with your mobile device to see a live preview of your page.</p>
              {qrUrl ? (
                <div className="p-4 bg-white rounded-lg">
                  <QRCode value={qrUrl} size={200} />
                </div>
              ) : (
                <Skeleton className="w-[216px] h-[216px]" />
              )}
               <p className="text-xs text-muted-foreground break-all">{qrUrl}</p>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog onOpenChange={(open) => !open && setSuggestions([])}>
          <DialogTrigger asChild>
            <Button size="sm" onClick={handleGetSuggestions}>
              <Sparkles className="mr-2 h-4 w-4" />
              Get AI Suggestions
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Accessibility Suggestions</DialogTitle>
            </DialogHeader>
            <div className="max-h-[60vh] overflow-y-auto p-1">
              {isAiLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : (
                <Accordion type="single" collapsible className="w-full">
                  {suggestions.length > 0 ? (
                    suggestions.map((suggestion, index) => (
                      <AccordionItem value={`item-${index}`} key={index}>
                        <AccordionTrigger>Suggestion #{index + 1}</AccordionTrigger>
                        <AccordionContent>{suggestion}</AccordionContent>
                      </AccordionItem>
                    ))
                  ) : (
                     <p className="text-muted-foreground text-center py-8">Click "Get AI Suggestions" to start.</p>
                  )}
                </Accordion>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </header>
  );
}
