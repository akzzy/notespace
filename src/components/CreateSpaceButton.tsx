'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Rocket } from 'lucide-react';
import { useState } from 'react';
import { addNoteAction } from '@/lib/actions';

export function CreateSpaceButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    const userId = Math.random().toString(36).substring(2, 6).toUpperCase();
    
    const formData = new FormData();
    formData.append('userId', userId);
    formData.append('content', 'Welcome to your new NoteSpace! ✨');
    
    const result = await addNoteAction({ message: '' }, formData);

    if (result.message === 'Added note.') {
      router.push(`/${userId}`);
    } else {
      // Handle error - maybe show a toast
      setIsLoading(false);
    }
  };

  return (
    <Button onClick={handleClick} disabled={isLoading} size="lg">
       {isLoading ? (
        <span className="flex items-center">
          <Rocket className="mr-2 h-4 w-4 animate-bounce" />
          Creating...
        </span>
      ) : (
        <span className="flex items-center">
          <Rocket className="mr-2 h-4 w-4" />
          Create a Note Space
        </span>
      )}
    </Button>
  );
}
