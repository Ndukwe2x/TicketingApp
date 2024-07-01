import React from "react";
import { GridCard, GridCardBody, GridCardHeader, GridContent } from "@/components/ui/rix-ui/data-layouts/grid/grid";
import { Text } from "@/components/ui/text";
import { formatCurrency, formatDate, formatNumber } from "@/lib/utils";
import useAuthenticatedUser from "@/hooks/useAuthenticatedUser";
import { MdLink } from "react-icons/md";
import Image from "next/image";

const EventEditFormSummary: React.FC<{ data: SingleEvent }> = ({ data }) => {
    const actor = useAuthenticatedUser();
    const event: SingleEvent & { ticketsSold: Ticket[] | [] } = { ...data, ticketsSold: [] }

    return (
        <GridContent>
            <GridCard>
                <GridCardHeader className="flex flex-col justify-end overflow-hidden p-0 relative rounded-t-[10px]">
                    {event.eventBanner && <Image className="rounded-t-[10px] w-full"
                        objectFit="cover" objectPosition="center" src={event.eventBanner.url || ''} alt={event.title} width={300} height={120} />}
                    <div className="absolute blackboard border-b flex gap-5 justify-between pb-4 pt-[10%] px-4 py-2 py-3 w-full">
                        <Text variant='h3'>{event.title ? event.title : 'Untitled Event'}</Text>
                    </div>
                </GridCardHeader>
                <GridCardBody>
                    <div className="flex gap-5 py-2 border-b">
                        <Text className="font-semibold text-muted-foreground w-1/3">Location:</Text>
                        <Text>
                            {event.address ? event.address : 'Street address line'},
                            {event.city ? event.city : 'Town/city'},
                            {event.state ? event.state + ' State' : 'State/Region'}</Text>
                    </div>
                    <div className="flex gap-5 py-2 border-b">
                        <Text className="font-semibold text-muted-foreground w-1/3">Date & Time:</Text>
                        <Text>
                            {event.eventDate ? formatDate(new Date(event.eventDate), 'MMMM DD, YYYY') : 'January 1, 2024'}
                            <br />
                            {formatDate(new Date(event.eventDate), 'hh:mm A')}
                        </Text>
                    </div>
                    <div className="flex gap-5 py-2 border-b">
                        <Text className="font-semibold text-muted-foreground w-1/3">Ticket closing on:</Text>
                        <Text>
                            {event.ticketClosingDate ? formatDate(new Date(event.ticketClosingDate), 'MMMM DD, YYYY') : 'January 1, 2024'}
                            <br />
                            {formatDate(new Date(event.ticketClosingDate), 'hh:mm A')}
                        </Text>
                    </div>
                    <div className="flex flex-col gap-5 py-2 border-b">
                        <Text className="font-semibold text-muted-foreground">Ticket Categories:</Text>
                        <div className='gap-1.5 grid grid-cols-3 ticket-categories'>
                            {
                                event.ticketCategories && event.ticketCategories.map((cat, index) => {
                                    return (
                                        <div key={index} className='category-group'>
                                            <Text variant='p' className='font-bold'>{cat.name}</Text>
                                            <Text variant='p'>{formatCurrency(cat.price)}</Text>
                                            <Text variant='p'>{formatNumber(cat.qty)}</Text>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </GridCardBody>
            </GridCard>
        </GridContent>
    )
}

export default EventEditFormSummary;