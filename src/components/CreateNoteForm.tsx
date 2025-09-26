'use client';

import { useTransition, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, PlusCircle } from 'lucide-react';
import { TypeAnimation } from 'react-type-animation';
import { useToast } from '@/hooks/use-toast';
import { addNoteAction } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';

const CreateNoteSchema = z.object({
  content: z.string().min(1, { message: 'Note cannot be empty.' }).max(10000, { message: 'Note is too long.' }),
});

type CreateNoteFormData = z.infer<typeof CreateNoteSchema>;

export function CreateNoteForm() {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const router = useRouter();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const form = useForm<CreateNoteFormData>({
    resolver: zodResolver(CreateNoteSchema),
    defaultValues: {
      content: '',
    },
  });

  const handleTextareaInput = (el: HTMLTextAreaElement) => {
    const maxScreenHeight = window.innerHeight * 0.5;
    el.style.height = 'auto';
    const newHeight = Math.min(el.scrollHeight, maxScreenHeight);
    el.style.height = `${newHeight}px`;

    if (el.scrollHeight > maxScreenHeight) {
      el.style.overflowY = 'auto';
    } else {
      el.style.overflowY = 'hidden';
    }
  };

  const onSubmit: SubmitHandler<CreateNoteFormData> = (data) => {
    const userId = Math.random().toString(36).substring(2, 6).toUpperCase();
    const formData = new FormData();
    formData.append('content', data.content);
    formData.append('userId', userId);

    startTransition(async () => {
      const result = await addNoteAction({ message: '' }, formData);

      if (result?.message === 'Added note.') {
        router.push(`/${userId}`);
      } else {
        toast({
          title: 'Error',
          description: 'Failed to create NoteSpace. Please try again.',
          variant: 'destructive',
        });
      }
    });
  };

  const isFormEmpty = !form.watch('content');

  return (
    <Card className="shadow-2xl">
      <CardContent className="p-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      {isFormEmpty && (
                          <div className="absolute top-4 left-4 text-base text-muted-foreground pointer-events-none">
                            <TypeAnimation
                              sequence={[
                                'I want to build an AI tutor for kids...',
                                2000,
                                'I want to...',
                                1000,
                                'I want to build an AI tutor for kids...',
                                5000,
                              ]}
                              wrapper="span"
                              cursor={true}
                              repeat={Infinity}
                            />
                          </div>
                        )}
                      <Textarea
                        ref={textareaRef}
                        placeholder=""
                        className="resize-none border-0 shadow-none focus-visible:ring-0 overflow-y-hidden min-h-[80px] text-base bg-transparent"
                        {...field}
                        onInput={(e) => {
                          field.onChange(e);
                          handleTextareaInput(e.currentTarget);
                        }}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end">
              <Button type="submit" disabled={isPending} size="lg">
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create NoteSpace
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
