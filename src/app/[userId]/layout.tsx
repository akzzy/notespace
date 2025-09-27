import React from 'react';
import { getDiscoverableByIp, getNotes, getPasswordHash, getCreatorToken } from '@/lib/db';
import { cookies } from 'next/headers';
import ClientLayout from './components/ClientLayout';

interface NoteSpaceLayoutProps {
  children: React.ReactNode;
  params: {
    userId: string;
  };
}

export default async function NoteSpaceLayoutWrapper({
  children,
  params: { userId },
}: NoteSpaceLayoutProps) {
  // Validation for new user ID format (e.g., AB12)
  if (!/^[A-Z]{2}[0-9]{2}$/.test(userId)) {
    return <>{children}</>;
  }

  const cookieStore = cookies();
  const passwordHash = await getPasswordHash(userId);
  const initialNotes = await getNotes(userId);

  const creatorTokenFromCookie = cookieStore.get(`notesspace-creator-token-${userId}`)?.value;
  const creatorTokenFromDb = await getCreatorToken(userId);
  const isCreator = !!creatorTokenFromCookie && creatorTokenFromCookie === creatorTokenFromDb;

  const showSetPassword = !passwordHash && initialNotes.length > 0 && isCreator;
  const isDiscoverable = await getDiscoverableByIp(userId);

  return (
    <ClientLayout
      userId={userId}
      isDiscoverable={isDiscoverable}
      showSetPassword={showSetPassword}
      notesCount={initialNotes.length}
    >
      {children}
    </ClientLayout>
  );
}