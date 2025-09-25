import { getNotes } from '@/lib/db';
import NoteSpace from './components/NoteSpace';
import { notFound } from 'next/navigation';

interface NoteSpacePageProps {
  params: {
    userId: string;
  };
}

export default async function NoteSpacePage({ params }: NoteSpacePageProps) {
  const { userId } = params;

  // Basic validation for user ID format
  if (!/^\d{6}$/.test(userId)) {
    notFound();
  }

  const initialNotes = await getNotes(userId);

  return (
    <div className="container mx-auto max-w-3xl py-8">
      <NoteSpace userId={userId} initialNotes={initialNotes} />
    </div>
  );
}
