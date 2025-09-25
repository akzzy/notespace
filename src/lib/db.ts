import type { Note } from './types';
import crypto from 'crypto';

// In-memory store to simulate a database
const notesStore: Record<string, Note[]> = {
    "123456": [
        {
            id: crypto.randomUUID(),
            userId: "123456",
            content: "Welcome to your new NoteSpace! ✨\n\n- You can edit this note.\n- You can delete this note.\n- Create new notes using the form above.",
            createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
            updatedAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
        },
        {
            id: crypto.randomUUID(),
            userId: "123456",
            content: "This is a second note to demonstrate the list view.",
            createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
            updatedAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
        }
    ]
};

// Simulate network latency
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export async function getNotes(userId: string): Promise<Note[]> {
  await delay(300);
  const userNotes = notesStore[userId] || [];
  return userNotes.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function addNote(userId: string, content: string): Promise<Note> {
  await delay(300);
  if (!notesStore[userId]) {
    notesStore[userId] = [];
  }
  const newNote: Note = {
    id: crypto.randomUUID(),
    userId,
    content,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  notesStore[userId].unshift(newNote);
  return newNote;
}

export async function updateNote(userId: string, noteId: string, content: string): Promise<Note | null> {
  await delay(300);
  const userNotes = notesStore[userId];
  if (!userNotes) return null;

  const noteIndex = userNotes.findIndex(note => note.id === noteId);
  if (noteIndex === -1) return null;

  const updatedNote = {
    ...userNotes[noteIndex],
    content,
    updatedAt: new Date().toISOString(),
  };
  userNotes[noteIndex] = updatedNote;
  return updatedNote;
}

export async function deleteNote(userId: string, noteId: string): Promise<{ id: string } | null> {
  await delay(300);
  const userNotes = notesStore[userId];
  if (!userNotes) return null;
  
  const initialLength = userNotes.length;
  notesStore[userId] = userNotes.filter(note => note.id !== noteId);

  if (notesStore[userId].length < initialLength) {
    return { id: noteId };
  }
  return null;
}
