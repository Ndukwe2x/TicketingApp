"use client";

import React, { HtmlHTMLAttributes, MouseEvent } from "react";
import { Button } from "../ui/button";
import { toast } from "../ui/sonner";
import { MdDelete } from "react-icons/md";
import { deleteEvent } from "@/hooks/useGetEvent";

interface ButtonProps extends HtmlHTMLAttributes<HTMLButtonElement> {
    actor: AppUser;
    event: SingleEvent;
    callback?: (deletedEventId: string) => void;
    variant?: any;
}
const DeleteEventButton: React.FC<ButtonProps> = ({ children, className, actor, event, callback, variant, ...props }) => {
    const [isSuccessful, setIsSuccessful] = React.useState(false);

    const handleDeleteAction = async (ev: MouseEvent) => {
        const confirmed = confirm(`Are you sure you want to delete ${event.title}?`);

        if (!confirmed) {
            return;
        }

        const eventDeleted = await deleteEvent(event._id, actor);
        if (!eventDeleted) {
            toast('Sorry, the event could not be deleted.');
            return;
        }
        toast('Event deleted.');
        if (callback) callback(event._id);
        setIsSuccessful(true);
    }

    return (
        <Button onClick={handleDeleteAction} className={className} variant={variant || 'destructive'} type="button" {...props}>
            Delete <MdDelete size={18} className="ml-2" />
        </Button>
    )
}

export default DeleteEventButton;