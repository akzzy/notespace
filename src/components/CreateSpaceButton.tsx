'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Rocket } from 'lucide-react';
import { useState } from 'react';

export function CreateSpaceButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    setIsLoading(true);
    // Generate a 6-digit unique User ID
    const userId = Math.floor(100000 + Math.random() * 900000).toString();
    router.push(`/${userId}`);
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
