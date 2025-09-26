import Link from 'next/link';
import { Icons } from '@/components/Icons';
import { ThemeToggle } from '@/components/ThemeToggle';
import { CopyButton } from '@/components/CopyButton';
import Settings from '@/app/[userId]/components/Settings';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from './ui/button';
import { Settings as SettingsIcon } from 'lucide-react';
import type { Note } from '@/lib/types';

type HeaderProps = {
  noteSpaceId?: string;
  isDiscoverable?: boolean;
  showSetPassword?: boolean;
  notesCount?: number;
};

export function Header({
  noteSpaceId,
  isDiscoverable,
  showSetPassword,
  notesCount,
}: HeaderProps) {
  const showSettings = notesCount && notesCount > 0;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center px-4 sm:px-6 lg:px-8">
        <div className="mr-4 flex flex-1 items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Icons.logo className="h-6 w-6 text-primary" />
            <span className="font-bold sm:inline-block">NoteSpace</span>
          </Link>
          {noteSpaceId && (
            <div className="flex items-center gap-2">
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
            {noteSpaceId && showSettings && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <SettingsIcon className="h-[1.2rem] w-[1.2rem]" />
                    <span className="sr-only">Settings</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuLabel>Settings</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="p-2">
                    <Settings
                      userId={noteSpaceId}
                      isDiscoverable={isDiscoverable!}
                      showSetPassword={showSetPassword}
                      isInDropdown={true}
                    />
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  );
}
