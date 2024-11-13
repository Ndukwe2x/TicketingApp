"use client";

import React, { ReactNode, useReducer, useState } from "react"
import Modal from "../ui/modal";
import Link from "next/link";
import { MdEvent } from "react-icons/md";
import axios from "axios";
import useAuthenticatedUser from "@/hooks/useAuthenticatedUser";
import { toast } from "../ui/sonner";
import { Api } from "@/lib/api";
import { Skeleton } from "../ui/skeleton";
import EventForm from "../dashboard/multistep-form-wizard/event-form-wizard";
import { useAppData } from "@/hooks/useCustomContexts";
import { fetchEventById } from "@/hooks/useGetEvents";

interface CreateEventButtonProps extends React.HtmlHTMLAttributes<HTMLButtonElement> {
    displayText?: ReactNode | string | null;
}
const CreateEventButton: React.FC<CreateEventButtonProps> = ({ displayText }) => {
    const [isDialogOpen, toggleDialogOpenState] = useReducer(state => !state, false);
    const [isSuccessful, setIsSuccessful] = useState(false);
    const actor = useAuthenticatedUser();
    const { setPageData } = useAppData();

    const initDialog = () => {
        toggleDialogOpenState();
    }

    const handleClose = () => {
        toggleDialogOpenState();
    }

    const handleSave = () => {
        toggleDialogOpenState();
    }

    const handleUserUpdate = async (modifiedUserData: Record<string, string>) => {
        const url = Api.server + Api.endpoints.admin.singleUser.replace(':id', actor?.id as string);
        try {
            const userUpdated = await axios.patch(url, JSON.stringify(modifiedUserData), {
                headers: {
                    Authorization: `Bearer ${actor?.token}`,
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                }
            });
            console.log(userUpdated);
            return;
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

        // If the app user is a user other than an admin, we attribute the event to them,
        // otherwise, if it is a site admin, we leave it unassigned and allow the admin
        // to assign a user manually.
        if (actor?.isUser) {
            const modifiedUserData: Record<string, any> = {
                eventRef: [...actor?.eventRef as string[], data.eventId] // "667bf46d9910e0fbed8c6833"
            }

            if (!await handleUserUpdate(modifiedUserData)) {
                return false;
            }
        }
        toggleDialogOpenState();
        const createdEvent = await fetchEventById(data.eventId, true);
        createdEvent && setPageData('page_activity', { newEvent: createdEvent });
        // location.assign('/events/' + data.eventId);
    };

    const handleFailure = (error?: any) => {
        toast("Sorry, we're unable to update the event at the moment. Please try again later.");
    }

    return (
        actor ? (
            <Modal title="Create Event"
                open={isDialogOpen}
                onOpenChange={toggleDialogOpenState}
                displayText={displayText || <Link href={'#'}
                    // onClick={toggleDialogOpenState}
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


export default CreateEventButton;