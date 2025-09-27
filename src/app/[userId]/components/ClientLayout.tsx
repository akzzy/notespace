'use client';

import { useEffect } from 'react';
import { Header } from '@/components/Header';

interface ClientLayoutProps {
  children: React.ReactNode;
  userId: string;
  isDiscoverable: boolean;
  showSetPassword?: boolean;
  notesCount?: number;
}

export default function ClientLayout({
  children,
  userId,
  isDiscoverable,
  showSetPassword,
  notesCount,
}: ClientLayoutProps) {
  
  useEffect(() => {
    if (userId && typeof userId === 'string' && userId !== 'undefined') {
      // Save the current notespace to a list of recent spaces
      try {
        const storedRecents = localStorage.getItem('recentNoteSpaces');
        let recents = storedRecents ? JSON.parse(storedRecents) : [];
        if (!Array.isArray(recents)) recents = [];

        // Filter out invalid entries and the current userId to avoid duplicates and put it at the top
        const cleanedRecents = recents.filter((id: any) => id && typeof id === 'string' && id !== 'undefined' && id !== userId);
        const updatedRecents = [userId, ...cleanedRecents].slice(0, 5); // Keep last 5
        
        localStorage.setItem('recentNoteSpaces', JSON.stringify(updatedRecents));

      } catch (error) {
        console.error("Could not update recent spaces in localStorage", error);
      }
    }
  }, [userId]);

  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <Header
        noteSpaceId={userId}
        isDiscoverable={isDiscoverable}
        showSetPassword={showSetPassword}
        notesCount={notesCount}
      />
      <main className="flex-1">{children}</main>
    </div>
  );
}
