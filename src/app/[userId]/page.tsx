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

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8">
      <NoteSpace userId={userId} initialNotes={initialNotes} />
    </div>
  );
}
