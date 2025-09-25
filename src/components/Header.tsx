import Link from 'next/link';
import { Icons } from '@/components/Icons';
import { ThemeToggle } from '@/components/ThemeToggle';

type HeaderProps = {
  userId?: string;
};

export function Header({ userId }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Icons.logo className="h-6 w-6 text-primary" />
            <span className="hidden font-bold sm:inline-block">NoteSpace</span>
          </Link>
        </div>
        
        {userId && (
          <div className="flex-1">
             <div className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">Note Space:</span> {userId}
             </div>
          </div>
        )}

        <div className="flex flex-1 items-center justify-end space-x-2">
          <nav className="flex items-center">
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  );
}
