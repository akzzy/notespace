'use server';

import { revalidatePath } from 'next/cache';
import { cookies, headers } from 'next/headers';
import * as db from './db';
import { z } from 'zod';
import crypto from 'crypto';
import type { Note } from './types';


const NoteSchema = z.object({
  content: z.string().min(1).max(10000),
  userId: z.string(),
});

export async function addNoteAction(
  prevState: { message: string, note?: Note },
  formData: FormData
) {
  const validatedFields = NoteSchema.safeParse({
    content: formData.get('content'),
    userId: formData.get('userId'),
  });

  if (!validatedFields.success) {
    return { message: 'Failed to create note.' };
  }
  
  const { userId, content } = validatedFields.data;
  const ip = headers().get('x-forwarded-for') ?? '::1';

  try {
    // Check if this is the first note for this user
    const isFirstNote = !(await db.getCreatorIp(userId));

    const newNote = await db.addNote(userId, content, ip);

    // If it's the first note, set the creator token cookie
    if (isFirstNote && newNote.creatorToken) {
        const cookieStore = cookies();
        cookieStore.set(`notesspace-creator-token-${userId}`, newNote.creatorToken, {
            path: '/',
            maxAge: 60 * 60 * 24 * 365, // 1 year, to allow password setting later
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
        });
    }

    revalidatePath(`/${userId}`);
    revalidatePath(`/`);
    return { message: 'Added note.', note: newNote };
  } catch (e) {
    return { message: 'Failed to create note.' };
  }
}

export async function updateNoteAction(userId: string, noteId: string, content: string) {
    try {
        const result = await db.updateNote(userId, noteId, content);
        if(result) {
            revalidatePath(`/${userId}`);
            revalidatePath(`/`);
            return { ok: true, message: 'Note updated.' };
        }
        return { ok: false, message: 'Failed to find note to update.' };
    } catch (e) {
        return { ok: false, message: 'Failed to update note.' };
    }
}

export async function deleteNoteAction(userId: string, noteId: string) {
    try {
        const result = await db.deleteNote(userId, noteId);
        if (result) {
            revalidatePath(`/${userId}`);
            return { ok: true, message: 'Note deleted.' };
        }
        return { ok: false, message: 'Failed to find note to delete.'};
    } catch (e) {
        return { ok: false, message: 'Failed to delete note.' };
    }
}

const SetPasswordSchema = z.object({
    userId: z.string().length(4),
    password: z.string().min(2, 'Password must be at least 2 characters.'),
});

export async function setPasswordAction(prevState: { message: string, ok: boolean}, formData: FormData) {
    const validatedFields = SetPasswordSchema.safeParse({
        userId: formData.get('userId'),
        password: formData.get('password'),
    });

    if (!validatedFields.success) {
        return { message: validatedFields.error.errors.map(e => e.message).join(', '), ok: false };
    }

    const { userId, password } = validatedFields.data;

    // Security check: Only allow password setting if the user is the creator
    const cookieStore = cookies();
    const creatorToken = cookieStore.get(`notesspace-creator-token-${userId}`)?.value;
    const dbToken = await db.getCreatorToken(userId);

    if (!creatorToken || creatorToken !== dbToken) {
        return { message: "You don't have permission to set a password.", ok: false };
    }

    try {
        await db.setPassword(userId, password);
        // Set auth cookie after setting password
        cookieStore.set(`notesspace-auth-${userId}`, 'true', {
            path: '/',
            maxAge: 60 * 60 * 24 * 7, // 1 week
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
        });
        // Clear the creator token cookie as it's no longer needed
        cookieStore.delete(`notesspace-creator-token-${userId}`);
        
        revalidatePath(`/${userId}`);
        return { message: 'Password set successfully!', ok: true };
    } catch (e) {
        return { message: 'Failed to set password.', ok: false };
    }
}

const VerifyPasswordSchema = z.object({
    userId: z.string().length(4),
    password: z.string().min(1, 'Password cannot be empty.'),
});


export async function verifyPasswordAction(prevState: { message: string }, formData: FormData) {
    const validatedFields = VerifyPasswordSchema.safeParse({
        userId: formData.get('userId'),
        password: formData.get('password'),
    });

    if (!validatedFields.success) {
        return { message: "Invalid data." };
    }

    const { userId, password } = validatedFields.data;

    const isCorrect = await db.checkPassword(userId, password);

    if (isCorrect) {
        const cookieStore = cookies();
        cookieStore.set(`notesspace-auth-${userId}`, 'true', {
            path: '/',
            maxAge: 60 * 60 * 24 * 7, // 1 week
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
        });
        revalidatePath(`/${userId}`);
        return { message: "Success" };
    } else {
        return { message: "Incorrect password." };
    }
}

const DiscoverabilitySchema = z.object({
    userId: z.string().length(4),
    isDiscoverable: z.boolean(),
});

export async function setDiscoverabilityAction(prevState: { message: string, ok: boolean }, formData: FormData) {
    const isDiscoverable = formData.get('isDiscoverable') === 'true';
    const validatedFields = DiscoverabilitySchema.safeParse({
        userId: formData.get('userId'),
        isDiscoverable: isDiscoverable
    });
    
    if (!validatedFields.success) {
        return { message: "Invalid data.", ok: false };
    }

    const { userId } = validatedFields.data;

    try {
        await db.setDiscoverableByIp(userId, isDiscoverable);
        revalidatePath(`/`); // Revalidate home page
        return { message: `Discoverability ${isDiscoverable ? 'enabled' : 'disabled'}.`, ok: true };
    } catch (e) {
        return { message: 'Failed to update setting.', ok: false };
    }
}
