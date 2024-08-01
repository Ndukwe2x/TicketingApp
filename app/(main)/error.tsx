'use client'; // Error components must be Client Components

import { Button } from '@/components/ui/button';
import { NotFoundIcon } from '@/components/ui/not-found-icon';
import { Text } from '@/components/ui/text';
import Link from 'next/link';
import { useEffect } from 'react';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void; }) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <div className='flex flex-col items-center justify-center gap-2 mx-10 mt-[20vh]'>
            <NotFoundIcon />

            <Text variant='h3' className='text-center'>
                Oops <span className='inline-block w-0.5 h-6 bg-muted-foreground -mb-1 mx-2' />
                Something went wrong.
            </Text>
            <Text className='text-center'>An unexpected error has occurred.</Text>

            <Button className='mt-4' variant='outline' onClick={reset}>
                Click to Retry
            </Button>
            <Link href='/'>
                <Button className='mt-1'>Return to Home Page</Button>
            </Link>
        </div>
    );
}
