import { getNotes, getPasswordHash } from '@/lib/db';
import NoteSpace from './components/NoteSpace';
import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import PasswordProtect from './components/PasswordProtect';
import SetPassword from './components/SetPassword';

interface NoteSpacePageProps {
  params: {
    userId: string;
  };
}

export default async function NoteSpacePage({ params }: NoteSpacePageProps) {
  const { userId } = params;

  // Basic validation for user ID format
  if (!/^[A-Z0-9]{4}$/.test(userId)) {
    notFound();
  }

  const passwordHash = await getPasswordHash(userId);
  const cookieStore = cookies();
  const isAuthenticated = cookieStore.get(`notesspace-auth-${userId}`)?.value === 'true';

  if (passwordHash && !isAuthenticated) {
    return (
        <div className="mx-auto max-w-sm px-4 sm:px-6 lg:px-8 py-8">
            <PasswordProtect userId={userId} />
        </div>
    );
  }

  const initialNotes = await getNotes(userId);

  const showSetPassword = !passwordHash && initialNotes.length > 0;

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8">
      {showSetPassword && <SetPassword userId={userId} />}
      <NoteSpace userId={userId} initialNotes={initialNotes} />
    </div>
  );
}
