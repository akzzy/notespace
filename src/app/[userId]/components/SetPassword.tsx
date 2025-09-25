'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { KeyRound, Loader2 } from 'lucide-react';
import { setPasswordAction } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useEffect } from 'react';

interface SetPasswordProps {
    userId: string;
}

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending}>
            {pending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
                <KeyRound className="mr-2 h-4 w-4" />
            )}
            Set Password
        </Button>
    );
}

export default function SetPassword({ userId }: SetPasswordProps) {
    const [state, formAction] = useActionState(setPasswordAction, { message: '', ok: false });
    const { toast } = useToast();

    useEffect(() => {
        if (state.message) {
            toast({
                title: state.ok ? 'Success' : 'Error',
                description: state.message,
                variant: state.ok ? 'default' : 'destructive',
            });
        }
    }, [state, toast]);
    
    // Don't render the form if the password was just set successfully
    if (state.ok) {
        return null;
    }

    return (
        <Card className="mb-6">
            <CardHeader>
                <CardTitle>Secure Your NoteSpace</CardTitle>
                <CardDescription>Add a password to protect your notes. You will be asked for it on your next visit.</CardDescription>
            </CardHeader>
            <CardContent>
                <form action={formAction} className="flex items-end gap-4">
                    <input type="hidden" name="userId" value={userId} />
                    <div className="flex-1 space-y-2">
                        <Label htmlFor="set-password">New Password (min. 2 characters)</Label>
                        <Input id="set-password" name="password" type="password" required />
                    </div>
                    <SubmitButton />
                </form>
                {state?.message && !state.ok && (
                    <p className="mt-2 text-sm text-destructive">{state.message}</p>
                )}
            </CardContent>
        </Card>
    );
}
