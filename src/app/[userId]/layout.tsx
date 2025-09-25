import { Header } from '@/components/Header';

interface NoteSpaceLayoutProps {
  children: React.ReactNode;
}

export default function NoteSpaceLayout({ children }: NoteSpaceLayoutProps) {
  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">{children}</main>
    </div>
  );
}
