'use client';

import { useState, useEffect, useTransition } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Pencil, Trash2, CheckCircle, Loader2, AlertTriangle, Save, Copy, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useDebounce } from '@/hooks/use-debounce';

import type { Note } from '@/lib/types';
import { deleteNoteAction, updateNoteAction } from '@/lib/actions';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface NoteItemProps {
  note: Note;
  onDelete: (noteId: string) => void;
  onUpdate: (note: Note) => void;
}

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

export default function NoteItem({ note, onDelete, onUpdate }: NoteItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(note.content);
  const debouncedContent = useDebounce(content, 1500);
  const [isDeletePending, startDeleteTransition] = useTransition();
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const { toast } = useToast();
  const [isCopied, setIsCopied] = useState(false);


  const handleUpdate = async () => {
    if (debouncedContent === note.content) return;
    setSaveStatus('saving');
    const result = await updateNoteAction(note.userId, note.id, debouncedContent);
    if (result.ok && result.message) {
      setSaveStatus('saved');
      onUpdate({ ...note, content: debouncedContent, updatedAt: new Date().toISOString() });
      setTimeout(() => setSaveStatus('idle'), 2000);
    } else {
      setSaveStatus('error');
      toast({
        title: 'Update Failed',
        description: result.message,
        variant: 'destructive',
      });
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  useEffect(() => {
    if (isEditing && debouncedContent !== note.content) {
      handleUpdate();
    }
  }, [debouncedContent]);

  const handleDelete = () => {
    startDeleteTransition(async () => {
      onDelete(note.id); // Optimistic delete
      const result = await deleteNoteAction(note.userId, note.id);
      if (!result.ok) {
        toast({
          title: 'Error',
          description: 'Failed to delete note. Please try again.',
          variant: 'destructive',
        });
        // Revert is handled by parent refetching, but for a pure client-side revert:
        // onRevertDelete(note); 
      } else {
        toast({
            title: 'Success',
            description: 'Note deleted.',
          });
      }
    });
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(note.content);
      setIsCopied(true);
      toast({
        title: 'Copied!',
        description: 'Note content has been copied to your clipboard.',
      });
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to copy note content.',
        variant: 'destructive',
      });
    }
  };

  const getStatusIndicator = () => {
    switch (saveStatus) {
      case 'saving':
        return <span className="flex items-center text-xs text-muted-foreground"><Loader2 className="mr-1 h-3 w-3 animate-spin" /> Saving...</span>;
      case 'saved':
        return <span className="flex items-center text-xs text-green-600"><CheckCircle className="mr-1 h-3 w-3" /> Saved</span>;
      case 'error':
        return <span className="flex items-center text-xs text-destructive"><AlertTriangle className="mr-1 h-3 w-3" /> Error</span>;
      default:
        return <span className="text-xs text-muted-foreground">Last updated {formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}</span>;
    }
  };

  return (
    <Card className={note.id.startsWith('temp-') ? 'opacity-60' : ''}>
      <CardContent className="p-4 whitespace-pre-wrap">
        {isEditing ? (
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full min-h-[100px] resize-none"
            autoFocus
          />
        ) : (
          <p className="min-h-[100px]">{note.content}</p>
        )}
      </CardContent>
      <CardFooter className="flex justify-between items-center p-4 pt-0">
        <div>{getStatusIndicator()}</div>
        <div className="flex gap-2">
          {isEditing ? (
             <Button variant="outline" size="sm" onClick={() => { handleUpdate(); setIsEditing(false);}}>
                <Save className="h-4 w-4 mr-2"/>
                Save &amp; Close
            </Button>
          ) : (
            <>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleCopy}>
                {isCopied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                <span className="sr-only">Copy content</span>
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsEditing(true)}>
                <Pencil className="h-4 w-4" />
                <span className="sr-only">Edit</span>
              </Button>
            </>
          )}

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete this note.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  disabled={isDeletePending}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {isDeletePending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardFooter>
    </Card>
  );
}
