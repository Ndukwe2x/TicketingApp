"use client";

import React, { HtmlHTMLAttributes, MouseEvent } from "react";
import { Button } from "../ui/button";
import axios from "axios";
import { Api } from "@/lib/api";
import { toast } from "../ui/sonner";
import { MdDelete } from "react-icons/md";
import { cn } from "@/lib/utils";

interface ButtonProps extends HtmlHTMLAttributes<HTMLButtonElement> {
    actor: AppUser; 
    event: SingleEvent; 
    callback?: (deletedEventId: string) => void;
}
const DeleteEventButton: React.FC<ButtonProps> = ({children, className, actor, event, callback, ...props}) => {
    const [isSuccessful, setIsSuccessful] = React.useState(false);

    const handleDeleteAction = (ev: MouseEvent) => {
        const confirmed = confirm(`Are you sure you want to delete ${event.title}?`);

        if ( !confirmed ) {
            return;
        }

        const url = Api.server + Api.endpoints.admin.event.replace(':id', event._id);
        axios.delete(url, {
            headers: {
                Authorization: `Bearer ${actor.token}`
            }
        })
        .then(res => {
            let result = res.data;
            if ( result.status === 'success' ) {
                toast('Event deleted.');
                if (callback) callback(result.eventId);
                setIsSuccessful(true);
            }
        })
        .catch(err => {
            toast('Sorry, the event could not be deleted.');
        });
    }

    return (
        <Button onClick={ handleDeleteAction } className={ className } type="button" { ...props }>
            Delete <MdDelete size={ 18 } className="ml-2" />
        </Button>
    )
}

export default DeleteEventButton;