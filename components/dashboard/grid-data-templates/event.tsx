import React from "react";
import { GridCard, GridCardBody, GridCardHeader, GridContent } from "@/components/ui/rix-ui/data-layouts/grid/grid";
import { Text } from "@/components/ui/text";
import { formatCurrency, formatDate, formatNumber } from "@/lib/utils";
import Link from "next/link";
import useAuthenticatedUser from "@/hooks/useAuthenticatedUser";
import Image from "next/image";
import CountTicketsSoldForEvent from "../count-tickets-sold-for-event";
import EventsListActionsDropdownMenu from "../events-list-actions-dropdown-menu";
import generateRandomString from "@/lib/random-string-generator";

const EventGridTemplate: React.FC<{ data: SingleEvent }> = ({ data }) => {
    const actor = useAuthenticatedUser();
    const event: SingleEvent & { ticketsSold: Ticket[] | [] } = { ...data, ticketsSold: [] }

    const actionMenuId = 'eve-' + generateRandomString(32, 'alphanumeric', false);


    return (
        <GridContent>
            <GridCard>
                <GridCardHeader className="flex flex-col justify-end overflow-hidden p-0 relative rounded-t-[10px]">
                    <Image className="rounded-t-[10px] w-full" src={event.eventBanner.url || ''} alt={event.title} width={300} height={120} />
                    <div className="absolute blackboard border-b flex gap-5 justify-between pb-4 pt-[10%] px-4 py-2 py-3 w-full">
                        <Text variant='h3'><Link href={`/events/${event._id}`}>{event.title}</Link></Text>
                        <EventsListActionsDropdownMenu
                            id={actionMenuId}
                            event={event}
                            onBeforeAction={action => handleBeforeAction(action, actionMenuId)}
                            onActionSuccess={
                                (eventId, action) => handleActionSuccess(eventId, action, actionMenuId)
                            }
                            onActionFailure={(action, error) => handleActionFailure(action, actionMenuId, error)} />
                    </div>
                </GridCardHeader>
                <GridCardBody>
                    <div className="flex gap-5 py-2 border-b">
                        <Text className="font-semibold text-muted-foreground w-1/3">Location:</Text>
                        <Text>{event.address}, {event.city}, {event.state} State</Text>
                    </div>
                    <div className="flex gap-5 py-2 border-b">
                        <Text className="font-semibold text-muted-foreground w-1/3">Date & Time:</Text>
                        <Text>
                            {formatDate(new Date(event.eventDate), 'dddd, MMMM DD YYYY')}
                            <br />
                            {formatDate(new Date(event.eventDate), 'hh:mm A')}
                        </Text>
                    </div>
                    <div className="flex gap-5 py-2 border-b">
                        <Text className="font-semibold text-muted-foreground w-1/3">Ticket closing on:</Text>
                        <Text>
                            {formatDate(new Date(event.ticketClosingDate), 'dddd, MMMM DD YYYY')}
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
                    <div className="flex gap-5 py-2">
                        <Text className="font-semibold text-muted-foreground w-1/3">Ticket Sold:</Text>
                        <div><CountTicketsSoldForEvent event={event} /></div>
                    </div>
                </GridCardBody>
            </GridCard>
        </GridContent>
    )
}

export default EventGridTemplate;

function handleBeforeAction(action: string, menuId: string): boolean {
    switch (action) {
        case 'delete':
            const card = document.querySelector(`#${menuId}`)?.closest('.rix-ui-grid-column .rix-ui-grid-card');
            if (card) {
                card.classList.add('pending-delete');
            }
            return true;

        default:
            break;
    }

    return false;
}

function handleActionSuccess(response: any, action: string, menuId: string): void {
    switch (action) {
        case 'delete':
            const column = document.querySelector(`#${menuId}`)?.closest('.rix-ui-grid-column');
            const card = column?.querySelector('.rix-ui-grid-card');
            // const popper = document.querySelector('[data-radix-popper-content-wrapper]');
            if (!column) {
                return;
            }
            new Promise((resolve, reject) => {
                card?.classList.remove('pending-delete');
                card?.classList.add('deleted');
                setTimeout(() => {
                    resolve(true);
                }, 1000);
            }).then(() => {
                column.remove();
                // popper?.remove();
                // document.body.removeAttribute('data-scroll-locked');
                // document.body.style.pointerEvents = 'auto';
            });
            break;

        default:
            break;
    }
}

function handleActionFailure(action: string, menuId: string, error?: Error | unknown): void {
    switch (action) {
        case 'delete':
            const card = document.querySelector(`#${menuId}`)?.closest('.rix-ui-grid-column .rix-ui-grid-card');
            if (!card) {
                return;
            }
            card.classList.remove('pending-delete');
            break;

        default:
            break;
    }
}