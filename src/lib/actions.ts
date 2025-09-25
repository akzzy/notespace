'use server';

import { revalidatePath } from 'next/cache';
import * as db from './db';
import { z } from 'zod';

const NoteSchema = z.object({
  content: z.string().min(1).max(2000),
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

  try {
    await db.addNote(userId, content);
    revalidatePath(`/${userId}`);
    return { message: 'Added note.' };
  } catch (e) {
    return { message: 'Failed to create note.' };
  }
}

export async function updateNoteAction(userId: string, noteId: string, content: string) {
    try {
        const result = await db.updateNote(userId, noteId, content);
        if(result) {
            revalidatePath(`/${userId}`);
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
