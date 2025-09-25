'use client';

import { useState, useTransition, useRef, useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, PlusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

import type { Note } from '@/lib/types';
import { addNoteAction } from '@/lib/actions';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import NoteItem from './NoteItem';

const NoteSchema = z.object({
  content: z
    .string()
    .min(1, { message: 'Note cannot be empty.' })
    .max(5000, { message: 'Note must be 5000 characters or less.' }),
});

type NoteFormData = z.infer<typeof NoteSchema>;

interface NoteSpaceProps {
  userId: string;
  initialNotes: Note[];
}

export default function NoteSpace({ userId, initialNotes }: NoteSpaceProps) {
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const form = useForm<NoteFormData>({
    resolver: zodResolver(NoteSchema),
    defaultValues: {
      content: '',
    },
  });
  
  const handleTextareaInput = (el: HTMLTextAreaElement) => {
    const maxScreenHeight = window.innerHeight * 0.75;
    el.style.height = 'auto';
    const newHeight = Math.min(el.scrollHeight, maxScreenHeight);
    el.style.height = `${newHeight}px`;

    if (el.scrollHeight > maxScreenHeight) {
      el.style.overflowY = 'auto';
    } else {
      el.style.overflowY = 'hidden';
    }
  };

  const onSubmit: SubmitHandler<NoteFormData> = (data) => {
    const formData = new FormData();
    formData.append('content', data.content);
    formData.append('userId', userId);
    
    startTransition(async () => {
        // Optimistic update
        const tempId = `temp-${Date.now()}`;
        const newNote: Note = {
            id: tempId,
            userId,
            content: data.content,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        setNotes(prev => [newNote, ...prev]);
        form.reset();
        
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.overflowY = 'hidden';
        }

        const result = await addNoteAction({ message: '' }, formData);
        
        if (result?.message !== 'Added note.') {
            toast({
                title: 'Error',
                description: 'Failed to save note. Please try again.',
                variant: 'destructive',
            });
            // Revert optimistic update
            setNotes(prev => prev.filter(n => n.id !== tempId));
        }
    });
  };

  const handleOptimisticDelete = (noteId: string) => {
    setNotes(prev => prev.filter(note => note.id !== noteId));
  };
  
  const handleOptimisticUpdate = (updatedNote: Note) => {
    setNotes(prev => prev.map(note => note.id === updatedNote.id ? updatedNote : note));
  }


  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-4">
          <Form {...form}>
            <form
              ref={formRef}
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        ref={textareaRef}
                        placeholder="Type your new note here..."
                        className="resize-none border-0 shadow-none focus-visible:ring-0 overflow-y-hidden"
                        {...field}
                        onInput={(e) => {
                            field.onChange(e);
                            handleTextareaInput(e.currentTarget);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end">
                <Button type="submit" disabled={isPending}>
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                     <PlusCircle className="mr-2 h-4 w-4" />
                     Add Note
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {notes.length > 0 ? (
          notes.map((note) => (
            <NoteItem
              key={note.id}
              note={note}
              onDelete={handleOptimisticDelete}
              onUpdate={handleOptimisticUpdate}
            />
          ))
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-lg">No notes yet.</p>
            <p>Your added notes will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
