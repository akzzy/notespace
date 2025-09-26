import Link from 'next/link';
import { Icons } from '@/components/Icons';
import { ThemeToggle } from '@/components/ThemeToggle';
import { CopyButton } from '@/components/CopyButton';

type HeaderProps = {
  noteSpaceId?: string;
};

export function Header({ noteSpaceId }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center px-4 sm:px-6 lg:px-8">
        <div className="mr-4 flex flex-1 items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Icons.logo className="h-6 w-6 text-primary" />
            <span className="font-bold sm:inline-block">NoteSpace</span>
          </Link>
          {noteSpaceId && (
            <div className="hidden items-center gap-2 md:flex">
              <span className="text-sm text-muted-foreground">/</span>
              <span className="font-mono text-xl font-bold tracking-widest text-foreground">
                {noteSpaceId}
              </span>
              <CopyButton textToCopy={noteSpaceId} />
            </div>
          )}
        </div>

        <div className="flex flex-none items-center justify-end space-x-2">
          <nav className="flex items-center">
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  );
}
