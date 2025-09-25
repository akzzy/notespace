'use server';

import { revalidatePath } from 'next/cache';
import { cookies, headers } from 'next/headers';
import * as db from './db';
import { z } from 'zod';

const NoteSchema = z.object({
  content: z.string().min(1).max(5000),
  userId: z.string(),
});

export async function addNoteAction(
  prevState: { message: string },
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
    await db.addNote(userId, content, ip);
    revalidatePath(`/${userId}`);
    revalidatePath(`/`);
    return { message: 'Added note.' };
  } catch (e) {
    return { message: 'Failed to create note.' };
  }
}

export async function updateNoteAction(userId: string, noteId: string, content: string) {
    const ip = headers().get('x-forwarded-for') ?? '::1';
    try {
        const result = await db.updateNote(userId, noteId, content, ip);
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

    try {
        await db.setPassword(userId, password);
        // Set auth cookie after setting password
        const cookieStore = cookies();
        cookieStore.set(`notesspace-auth-${userId}`, 'true', {
            path: '/',
            maxAge: 60 * 60 * 24 * 7, // 1 week
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
        });
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
