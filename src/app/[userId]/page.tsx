import { getNotes, getPasswordHash, getCreatorToken } from '@/lib/db';
import NoteSpace from './components/NoteSpace';
import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import PasswordProtect from './components/PasswordProtect';
import SetPasswordCard from './components/SetPasswordCard';

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

  // Logic to determine if the current user is the creator for the SetPasswordCard
  const creatorTokenFromCookie = cookieStore.get(`notesspace-creator-token-${userId}`)?.value;
  const creatorTokenFromDb = await getCreatorToken(userId);
  const isCreator = !!creatorTokenFromCookie && creatorTokenFromCookie === creatorTokenFromDb;
  const showSetPasswordCard = !passwordHash && initialNotes.length > 0 && initialNotes.length <= 2 && isCreator;


  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {showSetPasswordCard && <SetPasswordCard userId={userId} />}
      <NoteSpace userId={userId} initialNotes={initialNotes} />
    </div>
  );
}
