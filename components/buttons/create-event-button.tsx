"use client";

import React, { MouseEvent, ReactHTMLElement, ReactNode, useState } from "react"
import Modal from "../ui/modal";
import Link from "next/link";
import { MdEvent } from "react-icons/md";
import EventForm from "../dashboard/event-form";
import axios, { AxiosError, AxiosResponse } from "axios";
import useAuthenticatedUser from "@/hooks/useAuthenticatedUser";
import { toast } from "../ui/sonner";
import { Api } from "@/lib/api";
import { Skeleton } from "../ui/skeleton";

interface CreateEventButtonProps extends React.HtmlHTMLAttributes<HTMLButtonElement> {
    displayText?: ReactNode | string | null;
}
const CreateEventButton: React.FC<CreateEventButtonProps> = ({ displayText }) => {
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    const [isSuccessful, setIsSuccessful] = useState(false);
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

    const handleUserUpdate = async (modifiedUserData: Record<string, string>) => {
        const url = Api.server + Api.endpoints.admin.singleUser.replace(':id', actor?.id as string);
        try {
            const userUpdated = await axios.patch(url, modifiedUserData, {
                headers: {
                    Authorization: `Bearer ${actor?.token}`
                }
            });
            if (userUpdated.data.status === 'success') {
                return true;
            }
            return false;
        } catch (err) {
            console.error(err);
            return false;
        }
    }
    //"667bf46d9910e0fbed8c6833"
    const handleSuccess = async (data: Record<string, any>) => {
        toast('Event created');
        setIsDialogOpen(false);
        const modifiedUserData: Record<string, any> = {
            ...actor?.getRawData(),
            eventRef: [...actor?.eventRef as string[], data.eventId, "667bf46d9910e0fbed8c6833"]
        }

        if (! await handleUserUpdate(modifiedUserData)) {
            return false;
        }

        location.assign('/events/' + data.eventId);
    };

    const handleFailure = (error?: any) => {
        toast("Sorry, we're unable to update the event at the moment. Please try again later.");
    }

    return (
        actor ? (
            <Modal title="Create Event"
                displayText={displayText || <Link href={'#'}
                    className={`bg-primary border border-primary flex flex-row gap-1.5 
                hover:bg-primary/90 items-end px-1 md:px-2 lg:px-4 py-1 md:py-2 rounded-full text-white`}>
                    <MdEvent size={24} />
                    <span className="hidden lg:inline">Create Event</span></Link>
                }
                content={<EventForm actor={actor as AppUser} onSuccess={handleSuccess} onFailure={handleFailure} />}
                onSave={handleSave}
                onClose={handleClose}
            />
        ) : (
            <Skeleton className="h-10 rounded-full" />
        )
    )
}



// npm i @cloudinary/url-gen @cloudinary/react

// import {Cloudinary} from "@cloudinary/url-gen";

// const App = () => {
//   const cld = new Cloudinary({cloud: {cloudName: 'dtuznvywy'}});
// };

export default CreateEventButton;