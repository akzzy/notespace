import { db } from './firebase';
import { collection, query, where, getDocs, addDoc, doc, updateDoc, deleteDoc, orderBy, limit, serverTimestamp, getDoc, setDoc } from "firebase/firestore";
import type { Note } from './types';
import crypto from 'crypto';

// Simulate network latency
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

const hashPassword = (password: string) => {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return `${salt}:${hash}`;
}

const verifyPassword = (password: string, storedHash: string) => {
    try {
        const [salt, hash] = storedHash.split(':');
        if (!salt || !hash) return false;
        const hashToVerify = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
        return hash === hashToVerify;
    } catch (e) {
        console.error("Error verifying password:", e);
        return false;
    }
}

export async function getNotes(userId: string): Promise<Note[]> {
  await delay(300);
  const notesCol = collection(db, `users/${userId}/notes`);
  const q = query(notesCol, orderBy("createdAt", "desc"));
  const notesSnapshot = await getDocs(q);
  const notesList = notesSnapshot.docs.map(doc => {
    const data = doc.data();
    return {
        id: doc.id,
        userId: userId,
        content: data.content,
        // Convert Firestore Timestamp to ISO string
        createdAt: data.createdAt?.toDate().toISOString() || new Date().toISOString(),
        updatedAt: data.updatedAt?.toDate().toISOString() || new Date().toISOString(),
    } as Note;
  });
  return notesList;
}

export async function addNote(userId: string, content: string, ip?: string): Promise<Note> {
  await delay(300);
  
  const userDocRef = doc(db, "users", userId);
  const userDocSnap = await getDoc(userDocRef);

  if (!userDocSnap.exists() && ip) {
      await setDoc(userDocRef, { 
          ip: ip,
          isDiscoverable: false,
          createdAt: serverTimestamp()
      });
  } else if (ip) {
      await updateDoc(userDocRef, { ip: ip });
  }

  const notesCol = collection(db, `users/${userId}/notes`);
  const newNoteRef = await addDoc(notesCol, {
    content: content,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return {
    id: newNoteRef.id,
    userId,
    content,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export async function updateNote(userId: string, noteId: string, content: string, ip?: string): Promise<Note | null> {
  await delay(300);
  const noteRef = doc(db, `users/${userId}/notes`, noteId);
  const noteSnap = await getDoc(noteRef);

  if (!noteSnap.exists()) return null;

  if (ip) {
    const userDocRef = doc(db, "users", userId);
    await updateDoc(userDocRef, { ip: ip });
  }

  await updateDoc(noteRef, {
    content: content,
    updatedAt: serverTimestamp(),
  });
  
  const updatedNoteData = noteSnap.data();

  return {
    id: noteId,
    userId,
    content,
    createdAt: updatedNoteData.createdAt?.toDate().toISOString() || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export async function deleteNote(userId: string, noteId: string): Promise<{ id: string } | null> {
  await delay(300);
  const noteRef = doc(db, `users/${userId}/notes`, noteId);
  const noteSnap = await getDoc(noteRef);
  
  if (!noteSnap.exists()) return null;

  await deleteDoc(noteRef);
  return { id: noteId };
}


export async function setPassword(userId: string, password: string): Promise<boolean> {
    await delay(200);
    const userDocRef = doc(db, "users", userId);
    try {
        await updateDoc(userDocRef, {
            passwordHash: hashPassword(password)
        });
        return true;
    } catch (e) {
        // If the doc doesn't exist, create it
        await setDoc(userDocRef, {
            passwordHash: hashPassword(password),
            createdAt: serverTimestamp()
        });
        return true;
    }
}

export async function getPasswordHash(userId: string): Promise<string | null> {
    await delay(100);
    const userDocRef = doc(db, "users", userId);
    const docSnap = await getDoc(userDocRef);
    if (docSnap.exists()) {
        return docSnap.data().passwordHash || null;
    }
    return null;
}

export async function checkPassword(userId: string, password: string): Promise<boolean> {
    await delay(200);
    const hash = await getPasswordHash(userId);
    if (!hash) return false;
    return verifyPassword(password, hash);
}

export async function getNoteSpacesByIp(ip: string): Promise<string[]> {
    await delay(100);
    const usersCol = collection(db, "users");
    const q = query(usersCol, where("ip", "==", ip), where("isDiscoverable", "==", true));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.id);
}

export async function setDiscoverableByIp(userId: string, isDiscoverable: boolean): Promise<boolean> {
    await delay(100);
    const userDocRef = doc(db, "users", userId);
    try {
        await updateDoc(userDocRef, { isDiscoverable });
        return true;
    } catch (e) {
        // This might fail if the doc doesn't exist yet, which is fine.
        console.error("Could not set discoverability:", e);
        return false;
    }
}

export async function getDiscoverableByIp(userId: string): Promise<boolean> {
    await delay(50);
    const userDocRef = doc(db, "users", userId);
    const docSnap = await getDoc(userDocRef);
    if (docSnap.exists()) {
        return docSnap.data().isDiscoverable ?? false;
    }
    return false;
}
