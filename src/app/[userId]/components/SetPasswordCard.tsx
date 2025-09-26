'use client';

import { useState } from 'react';
import { KeyRound, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import SetPassword from './SetPassword';


interface SetPasswordCardProps {
    userId: string;
}

export default function SetPasswordCard({ userId }: SetPasswordCardProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [wasPasswordSet, setWasPasswordSet] = useState(false);

    const handlePasswordSet = () => {
        setWasPasswordSet(true);
        setIsDialogOpen(false);
    }

    // After password is set, we can show a confirmation or just hide the card.
    // Hiding for now.
    if (wasPasswordSet) {
        return null;
    }

    return (
       <Card className="border-primary/50 bg-primary/5">
            <CardHeader className="flex flex-row items-start gap-4 space-y-0 pb-4">
                <div className="flex-shrink-0">
                    <ShieldCheck className="h-8 w-8 text-primary" />
                </div>
                <div className="flex-grow">
                    <CardTitle>Protect Your NoteSpace</CardTitle>
                    <CardDescription className="text-muted-foreground">
                        Set a password to secure your notes from unauthorized access.
                    </CardDescription>
                </div>
            </CardHeader>
            <CardContent>
                <SetPassword 
                    userId={userId} 
                    onPasswordSet={handlePasswordSet} 
                    renderAsButton={true}
                />
            </CardContent>
       </Card>
    );
}
