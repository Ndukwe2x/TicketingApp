"use client";

import React, { MouseEvent, ReactHTMLElement, ReactNode } from "react"
import Modal from "../ui/modal";
import Link from "next/link";
import { MdEvent } from "react-icons/md";
import EventForm from "../dashboard/event-form";
import { AxiosError, AxiosResponse } from "axios";
import useAuthenticatedUser from "@/hooks/useAuthenticatedUser";

interface CreateEventButtonProps extends HtmlHTMLAttributes<HTMLButtonElement> {
    displayText?: ReactNode | string | null;
}
const CreateEventButton: React.FC<CreateEventButtonProps> = ({ displayText }) => {
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    const actor = useAuthenticatedUser();
    const initDialog = () => {
        setIsDialogOpen(true);
    }

    const handleClose = () => {
        setIsDialogOpen(false);
    }

    const handleSave = () => {
        setIsDialogOpen(false);
    }

    const handleSuccess = (response: AxiosResponse) => {
        
    }

    const handleFailure = (error: AxiosError) => {
        
    }

    return (
        <>
            <Modal title="Create Event" 
                displayText={ displayText || <Link href={'#'}
                className={`bg-primary border border-primary flex flex-row gap-1.5 
                hover:bg-primary/90 items-end px-1 md:px-2 lg:px-4 py-1 md:py-2 rounded-full text-white`}>
                    <MdEvent size={24} />
                    <span className="hidden lg:inline">Create Event</span></Link> 
                } 
                content={ <EventForm actor={ actor } onSuccess={ handleSuccess } onFailure={ handleFailure} /> } 
                onSave={ handleSave } 
                onClose={ handleClose }
                 />
        </>
    )
}



// npm i @cloudinary/url-gen @cloudinary/react

// import {Cloudinary} from "@cloudinary/url-gen";

// const App = () => {
//   const cld = new Cloudinary({cloud: {cloudName: 'dtuznvywy'}});
// };

export default CreateEventButton;