import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Skeleton } from './ui/skeleton';
import { PriceTag } from '@/components/price-tag';
import { formatDate } from '@/lib/utils';
import { MdEvent } from 'react-icons/md';

export function EventCard({ event }: { event: AppEvent }) {
    const href = `/events/${event.id}`;

    return (
        <Card className='h-80'>
            <CardHeader className='relative h-1/2 overflow-hidden'>
                <Link href={href}>
                    <Image
                        src={event.image}
                        alt={event.title}
                        fill
                        objectFit='cover'
                        className='rounded-lg'
                    />
                    {event.featured && (
                        <div
                            className={cn(
                                'absolute top-4 -left-8 -rotate-45 px-2 py-1 rounded-md',
                                'bg-accent text-accent-foreground w-32 text-center text-xs uppercase'
                            )}
                        >
                            Featured
                        </div>
                    )}
                </Link>
            </CardHeader>
            <CardContent className='p-3 h-1/2 flex flex-col justify-between'>
                <Text asLabel className='text-xs flex items-center gap-2'>
                    <MdEvent />
                    {formatDate(event.date, 'dddd, MMMM DD')}
                </Text>
                <Link href={href}>
                    <Text variant='h4' className='line-clamp-2'>
                        {event.title}
                    </Text>
                </Link>
                <Text asLabel className='line-clamp-2'>
                    {event.summary}
                </Text>

                <Link href={href} className='w-fit'>
                    <PriceTag price={event.price} />
                </Link>
            </CardContent>
        </Card>
    );
}

export const LoadingEventCard = () => {
    return (
        <div className='relative w-full h-80'>
            <Skeleton className='w-full h-full' />
            <div className='absolute inset-0'>
                <Skeleton className='h-1/3 w-0' />
                <div className='py-5 px-3 h-2/3 flex flex-col gap-2'>
                    <Skeleton className='h-5 w-2/3' />
                    <Skeleton className='h-3 w-full' />
                    <Skeleton className='h-3 w-full' />

                    <Skeleton className='h-5 w-2/3 mt-7' />
                </div>
            </div>
        </div>
    );
};
