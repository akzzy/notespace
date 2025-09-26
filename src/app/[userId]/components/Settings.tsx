'use client';

import { useTransition, useOptimistic, useRef } from 'react';
import { setDiscoverabilityAction } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import SetPassword from './SetPassword';
import { cn } from '@/lib/utils';


interface SettingsProps {
    userId: string;
    isDiscoverable: boolean;
    showSetPassword?: boolean;
    isInDropdown?: boolean;
}

export default function Settings({ userId, isDiscoverable, showSetPassword = false, isInDropdown = false }: SettingsProps) {
    const { toast } = useToast();
    const formRef = useRef<HTMLFormElement>(null);
    const [isPending, startTransition] = useTransition();
    const [optimisticDiscoverable, setOptimisticDiscoverable] = useOptimistic(isDiscoverable);

    const handleSwitchChange = (checked: boolean) => {
        const formData = new FormData(formRef.current!);
        formData.set('isDiscoverable', String(checked));

        startTransition(async () => {
            setOptimisticDiscoverable(checked);
            const result = await setDiscoverabilityAction({ message: '', ok: false }, formData);
            if (!result.ok) {
                toast({
                    title: 'Error',
                    description: result.message,
                    variant: 'destructive',
                });
            } else {
                 toast({
                    title: 'Success',
                    description: result.message,
                });
            }
        });
    }

    const Wrapper = isInDropdown ? 'div' : Card;
    const ContentWrapper = isInDropdown ? 'div' : 'div';

    return (
        <Wrapper>
            <ContentWrapper className='space-y-4'>
                {showSetPassword && (
                    <div className="px-2">
                        <SetPassword userId={userId} />
                    </div>
                )}
                 <div className={cn(isInDropdown ? 'px-2' : 'p-4')}>
                    <form ref={formRef}>
                        <input type="hidden" name="userId" value={userId} />
                        <div className="flex items-center justify-between space-x-2">
                            <div className='space-y-0.5 pr-4'>
                                <Label htmlFor="discoverable-switch" className="font-medium">Discoverable by IP</Label>
                                <p className="text-xs text-muted-foreground">
                                    Allow this NoteSpace to appear on the homepage for others on your network.
                                </p>
                            </div>
                            <div className='flex items-center gap-2'>
                                {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                                <Switch
                                    id="discoverable-switch"
                                    name="isDiscoverable"
                                    checked={optimisticDiscoverable}
                                    onCheckedChange={handleSwitchChange}
                                    disabled={isPending}
                                    value={String(optimisticDiscoverable)}
                                />
                            </div>
                        </div>
                    </form>
                </div>
            </ContentWrapper>
        </Wrapper>
    );
}
