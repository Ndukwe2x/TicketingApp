import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
    return (
        <div>
            <Skeleton className='aspect-[3/2] md:aspect-[5/2]' />

            <div className='max-w-3xl flex flex-col gap-10 mt-10 relative'>
                <div className='flex flex-col gap-2'>
                    <Skeleton className='w-1/2 h-10' />
                    <Skeleton className='w-full h-4' />
                    <Skeleton className='w-full h-4' />
                </div>

                <div className='grid grid-cols-2 gap-2'>
                    <Skeleton className='w-2/3 h-8' />
                    <Skeleton className='w-2/3 h-8' />
                    <Skeleton className='w-2/3 h-8' />
                    <Skeleton className='w-2/3 h-8' />
                </div>

                <div className='flex flex-col gap-2'>
                    <Skeleton className='w-1/3 h-7 mb-2' />
                    <Skeleton className='w-full h-4' />
                    <Skeleton className='w-full h-4' />
                    <Skeleton className='w-full h-4' />
                    <Skeleton className='w-full h-4' />
                </div>
            </div>
        </div>
    );
}
