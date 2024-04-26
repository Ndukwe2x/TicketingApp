'use client';

import { Text } from '@/components/ui/text';
import React, { useCallback } from 'react';
import html2PDF from 'jspdf-html2canvas';
import { Button } from '@/components/ui/button';
import { dummyEvent } from '@/lib/data';
import TicketSlip from '@/components/ticket-slip';

export default function SuccessTicket() {
    const cardRef = React.useRef<HTMLDivElement>(null);

    const downloadTicket = useCallback(() => {
        if (!cardRef.current) return;
        html2PDF(cardRef.current, {
            jsPDF: {
                unit: 'in',
                format: 'letter',
                orientation: 'portrait',
            },
            html2canvas: {
                scale: 1.5,
            },
            imageType: 'image/jpeg',
            imageQuality: 100,
            output: `${event.ticketCategories[0].name} Ticket to ${event.title}`,
        });
    }, []);

    return (
        <div className='flex flex-col items-center gap-5'>
            <Text variant='h2' className='text-center'>
                Purchase Successful
            </Text>

            <div>
                <TicketSlip event={ dummyEvent } cardRef={ cardRef } />
            </div>

            <Button onClick={downloadTicket}>Download Ticket</Button>
        </div>
    );
}

const event = dummyEvent;

{
    /*<Card className='w-full max-w-96 rounded-none'>
    <CardContent className='relative w-full text-white'>
        <Image src={event.eventBanner} alt={event.title} fill objectFit='cover' />
        <div className='absolute top-0 left-0 w-full h-full bg-black/50' />

        <div className='z-10 relative py-20 px-5 flex flex-col gap-5 justify-between'>
            <Text variant='h3' className='line-clamp-2'>
                {event.title}
            </Text>

            <div className='flex gap-3'>
                <div>
                    <Text className='flex items-center gap-1'>
                        <MdEvent className='text-4xl' />
                        <span className='flex items-center gap-2'>
                            <span className='text-4xl font-bold'>
                                {formatDate(event.eventDate, 'DD')}
                            </span>

                            <span className='leading-5'>
                                {formatDate(event.eventDate, 'MMMM')}
                                <br />
                                {formatDate(event.eventDate, 'YYYY')}
                            </span>
                        </span>
                    </Text>
                    <Text variant='h4' className='flex items-center gap-3 mt-3'>
                        <FaClock className='text-4xl' />
                        {formatDate(event.eventDate, 'hh:mm A')}
                    </Text>
                </div>
                <div className='flex gap-1'>
                    <div>
                        <IoLocationSharp className='text-4xl' />
                    </div>
                    <div className='flex flex-col gap-2'>
                        <Text>
                            {event.address}&nbsp;
                            {event.city},&nbsp;
                            {event.state}
                        </Text>
                    </div>
                </div>
            </div>

            <div className='flex flex-col justify-between items-start'>
                <div className='flex gap-1'>
                    <Text>Category: </Text>
                    <Text variant='h4'>
                        {event.ticketCategories[1].name} {event.ticketCategories[1].price}
                    </Text>
                </div>
                <div className='flex gap-1'>
                    <Text>Ticket No: </Text>
                    <Text variant='h4'>VIP-2024-12345 </Text>
                </div>
            </div>
        </div>
    </CardContent>
</Card>*/
}
