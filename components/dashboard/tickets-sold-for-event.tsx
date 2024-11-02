import React, { HtmlHTMLAttributes, ReactNode, useCallback, useEffect, useState } from "react";
import { useGetTicketSales } from "@/hooks/useGetEvents";
import { DataTable } from "../ui/data-table";
import { columns } from "./table-columns/sales";
import useAuthenticatedUser from "@/hooks/useAuthenticatedUser";
import RenderPrettyError from "../render-pretty-error";

const TicketsSoldForEvent: React.FC<HtmlHTMLAttributes<HTMLDivElement> &
{ event: SingleEvent & { ticketsSold: Ticket[] | [] } }> = ({ children, className, event }) => {
    const actor = useAuthenticatedUser();
    const [fallback, setFallback] = useState<ReactNode>('Fetching tickets, please wait. This may take a moment...');
    const [isLoading, tickets, error] = useGetTicketSales(actor as AppUser, event);

    useEffect(() => {
        if (error) {
            setFallback(
                <RenderPrettyError error={error} />
            );
            return;
        }
        if (!isLoading && tickets.length == 0) {
            setFallback('No tickets sold yet...');
        }
    }, [isLoading, tickets, error]);

    return (
        <DataTable
            columns={columns}
            data={tickets}
            fallback={fallback}
            isFilteringEnabled={true}
            filterFields={['name', 'email', 'phone', 'ticketCategory', 'eventRef']}>
            <colgroup>
                {
                    columns.map((column, index) => <col key={index} />)
                }
            </colgroup>
        </DataTable>
    )
}

export default TicketsSoldForEvent;