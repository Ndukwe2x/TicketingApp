import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import Link from 'next/link';
import React from 'react';
import { BiGlobe } from 'react-icons/bi';

export default function ServiceUnavailable() {
    return (
        <div className='h-[90dvh] flex flex-col items-center justify-center gap-2 mx-10'>
            <BiGlobe size={42} />

            <Text variant='h3' className='text-center'>
                503 <span className='inline-block w-0.5 h-6 bg-muted-foreground -mb-1 mx-2' />
                Service Unavailable.
            </Text>
            {/* <Text className='text-center'>
                Sorry, your request could not be completed. An internal server error has occured.
            </Text> */}

            <Link href='/'>
                <Button className='mt-4'>Return to Home Page</Button>
            </Link>
        </div>
    );
}
