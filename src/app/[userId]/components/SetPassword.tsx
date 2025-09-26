'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { KeyRound, Loader2 } from 'lucide-react';
import { setPasswordAction } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';

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
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (state.message) {
            toast({
                title: state.ok ? 'Success' : 'Error',
                description: state.message,
                variant: state.ok ? 'default' : 'destructive',
            });
            if (state.ok) {
                setIsOpen(false);
            }
        }
    }, [state, toast]);
    
    // Don't render the button if the password was just set successfully
    if (state.ok) {
        return null;
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                 <Button variant="outline" className="w-full justify-start">
                    <KeyRound className="mr-2 h-4 w-4" />
                    Set a Password
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Set a Password</DialogTitle>
                    <DialogDescription>
                        Protect this NoteSpace from unauthorized access. Choose a password with at least 2 characters.
                    </DialogDescription>
                </DialogHeader>
                 <form action={formAction} className="space-y-4">
                    <input type="hidden" name="userId" value={userId} />
                    <div className="space-y-2">
                        <Label htmlFor="set-password">Password</Label>
                        <Input id="set-password" name="password" type="password" required autoFocus/>
                         {state?.message && !state.ok && (
                            <p className="mt-2 text-sm text-destructive">{state.message}</p>
                        )}
                    </div>
                    <DialogFooter>
                        <SubmitButton />
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
