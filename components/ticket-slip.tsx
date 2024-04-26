import { Card, CardContent, CardHeader } from "./ui/card";
import { Text } from "./ui/text";
import Image from "next/image";
import { MdEvent } from "react-icons/md";
import { formatCurrency, formatDate } from "@/lib/utils";
import { FaClock } from "react-icons/fa6";
import { IoLocationSharp } from "react-icons/io5";

const TicketSlip = ({ ticket, event, cardRef }: {ticket: Ticket; event: SingleEvent, cardRef?: React.RefObject<HTMLDivElement>}) => {

    // console.log(new Date(event.eventDate).getUTCDate());
    // return;
    return (
        <Card className='w-min max-w-96 rounded-none'>
            <div ref={cardRef}>
                <CardHeader className='relative h-44 overflow-hidden'>
                    <Image src={event.eventBanner.url} alt={event.title} fill objectFit='cover' />
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
                                        {formatDate(new Date(event.eventDate), 'DD')}
                                    </span>

                                    <span className='leading-5'>
                                        {formatDate(new Date(event.eventDate), 'MMMM')}
                                        <br />
                                        {formatDate(new Date(event.eventDate), 'YYYY')}
                                    </span>
                                </span>
                            </div>
                            <div className='flex items-start gap-3 mt-3'>
                                <FaClock className='text-xl' />
                                {formatDate(new Date(event.eventDate), 'hh:mm A')}
                            </div>
                        </div>
                        <div className='flex gap-1'>
                            <div>
                                <IoLocationSharp className='text-4xl' />
                            </div>
                            <div className='flex flex-col gap-2'>
                                <Text>
                                    {event.address},&nbsp;
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
                                {ticket.ticketCategory} &nbsp;|&nbsp;{' '}
                                {formatCurrency(ticket.amountPaid)}
                            </Text>
                        </div>
                        <div className='flex gap-1'>
                            <Text>Ticket No: </Text>
                            <Text variant='h4'>{ ticket.referenceNo }</Text>
                        </div>
                    </div>
                </CardContent>
            </div>
        </Card>
    )
}

export default TicketSlip;