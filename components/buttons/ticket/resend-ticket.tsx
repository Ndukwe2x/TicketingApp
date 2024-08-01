import React, { HtmlHTMLAttributes, MouseEvent, MouseEventHandler, useState } from "react";
import { Button } from "../../ui/button";
import { cn } from "@/lib/utils";
import { BiTrash } from "react-icons/bi";
import { Api } from "@/lib/api";
import useAuthenticatedUser from "@/hooks/useAuthenticatedUser";
import axios from "axios";
import { toast } from "../../ui/sonner";
import { MdSend } from "react-icons/md";
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuLabel, 
    DropdownMenuSeparator, 
    DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import TicketResendForm from "@/components/dashboard/ticket-resend-form";


const SendTicketToCustomer: React.FC<HtmlHTMLAttributes<HTMLButtonElement> & { ticketId: string; variant?: any; onSuccess?: Callback; onFailure?: Callback }> = ({
    children, className, ticketId, variant, onSuccess, onFailure, ...props
}) => {
    const actor = useAuthenticatedUser();
    const url = Api.server + Api.endpoints.admin.singleTicket.replace(':id', ticketId);

    return (
        <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button 
                className={ cn(className) } 
                type="button"
                variant={ variant || 'default' } 
                {...props}>
                { children || <span className="sr-only">Send to customer</span> } <MdSend size={ 20 } />
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
            <DropdownMenuLabel>Send ticket via:</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <TicketResendForm ticketId={ ticketId } />
        </DropdownMenuContent>
    </DropdownMenu>
    )
}

export default SendTicketToCustomer;

