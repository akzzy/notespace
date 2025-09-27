'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CreateNoteForm } from '@/components/CreateNoteForm';
import { JoinSpaceForm } from '@/components/JoinSpaceForm';

interface HomeClientProps {
  discoverableSpaces: string[];
}

export default function HomeClient({ discoverableSpaces }: HomeClientProps) {
  const [recentSpaces, setRecentSpaces] = useState<string[]>([]);

  useEffect(() => {
    try {
      const storedRecents = localStorage.getItem('recentNoteSpaces');
      if (storedRecents) {
        const parsedRecents = JSON.parse(storedRecents);
        // Filter out any invalid entries that might have been stored
        const validRecents = parsedRecents.filter((id: any) => typeof id === 'string' && id && id !== 'undefined');
        setRecentSpaces(validRecents);
      }
    } catch (error) {
      console.error("Failed to parse recent spaces from localStorage", error);
      setRecentSpaces([]);
    }
  }, []);

  // Combine localStorage spaces with discoverable spaces, avoiding duplicates
  const allSpaces = [...new Set([...recentSpaces, ...discoverableSpaces])];

  return (
    <>
      <div className="mt-8 w-full max-w-3xl">
        <CreateNoteForm />
      </div>

      <div className="mt-12 w-full max-w-md">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or
            </span>
          </div>
        </div>
      </div>

      <div className="mt-6 w-full max-w-sm">
        <JoinSpaceForm />
      </div>

      {allSpaces.length > 0 && (
        <div className="mt-16 w-full max-w-sm">
          <h2 className="text-lg font-semibold text-muted-foreground mb-4">Recently Visited</h2>
          <div className="flex flex-col gap-2">
            {allSpaces.map(spaceId => (
              <Link href={`/${spaceId}`} key={spaceId} legacyBehavior>
                <Button variant="outline" className="w-full justify-center font-mono text-lg tracking-widest h-11">
                  {spaceId}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
