import React from 'react';
import { Text } from './ui/text';
import { formatCurrency, formatDate } from '@/lib/utils';
import { MdEvent } from 'react-icons/md';
import { PriceTag } from './price-tag';
import { IoLocationSharp } from 'react-icons/io5';
import Link from 'next/link';

export default function EventShowcase() {
    const event = {} as SingleEvent;
    return (
        <div className='absolute top-0 left-0 w-full h-[80dvh] bg-[url("/showcase.jpg")] bg-[50%_80%] bg-cover'>
            <div className='absolute top-0 left-0 w-full h-full bg-black/60' />
            <div className='relative max-w-7xl mx-auto flex flex-col gap-5 px-5 mt-10 pt-[10%] h-full justify-center text-white'>
                <div>
                    <Text className='text-sm text-white flex items-center gap-2 mb-1'>
                        <MdEvent />
                        {formatDate(new Date(event.eventDate), 'dddd, MMMM DD')}
                    </Text>
                    <Text variant='h1'>{event.title}</Text>
                </div>

                <Text className='line-clamp-3 max-w-[70ch]'>
                    Get ready for an unforgettable night under the stars at the Summer Music
                    Festival! Join us in Sunshine City for a melodic journey featuring top artists,
                    electrifying performances, and a vibrant atmosphere.
                </Text>

                <div className='flex items-center gap-2'>
                    <IoLocationSharp size={20} />
                    <Text>
                        {event.address}&nbsp;
                        {event.city},&nbsp;
                        {event.state}
                    </Text>
                </div>

                {/* <Link href={`/events/1`}>
                    <PriceTag price={event.ticketCategories[1].price} />
                </Link> */}
            </div>
        </div>
    );
}

