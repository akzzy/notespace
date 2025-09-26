'use client';

import { useTransition, useRef, useState } from 'react';
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

const generateUserId = () => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const part1 = letters.charAt(Math.floor(Math.random() * letters.length));
  const part2 = letters.charAt(Math.floor(Math.random() * letters.length));
  const part3 = numbers.charAt(Math.floor(Math.random() * numbers.length));
  const part4 = numbers.charAt(Math.floor(Math.random() * numbers.length));
  return `${part1}${part2}${part3}${part4}`;
}


export function CreateNoteForm() {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const router = useRouter();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isFocused, setIsFocused] = useState(false);


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
    const userId = generateUserId();
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
  const showAnimation = isFormEmpty && !isFocused;

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
                      {showAnimation && (
                          <div className="absolute top-3 left-4 text-base text-muted-foreground pointer-events-none">
                            <TypeAnimation
                              sequence={[
                                'I should build an AI tutor for kids...',
                                2000,
                                'My shopping list: milk, bread, and eggs.',
                                2000,
                                'A great idea for a new app...',
                                2000,
                                'Finish the presentation for tomorrow\'s meeting.',
                                2000,
                                'Remember to call Mom back.',
                                2000,
                              ]}
                              wrapper="span"
                              cursor={true}
                              repeat={Infinity}
                              style={{ verticalAlign: 'middle', height: '24px', display: 'inline-block' }}
                            />
                          </div>
                        )}
                      <Textarea
                        ref={textareaRef}
                        placeholder=""
                        className="resize-none border-0 shadow-none focus-visible:ring-0 overflow-y-hidden min-h-[120px] text-base bg-transparent pt-3"
                        {...field}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
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
