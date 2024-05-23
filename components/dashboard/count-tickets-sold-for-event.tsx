import React, { HtmlHTMLAttributes } from "react";
import { getEventTickets, useGetEventTickets } from "@/hooks/useGetEvents";
import { User } from "@/lib/logged-user";

const CountTicketsSoldForEvent: React.FC<HtmlHTMLAttributes<HTMLDivElement> & 
    { event: SingleEvent & {ticketsSold: Ticket[] | []} }> = ({children, className, event}) => {
    // const [ticketsSold, setTicketsSold] = useState<number>(0);
    const [tickets] = useGetEventTickets(User, event);

    return (
        <span>{ tickets.length }</span>
    )
}

export default CountTicketsSoldForEvent;