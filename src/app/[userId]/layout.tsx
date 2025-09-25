import { Header } from '@/components/Header';

interface NoteSpaceLayoutProps {
  children: React.ReactNode;
  params: {
    userId: string;
  };
}

export default function NoteSpaceLayout({
  children,
  params,
}: NoteSpaceLayoutProps) {
  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <Header noteSpaceId={params.userId} />
      <main className="flex-1">{children}</main>
    </div>
  );
}
