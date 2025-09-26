import { getNotes, getPasswordHash, getDiscoverableByIp, getCreatorToken } from '@/lib/db';
import NoteSpace from './components/NoteSpace';
import { notFound } from 'next/navigation';
import { cookies, headers } from 'next/headers';
import PasswordProtect from './components/PasswordProtect';
import Settings from './components/Settings';

interface NoteSpacePageProps {
  params: {
    userId: string;
  };
}

export default async function NoteSpacePage({ params }: NoteSpacePageProps) {
  const { userId } = params;
  const cookieStore = cookies();

  // Validation for new user ID format (e.g., AB12)
  if (!/^[A-Z]{2}[0-9]{2}$/.test(userId)) {
    notFound();
  }
  
  const passwordHash = await getPasswordHash(userId);
  const isAuthenticated = cookieStore.get(`notesspace-auth-${userId}`)?.value === 'true';

  if (passwordHash && !isAuthenticated) {
    return (
        <div className="mx-auto max-w-sm px-4 sm:px-6 lg:px-8 py-8">
            <PasswordProtect userId={userId} />
        </div>
    );
  }

  const initialNotes = await getNotes(userId);
  const isDiscoverable = await getDiscoverableByIp(userId);

  // Logic to determine if the current user is the creator
  const creatorTokenFromCookie = cookieStore.get(`notesspace-creator-token-${userId}`)?.value;
  const creatorTokenFromDb = await getCreatorToken(userId);
  const isCreator = !!creatorTokenFromCookie && creatorTokenFromCookie === creatorTokenFromDb;

  // The "Set Password" form should only show if:
  // 1. No password is set.
  // 2. There's at least one note.
  // 3. The current visitor is the creator (verified by token).
  const showSetPassword = !passwordHash && initialNotes.length > 0 && isCreator;
  
  // Show settings if the user is authenticated (or no password is set) and there are notes
  const showSettings = (!passwordHash || isAuthenticated) && initialNotes.length > 0;

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8">
      {showSettings && <Settings userId={userId} isDiscoverable={isDiscoverable} showSetPassword={showSetPassword} />}
      <NoteSpace userId={userId} initialNotes={initialNotes} />
    </div>
  );
}
