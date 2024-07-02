import React, { HtmlHTMLAttributes, MouseEvent, MouseEventHandler } from "react";
import { Button } from "../../ui/button";
import { cn } from "@/lib/utils";
import { BiTrash } from "react-icons/bi";
import { Api } from "@/lib/api";
import useAuthenticatedUser from "@/hooks/useAuthenticatedUser";
import axios from "axios";
import { toast } from "../../ui/sonner";


const DeleteTicket: React.FC<HtmlHTMLAttributes<HTMLButtonElement> & {
    ticketId: string;
    variant?: any;
    onPending?: Callback;
    onSuccess?: Callback;
    onFailure?: Callback
}> = ({
    children, className, ticketId, variant, onPending, onSuccess, onFailure, ...props
}) => {
        const actor = useAuthenticatedUser();

        const handleDelete: React.MouseEventHandler<HTMLButtonElement> = async (ev: MouseEvent) => {
            if (!ev.isDefaultPrevented()) {
                ev.preventDefault();
                ev.stopPropagation();
            }
            if (!confirm('Are you sure you want to delete this ticket?')) {
                return;
            }
            toast(<div className="text-destructive">Deleting ticket</div>)
            onPending && onPending(null);

            const url = Api.server + Api.endpoints.admin.singleTicket.replace(':id', ticketId);
            try {
                const response = await axios.delete(url, {
                    headers: { Authorization: `Bearer ${actor?.token}` }
                });

                if (response.status == 200) {
                    onSuccess && onSuccess(response.data);
                    toast(<div className="text-green-800">Ticket deleted successfully</div>);
                }
            } catch (error) {
                onFailure && onFailure(error);
                toast(<div className="text-destructive">Sorry, but your request could not be completed. Please try again later.</div>);
            }
        }

        return (
            <Button
                className={cn(className)}
                type="button"
                variant={variant || 'default'}
                {...props} onClick={handleDelete}>
                {children || 'Delete'} <BiTrash size={20} />
            </Button>
        )
    }

export default DeleteTicket;