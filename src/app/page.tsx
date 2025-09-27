import { headers } from 'next/headers';
import { getNoteSpacesByIp } from '@/lib/db';
import { Icons } from '@/components/Icons';
import HomeClient from '@/components/HomeClient';

export default async function Home() {
  const headersList = headers();
  const ip = headersList.get('x-forwarded-for') ?? '::1';
  // We still fetch by IP for the initial "discoverable" feature.
  // The client-side localStorage will handle personal recent spaces.
  const discoverableSpaces = await getNoteSpacesByIp(ip);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="container mx-auto z-40 px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between py-6">
          <a href="/" className="flex items-center space-x-2">
            <Icons.logo className="h-8 w-8 text-primary" />
            <span className="font-bold text-lg">NoteSpace</span>
          </a>
        </div>
      </header>
      <main className="flex-1">
        <div className="container mx-auto relative flex flex-col items-center justify-center gap-4 py-12 text-center md:py-20 px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl whitespace-nowrap">
            A space for your thoughts.
          </h1>
          <p className="max-w-[700px] text-lg text-muted-foreground sm:text-xl">
            Just start typing and create a private notespace. Instantly.
          </p>

          <HomeClient discoverableSpaces={discoverableSpaces} />
          
        </div>
      </main>
    </div>
  );
}
