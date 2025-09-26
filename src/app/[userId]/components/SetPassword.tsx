'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { KeyRound, Loader2 } from 'lucide-react';
import { setPasswordAction } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useEffect } from 'react';

interface SetPasswordProps {
    userId: string;
}

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending} size="sm">
            {pending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
                <KeyRound className="mr-2 h-4 w-4" />
            )}
            Set
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
        <div className="border-t p-4">
             <form action={formAction} className="flex items-end justify-between gap-4">
                <input type="hidden" name="userId" value={userId} />
                <div className="flex-1 space-y-2">
                    <Label htmlFor="set-password" className="text-sm font-medium">Set a Password</Label>
                    <p className="text-xs text-muted-foreground">Protect this NoteSpace. (min. 2 characters)</p>
                    <Input id="set-password" name="password" type="password" required className="h-9"/>
                     {state?.message && !state.ok && (
                        <p className="mt-2 text-sm text-destructive">{state.message}</p>
                    )}
                </div>
                <SubmitButton />
            </form>
        </div>
    );
}
