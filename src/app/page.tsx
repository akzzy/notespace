import { CreateSpaceButton } from '@/components/CreateSpaceButton';
import { Icons } from '@/components/Icons';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="container z-40 bg-background">
        <div className="flex h-20 items-center justify-between py-6">
          <div className="flex gap-6 md:gap-10">
            <a href="/" className="flex items-center space-x-2">
              <Icons.logo className="h-8 w-8 text-primary" />
              <span className="font-bold text-lg">NoteSpace</span>
            </a>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <div className="container relative flex flex-col items-center justify-center gap-4 py-20 text-center md:py-32">
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
        </div>
      </main>
    </div>
  );
}
