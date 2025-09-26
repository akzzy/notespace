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

const passwordStore: Record<string, string> = {}; // userId -> hashedPassword
const ipStore: Record<string, string> = { "123456": "::1" }; // userId -> ip address
const discoverabilityStore: Record<string, boolean> = { "123456": true }; // userId -> isDiscoverableByIp

// Simulate network latency
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

const hashPassword = (password: string) => {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return `${salt}:${hash}`;
}

const verifyPassword = (password: string, storedHash: string) => {
    const [salt, hash] = storedHash.split(':');
    const hashToVerify = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return hash === hashToVerify;
}

export async function getNotes(userId: string): Promise<Note[]> {
  await delay(300);
  const userNotes = notesStore[userId] || [];
  return userNotes.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function addNote(userId: string, content: string, ip?: string): Promise<Note> {
  await delay(300);
  if (!notesStore[userId]) {
    notesStore[userId] = [];
    discoverabilityStore[userId] = false; // Default to not discoverable
  }
  if (ip) {
    ipStore[userId] = ip;
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

export async function updateNote(userId: string, noteId: string, content: string, ip?: string): Promise<Note | null> {
  await delay(300);
  const userNotes = notesStore[userId];
  if (!userNotes) return null;

  const noteIndex = userNotes.findIndex(note => note.id === noteId);
  if (noteIndex === -1) return null;
  
  if (ip) {
    ipStore[userId] = ip;
  }

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


export async function setPassword(userId: string, password: string): Promise<boolean> {
    await delay(200);
    if (!notesStore[userId] && userId !== '123456') { // Allow setting password for new spaces
        notesStore[userId] = [];
    }
    passwordStore[userId] = hashPassword(password);
    return true;
}

export async function getPasswordHash(userId: string): Promise<string | null> {
    await delay(100);
    return passwordStore[userId] || null;
}

export async function checkPassword(userId: string, password: string): Promise<boolean> {
    await delay(200);
    const hash = await getPasswordHash(userId);
    if (!hash) return false; // Should not happen if this function is called correctly
    return verifyPassword(password, hash);
}

export async function getNoteSpacesByIp(ip: string): Promise<string[]> {
    await delay(100);
    const userIds = Object.entries(ipStore)
        .filter(([, storedIp]) => storedIp === ip)
        .map(([userId]) => userId)
        .filter(userId => discoverabilityStore[userId]); // Only return discoverable spaces
    return userIds;
}

export async function setDiscoverableByIp(userId: string, isDiscoverable: boolean): Promise<boolean> {
    await delay(100);
    if (notesStore[userId]) {
        discoverabilityStore[userId] = isDiscoverable;
        return true;
    }
    return false;
}

export async function getDiscoverableByIp(userId: string): Promise<boolean> {
    await delay(50);
    return discoverabilityStore[userId] ?? false;
}
