import { Button } from '@/components/ui/button';
import { NotFoundIcon } from '@/components/ui/not-found-icon';
import { Text } from '@/components/ui/text';
import Link from 'next/link';
import React from 'react';

export default function NotFoundPage() {
    return (
        <div className='flex flex-col items-center justify-center gap-2 mx-10 mt-[20vh]'>
            <NotFoundIcon />

            <Text variant='h3' className='text-center'>
                404 <span className='inline-block w-0.5 h-6 bg-muted-foreground -mb-1 mx-2' />
                Page not found.
            </Text>
            <Text className='text-center'>
                Sorry, we couldn&apos;t find the page you were looking for.
            </Text>

            <Link href='/'>
                <Button className='mt-4'>Return to Home Page</Button>
            </Link>
        </div>
    );
}
