import React, { HtmlHTMLAttributes } from "react";
import { useGetTicketSales } from "@/hooks/useGetEvents";
import useAuthenticatedUser from "@/hooks/useAuthenticatedUser";

const CountTicketsSoldForEvent: React.FC<HtmlHTMLAttributes<HTMLDivElement> & 
    { event: SingleEvent & {ticketsSold: Ticket[] | []} }> = ({children, className, event}) => {
        const actor = useAuthenticatedUser();
    const [isLoading, tickets] = useGetTicketSales(actor as AppUser, event);

    return (
        <span>{ tickets.length }</span>
    )
}

export default CountTicketsSoldForEvent;