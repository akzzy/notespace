import { CreateSpaceButton } from '@/components/CreateSpaceButton';
import { JoinSpaceForm } from '@/components/JoinSpaceForm';
import { Icons } from '@/components/Icons';
import { getNoteSpacesByIp } from '@/lib/db';
import { headers } from 'next/headers';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function Home() {
  const ip = headers().get('x-forwarded-for') ?? '::1';
  const recentSpaces = await getNoteSpacesByIp(ip);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="container mx-auto z-40">
        <div className="flex h-20 items-center justify-between py-6">
          <a href="/" className="flex items-center space-x-2">
            <Icons.logo className="h-8 w-8 text-primary" />
            <span className="font-bold text-lg">NoteSpace</span>
          </a>
        </div>
      </header>
      <main className="flex-1">
        <div className="container mx-auto relative flex flex-col items-center justify-center gap-4 py-20 text-center md:py-32">
          <div className="absolute top-0 -z-10 h-full w-full bg-white dark:bg-background">
            <div className="absolute bottom-auto left-auto right-0 top-0 h-[500px] w-[500px] -translate-x-[30%] translate-y-[20%] rounded-full bg-[rgba(0,150,136,0.2)] opacity-50 blur-[80px]"></div>
          </div>

          <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
            Your ideas, anywhere.
          </h1>
          <p className="max-w-[700px] text-lg text-muted-foreground sm:text-xl">
            A private space for your notes, accessible from any device. Create your unique NoteSpace and start capturing your thoughts instantly.
          </p>
          <div className="mt-6">
            <CreateSpaceButton />
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

          {recentSpaces.length > 0 && (
            <div className="mt-16 w-full max-w-sm">
                <h2 className="text-lg font-semibold text-muted-foreground mb-4">Recently Visited</h2>
                <div className="flex flex-col gap-2">
                    {recentSpaces.map(spaceId => (
                        <Link href={`/${spaceId}`} key={spaceId} legacyBehavior>
                            <Button variant="outline" className="w-full justify-center font-mono text-lg tracking-widest h-11">
                                {spaceId}
                            </Button>
                        </Link>
                    ))}
                </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
