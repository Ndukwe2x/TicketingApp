"use client";

import React, { HtmlHTMLAttributes, MouseEvent, useState } from "react";
import { Button } from "../ui/button";
import { toast } from "../ui/sonner";
import { MdDelete } from "react-icons/md";
import { deleteEvent, deleteEventTickets } from "@/hooks/useGetEvent";
import { dissociateUserFromEvent, fetchUsersByEventId } from "@/hooks/useGetUsers";
import { Icons } from "../icons";
import { useRouter } from "next/navigation";
import { useAppData } from "@/hooks/useCustomContexts";
import { fetchEventTickets } from "@/hooks/useGetEvents";

interface ButtonProps extends HtmlHTMLAttributes<HTMLButtonElement> {
    actor: AppUser;
    event: SingleEvent;
    onInit?(): boolean;
    onAfterDelete?(deletedEventId: string): void;
    onFailure?(error?: Error | unknown): void;
    variant?: any;
}
const DeleteEventButton: React.FC<ButtonProps> = ({
    children,
    className,
    actor,
    event,
    onInit,
    onAfterDelete,
    onFailure,
    variant,
    ...props
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccessful, setIsSuccessful] = useState(false);
    const route = useRouter();
    const { setPageData } = useAppData();

    const deleteTickets = async (event: SingleEvent) => {


        return true;
    }

    const eventHasTickets = async (eventId: string, actor: AppUser) => {
        const tickets: Ticket[] | [] = await fetchEventTickets(eventId, actor);
        return tickets.length ? true : false;
    }

    const handleDeleteAction = async (ev: MouseEvent) => {
        const confirmed = confirm(`Are you sure you want to delete the event "${event.title}"?`);
        if (!confirmed) {
            return;
        }
        setIsLoading(true);
        onInit && onInit();

        const thisEventHasTickets = await eventHasTickets(event._id, actor);
        let ticketsDeleted = false;

        if (thisEventHasTickets) {
            const shouldTicketBeDeleted = confirm(
                `Would you like to also delete associated tickets for this event?`
            );
            // const shouldTicketBeDeleted: boolean = await new Promise((resolve, reject) => {
            //     setTimeout(() => {
            //         const shouldTicketBeDeleted = confirm(`Would you like to also delete associated tickets for this event?`);
            //         return resolve(shouldTicketBeDeleted);
            //     }, 500);
            // });

            if (shouldTicketBeDeleted) {
                // Attempt to delete the associated tickets
                const deleteAllTickets = await deleteEventTickets(event._id, actor);
                if (!deleteAllTickets) {
                    const continueWithoutDeletingTicket = confirm(
                        'Unable to delete tickets, would you like to continue without deleting tickets?'
                    );
                    if (!continueWithoutDeletingTicket) {
                        toast(<span className="text-destructive">Event Deletion aborted.</span>);
                        setIsLoading(false);
                        onFailure && onFailure();
                        return false;
                    }
                    toast(<span className="text-warn">Deleting event without tickets.</span>);
                } else {
                    ticketsDeleted = true;
                }
            }
        }


        // Attempt to dissociate the users assoctiated to this event, from it.
        // This action depends on whether the tickets were deleted or not.
        // If the tickets were not deleted, then we must also leave the event 
        // id attached to the user in order to be able to track the tickets
        // ownership in the absense of the event.
        if (!thisEventHasTickets || ticketsDeleted) {
            try {
                const users = await fetchUsersByEventId(event._id, actor as AppUser);
                if (users.length) {
                    const detachUsers = await Promise.all(users.map(
                        async (user: UserInfo) => await dissociateUserFromEvent(user, event._id, actor)
                    ));
                    if (!detachUsers.length) {
                        setIsLoading(false);
                        onFailure && onFailure(new Error('Sorry, the event could not be deleted.'));
                        return false;
                    }
                }
            } catch (error) {
                toast(<span className="text-destructive">Unable to delete event. Something went wrong.</span>);
                setIsLoading(false);
                onFailure && onFailure(error);
                return;
            }
        }

        // If everything went well, then we can go ahead and delete the event.
        const eventDeleted = await deleteEvent(event._id, actor);
        if (!eventDeleted) {
            setIsLoading(false);
            const errorMsg = 'Unable to delete event. Please try again.';
            if (onFailure) {
                onFailure(new Error(errorMsg));
            } else {
                toast(<span className="text-destructive">{errorMsg}</span>);
            }
            return;
        }
        setIsLoading(false);
        setIsSuccessful(true);
        if (onAfterDelete) {
            onAfterDelete(event._id);
        } else {
            toast(<span className="text-green-800">Event deleted.</span>);
        }
        // setPageData('page_activity', { deletedEvent: event._id });
    }

    return (
        <Button onClick={handleDeleteAction} className={className} variant={variant || 'destructive'}
            type="button" {...props}>
            {isLoading && <>Deleting... <Icons.spinner className='mr-2 h-4 w-4 animate-spin' /></>}
            {!isLoading && (children || <>Delete<MdDelete size={18} className="ml-2" /></>)}
        </Button>
    )
}

export default DeleteEventButton;