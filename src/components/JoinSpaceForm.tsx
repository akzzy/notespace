'use client';

import { useRouter } from 'next/navigation';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState, useTransition } from 'react';
import { LogIn, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const JoinSpaceSchema = z.object({
  userId: z
    .string()
    .length(4, { message: 'Code must be exactly 4 characters.' })
    .regex(/^[A-Z0-9]{4}$/, {
      message: 'Code must be 4 uppercase letters or numbers.',
    })
    .transform((val) => val.toUpperCase()),
});

type JoinSpaceFormData = z.infer<typeof JoinSpaceSchema>;

export function JoinSpaceForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<JoinSpaceFormData>({
    resolver: zodResolver(JoinSpaceSchema),
    defaultValues: {
      userId: '',
    },
  });

  const onSubmit: SubmitHandler<JoinSpaceFormData> = (data) => {
    startTransition(() => {
      router.push(`/${data.userId}`);
    });
  };

  return (
    <Card>
        <CardHeader className="text-center">
            <CardTitle>Join a Note Space</CardTitle>
            <CardDescription>Enter your 4-character code below.</CardDescription>
        </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-start gap-2">
            <FormField
              control={form.control}
              name="userId"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input
                      placeholder="e.g. 1A2B"
                      autoComplete="off"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                      className="h-11 text-center text-lg tracking-widest font-mono"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isPending} size="lg" className="h-11">
              {isPending ? (
                <Loader2 className="animate-spin" />
              ) : (
                <LogIn />
              )}
               <span className="sr-only">Join Space</span>
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
