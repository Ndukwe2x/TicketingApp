import React, { HtmlHTMLAttributes, useEffect, useState } from "react";
import Modal from "../ui/modal";
import { MdEdit } from "react-icons/md";
import { toast } from "../ui/sonner";
import { Button } from "../ui/button";
import { Api } from "@/lib/api";
import EventForm from "../dashboard/event-form";

interface EditButtonProps extends HtmlHTMLAttributes<HTMLButtonElement> {
    event: SingleEvent;
    actor: AppUser;
}
const EditEventButton: React.FC<EditButtonProps> = ({children, className, event, actor, ...props}) => {
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    
    const handleClose = () => {
        setIsDialogOpen(false);
    }

    const handleSave = () => {
        setIsDialogOpen(false);
    }

    const btn = <Button type="button" className={ className } { ...props }>
        { children || <>Edit Event <MdEdit size={ 18 } className="ml-2" /></> }
    </Button>;

    
    const handleSuccess = (data: Record<string, string>) => {
        toast('Event updated');
        setIsDialogOpen(false);
        
        location.assign('/events/' + data.showId);
    };

    const handleFailure = (error: unknown) => {
        toast("Sorry, we're unable to update the event at the moment. Please try again later.");
    }
    
    const content = <EventForm actor={ actor } 
        onSuccess={ handleSuccess }
        onFailure={ handleFailure }
        event={event} />;

    return (
        <Modal title='Edit Event'
            displayText={ btn } 
            content={ content } 
            onSave={ handleSave } 
            onClose={ handleClose }
            open={ isDialogOpen }
            onOpenChange={setIsDialogOpen}
            style={ { maxWidth: '45rem' } } />
    )
}


export default EditEventButton;