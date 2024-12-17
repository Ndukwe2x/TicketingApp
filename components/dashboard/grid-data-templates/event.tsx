import React, { useRef } from "react";
import { GridCard, GridCardBody, GridCardHeader, GridContent } from "@/components/ui/rix-ui/data-layouts/grid/grid";
import { Text } from "@/components/ui/text";
import { cn, formatCurrency, formatDate, formatNumber } from "@/lib/utils";
import Link from "next/link";
import useAuthenticatedUser from "@/hooks/useAuthenticatedUser";
import Image from "next/image";
import CountTicketsSoldForEvent from "../count-tickets-sold-for-event";
import EventsListActionsDropdownMenu from "../events-list-actions-dropdown-menu";
import generateRandomString from "@/lib/random-string-generator";
import BrickwallDateTime from "../brickwall-datetime";
import RenderEventBanner from "../render-event-banner";
import { useAppData } from "@/hooks/useCustomContexts";

const EventGridTemplate: React.FC<{ data: SingleEvent }> = ({ data }) => {
    const actor = useAuthenticatedUser();
    const event: SingleEvent & { ticketsSold: Ticket[] | [] } = { ...data, ticketsSold: [] }
    const { setPageData } = useAppData();
    const actionMenuId = 'eve-' + generateRandomString(32, 'alphanumeric', false);
    const imageBox = '14.270625rem';
    const actionMenuRef = useRef<HTMLDivElement | null>(null);

    function handleBeforeAction(action: string): boolean {
        const card = actionMenuRef.current?.closest('.rix-ui-grid-column .rix-ui-grid-card');
        switch (action) {
            case 'delete':
                if (card) {
                    card.classList.add('pending-delete');
                }
                return true;
            default:
                break;
        }

        return false;
    }

    function handleActionSuccess(response: any, action: string): void {
        // const column = document.querySelector(`#${menuId}`)?.closest('.rix-ui-grid-column');
        const column = actionMenuRef.current?.closest('.rix-ui-grid-column');
        const card = column?.querySelector('.rix-ui-grid-card');

        switch (action) {
            case 'delete':
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
                });
                // setPageData('page_activity', { deletedEvent: response.eventId })
                break;

            default:
                break;
        }


    }

    function handleActionFailure(action: string, error?: Error | unknown): void {
        const card = actionMenuRef.current?.closest('.rix-ui-grid-column .rix-ui-grid-card');
        switch (action) {
            case 'delete':
                if (!card) {
                    return;
                }
                card.classList.remove('pending-delete');
                break;

            default:
                break;
        }
    }

    return (
        <GridContent>
            <GridCard>
                <GridCardHeader className="bg-muted flex flex-col justify-end overflow-hidden p-0 relative">
                    <Link href={`/events/${event._id}`}
                        className="block w-full h-full relative"
                        style={{
                            height: imageBox,
                            minHeight: imageBox,
                            maxHeight: imageBox
                        }}
                    >
                        <RenderEventBanner className="card-img"
                            imgSrc={event.eventBanner.url}
                            imgAltText={event.title} />
                    </Link>
                    <div className="absolute p-2 right-0">
                        {/* <Text>
                            {formatDate(new Date(event.eventDate), 'dddd, MMMM DD YYYY')}
                            <br />
                            {formatDate(new Date(event.eventDate), 'hh:mm A')}
                        </Text> */}
                        <BrickwallDateTime datetime={event.eventDate} dateFormat='D/MMM/YYYY hh:mm A' />
                    </div>
                </GridCardHeader>
                <GridCardBody className="border-t">
                    {/* <div className="flex gap-5 justify-between pb-4 pt-[10%] px-4 py-2 py-3 w-full"> */}
                    <div className="flex gap-5 justify-between w-full">
                        <Text variant='h3' className="flex-1 auto-truncate">
                            <Link href={`/events/${event._id}`} title={event.title}>
                                {event.title}
                            </Link>
                        </Text>
                        <EventsListActionsDropdownMenu
                            ref={actionMenuRef}
                            event={event}
                            onBeforeAction={handleBeforeAction}
                            onActionSuccess={handleActionSuccess}
                            onActionFailure={handleActionFailure} />
                    </div>
                    {/* <div className="flex gap-5 py-2 border-b">
                        <Text className="font-semibold text-muted-foreground w-1/3">Location:</Text>
                        <Text>{event.address}, {event.city}, {event.state} State</Text>
                    </div> */}
                    {/* <div className="flex gap-5 py-2 border-b">
                        <Text className="font-semibold text-muted-foreground w-1/3">Date & Time:</Text>
                        <Text>
                            {formatDate(new Date(event.eventDate), 'dddd, MMMM DD YYYY')}
                            <br />
                            {formatDate(new Date(event.eventDate), 'hh:mm A')}
                        </Text>
                    </div> */}
                    {/* <div className="flex gap-5 py-2 border-b">
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
                    </div> */}
                </GridCardBody>
            </GridCard>
        </GridContent>
    )
}

export default EventGridTemplate;