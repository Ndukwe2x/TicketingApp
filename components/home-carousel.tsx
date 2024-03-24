'use client';

import * as React from 'react';
import Autoplay from 'embla-carousel-autoplay';

import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import Link from 'next/link';
import { Text } from '@/components/ui/text';
import Image from 'next/image';
import { PriceTag } from './price-tag';
import { useGetEvents } from '@/hooks/useGetEvents';
import { Skeleton } from './ui/skeleton';
import { formatDate } from '@/lib/utils';
import { MdEvent } from 'react-icons/md';

export function FeaturedCarousel() {
    const { featuredEvents, isLoading } = useGetEvents();

    if (isLoading) {
        return (
            <>
                <Text variant='h2'>Featured</Text>
                <LoadingCarousel />
            </>
        );
    }

    return (
        <>
            <Text variant='h2'>Featured</Text>
            <Carousel
                className='w-full'
                opts={{ loop: true }}
                plugins={[
                    Autoplay({
                        stopOnInteraction: false,
                        stopOnMouseEnter: true,
                        delay: 4000,
                    }),
                ]}
            >
                <CarouselContent>
                    {featuredEvents?.map((event) => (
                        <CarouselItem key={event.id} className='basis-5/6 md:basis-1/2 lg:basis-[30%]'>
                            <div className='p-1 relative'>
                                <Image
                                    src={event.image}
                                    alt={event.title}
                                    fill
                                    style={{ objectFit: 'cover' }}
                                    className='rounded-lg -z-10'
                                />
                                <div className='absolute inset-0 bg-black bg-opacity-70 rounded-lg -z-10' />
                                <Link href={`/events/${event.id}`}>
                                    <Card className='aspect-[3/2] justify-end p-0 sm:p-4 bg-transparent border-none'>
                                        <CardContent className='z-10 flex flex-col justify-end gap-2 h-full max-w-2xl pb-4'>
                                            <Text className='text-xs text-white flex items-center gap-2'>
                                                <MdEvent />
                                                {formatDate(event.date, 'dddd, MMMM DD')}
                                            </Text>
                                            <Text
                                                variant='h3'
                                                className='text-white line-clamp-2'
                                            >
                                                {event.title}
                                            </Text>
                                            <Text asLabel className='text-white line-clamp-2'>
                                                {event.summary}
                                            </Text>
                                        </CardContent>
                                        <CardFooter>
                                            <Text variant='h4' className='text-white mr-2'>
                                                <PriceTag price={event.price} />
                                            </Text>
                                        </CardFooter>
                                    </Card>
                                </Link>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                {/*<CarouselPrevious />
            <CarouselNext />*/}
            </Carousel>
        </>
    );
}

const LoadingCarousel = () => {
    return (
        <div className='flex gap-5'>
            <div className='relative flex items-center h-full space-x-4 w-full aspect-[3/2]'>
                <Skeleton className='h-full w-full' />
                <div className='absolute w-full left-0 bottom-7 p-10 space-y-2'>
                    <Skeleton className='h-8 w-2/3 sm:w-1/3' />
                    <Skeleton className='h-3 w-5/6 sm:w-2/3' />
                    <Skeleton className='h-3 w-5/6 sm:w-2/3' />
                </div>
            </div>
            <div className='relative hidden lg:flex items-center h-full space-x-4 w-full aspect-[3/2]'>
                <Skeleton className='h-full w-full' />
                <div className='absolute w-full left-0 bottom-7 p-10 space-y-2'>
                    <Skeleton className='h-8 w-2/3 sm:w-1/3' />
                    <Skeleton className='h-3 w-5/6 sm:w-2/3' />
                    <Skeleton className='h-3 w-5/6 sm:w-2/3' />
                </div>
            </div>
            <div className='relative hidden lg:flex items-center h-full space-x-4 w-full aspect-[3/2]'>
                <Skeleton className='h-full w-full' />
                <div className='absolute w-full left-0 bottom-7 p-10 space-y-2'>
                    <Skeleton className='h-8 w-2/3 sm:w-1/3' />
                    <Skeleton className='h-3 w-5/6 sm:w-2/3' />
                    <Skeleton className='h-3 w-5/6 sm:w-2/3' />
                </div>
            </div>
        </div>
    );
};
