import { Button } from '@/components/ui/button';
import { NotFoundIcon } from '@/components/ui/not-found-icon';
import { Text } from '@/components/ui/text';
import Link from 'next/link';
import React from 'react';

export default function NotFoundPage({ heading, text }: { heading?: string; text?: string }) {
    return (
        <div className='h-[90dvh] flex flex-col items-center justify-center gap-2 mx-10'>
            <NotFoundIcon />

            <Text variant='h3' className='text-center'>
                404 <span className='inline-block w-0.5 h-6 bg-muted-foreground -mb-1 mx-2' />
                {heading || "Page not found."}
            </Text>
            <Text className='text-center'>
                {text || 'Sorry, we couldn&apos;t find the page you were looking for.'}
            </Text>

            <Link href='/'>
                <Button className='mt-4'>Return to Home Page</Button>
            </Link>
        </div>
    );
}
