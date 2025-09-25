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
  if (!/^[A-Z0-9]{4}$/.test(userId)) {
    notFound();
  }

  const initialNotes = await getNotes(userId);

  return (
    <div className="container mx-auto max-w-3xl py-8">
       <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Note Space</h1>
        <p className="text-lg text-muted-foreground font-mono tracking-widest mt-1">{userId}</p>
      </div>
      <NoteSpace userId={userId} initialNotes={initialNotes} />
    </div>
  );
}
