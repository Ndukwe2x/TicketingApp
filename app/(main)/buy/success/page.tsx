'use client';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { formatCurrency, formatDate } from '@/lib/utils';
import Image from 'next/image';
import React, { useCallback } from 'react';
import { FaClock } from 'react-icons/fa6';
import { IoLocationSharp } from 'react-icons/io5';
import { MdEvent } from 'react-icons/md';
import html2PDF from 'jspdf-html2canvas';
import { Button } from '@/components/ui/button';
import { dummyEvent } from '@/lib/data';

export default function SuccessTicket() {
    const cardRef = React.useRef<HTMLDivElement>(null);

    const downloadTicket = useCallback(() => {
        // if (!cardRef.current) return;
        // html2PDF(cardRef.current, {
        //     jsPDF: {
        //         unit: 'in',
        //         format: 'letter',
        //         orientation: 'portrait',
        //     },
        //     html2canvas: {
        //         scale: 2,
        //     },
        //     imageType: 'image/jpeg',
        //     output: 'ticket',
        // });
    }, []);

    return (
        <div className='flex flex-col items-center gap-5'>
            <Text variant='h2' className='text-center'>
                Purchase Successful
            </Text>

            <Card className='w-min max-w-96 rounded-none'>
                <div ref={cardRef}>
                    <CardHeader className='relative h-44 overflow-hidden'>
                        <Image src={event.eventBanner} alt={event.title} fill objectFit='cover' />
                    </CardHeader>
                    <CardContent className='p-5 flex flex-col gap-5 justify-between'>
                        <Text variant='h3' className=''>
                            {event.title}
                        </Text>

                        <div className='flex gap-3'>
                            <div>
                                <div className='flex items-start gap-1'>
                                    <MdEvent className='text-4xl -ml-1' />
                                    <span className='flex items-start gap-2'>
                                        <span className='text-4xl font-bold'>
                                            {formatDate(event.eventDate, 'DD')}
                                        </span>

                                        <span className='leading-5'>
                                            {formatDate(event.eventDate, 'MMMM')}
                                            <br />
                                            {formatDate(event.eventDate, 'YYYY')}
                                        </span>
                                    </span>
                                </div>
                                <div className='flex items-start gap-3 mt-3'>
                                    <FaClock className='text-xl' />
                                    {formatDate(event.eventDate, 'hh:mm A')}
                                </div>
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

                        <div className='flex flex-col justify-between items-start border-t pt-5'>
                            <div className='flex gap-1'>
                                <Text>Category: </Text>
                                <Text variant='h4'>
                                    {event.ticketCategories[1].name} &nbsp;|&nbsp;{' '}
                                    {formatCurrency(event.ticketCategories[1].price)}
                                </Text>
                            </div>
                            <div className='flex gap-1'>
                                <Text>Ticket No: </Text>
                                <Text variant='h4'>VIP-2024-12345 </Text>
                            </div>
                        </div>
                    </CardContent>
                </div>
            </Card>

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
