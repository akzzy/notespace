'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { LogIn, Loader2 } from 'lucide-react';
import { verifyPasswordAction } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

interface PasswordProtectProps {
    userId: string;
}

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending} className="w-full">
            {pending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
                <LogIn className="mr-2 h-4 w-4" />
            )}
            Unlock
        </Button>
    );
}

export default function PasswordProtect({ userId }: PasswordProtectProps) {
    const [state, formAction] = useActionState(verifyPasswordAction, { message: '' });

    return (
        <Card>
            <CardHeader>
                <CardTitle>Password Protected</CardTitle>
                <CardDescription>This NoteSpace is password protected. Please enter the password to continue.</CardDescription>
            </CardHeader>
            <CardContent>
                <form action={formAction} className="space-y-4">
                    <input type="hidden" name="userId" value={userId} />
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" name="password" type="password" required />
                    </div>
                    {state?.message && state.message !== "Success" && (
                        <p className="text-sm text-destructive">{state.message}</p>
                    )}
                    <SubmitButton />
                </form>
            </CardContent>
        </Card>
    );
}
