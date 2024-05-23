import { getEventAssociatedToTicket, useGetEventById } from "@/hooks/useGetEvents";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const TicketEvent = ({ticket, actor}: {ticket: Ticket; actor: AppUser}) => {
    const [event, error] = useGetEventById( ticket.eventRef, actor, true );
    
    return (
        event &&
        <Link href={ `${location.origin}/events/${event._id}`}>
            { event.title }
        </Link>
    )
}

export default TicketEvent;
