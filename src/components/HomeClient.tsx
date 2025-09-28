'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CreateNoteForm } from '@/components/CreateNoteForm';
import { JoinSpaceForm } from '@/components/JoinSpaceForm';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

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

      <div className="mt-12 w-full max-w-3xl">
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
      
      <div className="mt-6 w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-8 justify-center items-start">
        <div className="w-full max-w-sm mx-auto">
          <JoinSpaceForm />
        </div>

        {allSpaces.length > 0 && (
          <div className="w-full max-w-sm mx-auto">
            <Card>
              <CardHeader className="text-center pb-4">
                <CardTitle>Recently Visited</CardTitle>
                <CardDescription>Select one of your recent spaces.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {allSpaces.slice(0, 4).map(spaceId => (
                    <Link href={`/${spaceId}`} key={spaceId}>
                      <Button variant="outline" className="w-full justify-center font-mono text-base tracking-widest h-11">
                        {spaceId}
                      </Button>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

    </>
  );
}
