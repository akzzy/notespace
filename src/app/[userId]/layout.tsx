import { Header } from '@/components/Header';
import { getDiscoverableByIp, getNotes, getPasswordHash, getCreatorToken } from '@/lib/db';
import { cookies } from 'next/headers';

interface NoteSpaceLayoutProps {
  children: React.ReactNode;
  params: {
    userId: string;
  };
}

export default async function NoteSpaceLayout({
  children,
  params,
}: NoteSpaceLayoutProps) {
  const { userId } = params;
  const cookieStore = cookies();
  const passwordHash = await getPasswordHash(userId);
  const initialNotes = await getNotes(userId);

  // Logic to determine if the current user is the creator
  const creatorTokenFromCookie = cookieStore.get(`notesspace-creator-token-${userId}`)?.value;
  const creatorTokenFromDb = await getCreatorToken(userId);
  const isCreator = !!creatorTokenFromCookie && creatorTokenFromCookie === creatorTokenFromDb;

  // The "Set Password" form should only show if:
  // 1. No password is set.
  // 2. There's at least one note.
  // 3. The current visitor is the creator (verified by token).
  const showSetPassword = !passwordHash && initialNotes.length > 0 && isCreator;
  const isDiscoverable = await getDiscoverableByIp(userId);

  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <Header
        noteSpaceId={params.userId}
        isDiscoverable={isDiscoverable}
        showSetPassword={showSetPassword}
        notesCount={initialNotes.length}
      />
      <main className="flex-1">{children}</main>
    </div>
  );
}
