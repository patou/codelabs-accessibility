'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'codelabs-a11y-latest-id';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // localStorage is only available on the client.
    let latestId = localStorage.getItem(LOCAL_STORAGE_KEY);

    if (!latestId) {
      // If no ID is found, generate a new one.
      const array = new Uint8Array(8);
      window.crypto.getRandomValues(array);
      latestId = Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
      localStorage.setItem(LOCAL_STORAGE_KEY, latestId);
    }
    
    // Redirect to the latest or newly created document.
    router.replace(`/edit/${latestId}`);
  }, [router]);

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center bg-background text-foreground">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="mt-4 text-muted-foreground">Chargement de votre session...</p>
    </div>
  );
}
