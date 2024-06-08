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
    const formAction = Api.server + Api.endpoints.admin.event.replace(':id', event._id);
    
    const handleClose = () => {
        setIsDialogOpen(false);
    }

    const handleSave = () => {
        setIsDialogOpen(false);
    }

    const btn = <Button type="button" className={ className } { ...props }>
        { children || <>Edit Event <MdEdit size={ 18 } className="ml-2" /></> }
    </Button>;

    
    const handleSuccess = (data: {eventId: string}) => {
        toast('Event updated');
        setIsDialogOpen(state => !state);
        
        location.assign('/events/' + data.eventId);
    };

    const handleFailure = (error: unknown) => {

    }
    
    const content = <EventForm actor={ actor } 
        onSuccess={ handleSuccess }
        onFailure={ handleFailure }
        isNew={ false }
        action={ formAction }
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