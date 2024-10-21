import DeleteTicket from "@/components/buttons/ticket/delete-ticket";
import SendTicketToCustomer from "@/components/buttons/ticket/resend-ticket";
import { GridCard, GridCardBody, GridCardFooter, GridCardHeader, GridContent } from "@/components/ui/rix-ui/data-layouts/grid/grid";
import { toast } from "@/components/ui/sonner";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";
import { FiEye } from "react-icons/fi";

const TicketGridTemplate: React.FC<{ data: Ticket }> = ({ data }) => {

    const ticket: Ticket = { ...data };

    return (
        <React.Fragment>
            <GridContent id={`tkt__${ticket._id}`}>
                <GridCard>
                    <GridCardHeader>
                        <div className="flex flex-col gap-5 py-2 border-b">
                            <Text variant='h3'>{ticket.eventTitle}</Text>
                            <Text>Ticket for: {ticket.ticketCategory}</Text>
                        </div>
                        {/* <div className="flex gap-5 py-2 border-b">
                        <Text className="font-semibold text-muted-foreground">Ticket Category:</Text>
                    </div> */}
                    </GridCardHeader>
                    <GridCardBody>
                        <div className="flex gap-5 py-2 border-b">
                            <Text className="font-semibold text-muted-foreground">Customer:</Text>
                            <Text>{ticket.name}</Text>
                        </div>
                        {/* <div>
                        <Text className="font-semibold text-muted-foreground">Contact Info:</Text>
                        <div>
                            <Text><span className="font-semibold text-foreground w-1/4 inline-block">Email:</span> {ticket.email}</Text>
                            <Text><span className="font-semibold text-foreground w-1/4 inline-block">Phone:</span> {ticket.phone}</Text>
                        </div>
                    </div>
                    <div className="flex gap-5 py-2 border-b">
                        <Text className="font-semibold text-muted-foreground w-1/3">Quantity:</Text>
                        <Text>{ticket.numberOfTickets}</Text>
                    </div>
                    <div className="flex gap-5 py-2 border-b">
                        <Text className="font-semibold text-muted-foreground w-1/3">Ticket Reference:</Text>
                        <Text>{ticket.referenceNo}</Text>
                    </div> */}
                    </GridCardBody>
                    <GridCardFooter>
                        <div className='flex gap-3 items-center justify-between px-2'>
                            <Link href={`/tickets/${ticket.referenceNo}/`}
                                className={cn('border border-primary flex flex-row gap-1.5 hover:bg-primary',
                                    'hover:text-primary-foreground md:px-2 md:py-1 px-1.5 py-1 h-9',
                                    'rounded-md text-primary whitespace-nowrap shadow items-center')}>
                                <span className='sr' aria-label="View">View</span>
                                <FiEye size={20} />
                            </Link>
                            <SendTicketToCustomer ticketId={ticket._id} variant={null}
                                className={cn('border flex flex-row gap-1.5 bg-white hover:bg-secondary',
                                    'hover:text-secondary-foreground items-center md:px-2 md:py-1 px-1.5 py-1 ',
                                    'rounded-md text-foreground whitespace-nowrap')}>
                                <span className="sr" aria-label="Send To customer">Send</span>
                            </SendTicketToCustomer>
                            <DeleteTicket ticketId={ticket._id}
                                onPending={() => handlePendingDeleteState(`#tkt__${ticket._id}`)}
                                onSuccess={data => handleDeleteSuccessState(data, `#tkt__${ticket._id}`)}
                                onFailure={error => handleDeleteFailure(error, `#tkt__${ticket._id}`)}
                                variant={null}
                                className={cn('border border-destructive flex flex-row gap-1.5 bg-destructive',
                                    'hover:bg-accent-destructive text-white items-center md:px-2 md:py-1 px-1.5 py-1 ',
                                    'rounded-md text-white whitespace-nowrap')}>
                                <span className="sr" aria-label="Delete Ticket">Delete</span>
                            </DeleteTicket>
                        </div>
                    </GridCardFooter>
                </GridCard>
            </GridContent>

        </React.Fragment>
    )
}

const columnSelector = '.rix-ui-grid-column';
const gridCardSelector = '.rix-ui-grid-card';
const handlePendingDeleteState = (colId: string) => {
    const gridItem = document.querySelector(colId);
    if (!gridItem) {
        return;
    }
    const gridColumn = gridItem.closest(columnSelector);
    if (!gridColumn) {
        return;
    }

    const card = gridItem.querySelector(gridCardSelector);
    const overlay = document.createElement('div');
    const pending = document.createElement('span');
    overlay.classList.add(
        'flex',
        'justify-center',
        'items-center',
        'bg-black/60',
        'absolute',
        'xy-0',
        'rounded-10'
    );

    pending.classList.add(
        'animate-spin',
        'animate-fancy',
        'text-destructive',
        'p-6',
        'rounded-full',
        'inline-block'
    );
    overlay.appendChild(pending);
    card?.classList.add('relative');
    card?.appendChild(overlay);


    // column.style.background = '#ff000047';
    // column.style.border = 'solid 1px #ff000047';
}

const handleDeleteSuccessState = (data: any, colId: string) => {
    const column = document.querySelector(colId)?.closest(columnSelector) as HTMLDivElement;
    if (!column) {
        return;
    }

    column?.remove();
    toast(<div className="text-green-800">Ticket was deleted</div>);
}

const handleDeleteFailure = (error: any, colId: string) => {
    const column = document.querySelector(colId)?.closest(columnSelector) as HTMLDivElement;
    if (!column) {
        return;
    }
    column.style.background = '';
    // column.ariaDisabled = 'false';
}

export default TicketGridTemplate;