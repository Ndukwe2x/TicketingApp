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

    const handleDeleteAction = async (ev: MouseEvent) => {
        const confirmed = confirm(`Are you sure you want to delete the event "${event.title}"?`);
        if (!confirmed) {
            return;
        }
        setIsLoading(true);
        onInit && onInit();
        const shouldTicketBeDeleted: boolean = await new Promise((resolve, reject) => {
            setTimeout(() => {
                const shouldTicketBeDeleted = confirm(`Would you like to also delete associated tickets for this event?`);
                return resolve(shouldTicketBeDeleted);
            }, 500);
        });

        if (shouldTicketBeDeleted) {
            // Attempt to delete the associated tickets
            try {
                const deleteTickets = await deleteEventTickets(event._id, actor);
                if (!deleteTickets) {
                    setIsLoading(false);
                    onFailure && onFailure();
                    return false;
                }
            } catch (error) {
                const continueWithoutTicket = confirm(
                    'Unable to delete tickets, would you like to continue without deleting tickets?'
                );
                if (!continueWithoutTicket) {
                    toast(<span className="text-destructive">Event Deletion aborted.</span>);
                    setIsLoading(false);
                    onFailure && onFailure(error);
                    return false;
                }
            }

            // Attempt to dissociate the users assoctiated to this event, from it.
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
                return false;
            }
        }

        // If everything went well, then we can go ahead and delete the event.
        const eventDeleted = await deleteEvent(event._id, actor, shouldTicketBeDeleted);
        if (!eventDeleted) {
            toast(<span className="text-destructive">Sorry, the event could not be deleted.</span>);
            onFailure && onFailure(new Error('Sorry, the event could not be deleted.'));
            return;
        }
        toast(<span className="text-green-800">Event deleted.</span>);
        setIsLoading(false);
        setIsSuccessful(true);

        if (onAfterDelete) {
            onAfterDelete(event._id);
        }
        console.log(event);
        setPageData('page_activity', { deletedEvent: event._id });

        // else {
        //     route.push('/events');
        // }
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