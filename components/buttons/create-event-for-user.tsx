import React, { HtmlHTMLAttributes, useEffect, useReducer } from "react"
import Modal from "../ui/modal";
import { MdEditCalendar, MdEvent } from "react-icons/md";
import { Button } from "../ui/button";
import axios, { AxiosResponse } from "axios";
import { Api } from "@/lib/api";
import { toast } from "../ui/sonner";
import { cn } from "@/lib/utils";
import EventForm from "../dashboard/multistep-form-wizard/event-form-wizard";
import { useRouter } from "next/navigation";
import { useAppData } from "@/hooks/useCustomContexts";
import { fetchEventById } from "@/hooks/useGetEvents";

interface CreateButtonProps extends HtmlHTMLAttributes<HTMLButtonElement> {
    actor: AppUser;
    user: AppUser;
    variant?: any;
}
const CreateEventForUser: React.FC<CreateButtonProps> = ({ children, className, actor, user, variant, ...props }) => {

    const [isDialogOpen, toggleDialogOpenState] = useReducer(state => !state, false);
    const { setPageData } = useAppData();

    const router = useRouter();

    const initDialog = () => {
        toggleDialogOpenState();
    }

    const handleClose = () => {
        toggleDialogOpenState();
    }

    const handleSave = () => {
        toggleDialogOpenState();
    }

    const handleSuccess = async (data: Record<string, any>) => {
        try {
            const createdEvent = await fetchEventById(data.eventId, true);
            const url = Api.server + Api.endpoints.admin.singleUser.replace(':id', user.id);
            const updatedEventRef = [...user.eventRef, data.eventId];
            toast(`Assigning event to ${user.firstname}`);
            const post = await axios.patch(
                url,
                JSON.stringify({ eventRef: updatedEventRef }),
                {
                    headers: {
                        Authorization: `Bearer ${actor.token}`,
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    }
                }
            );
            if (post.status === 200) {
                toast(<span>Event successfully assigned to {user.firstname}.</span>);
                createdEvent && setPageData('page_activity', { newEvent: createdEvent });
                // return location.reload();
                return true;
            }
            toggleDialogOpenState();
        } catch (error) {
            toast('Unable to attach event');
            console.error(error);
            return false;
        }
    }

    return (
        <>
            <Modal title="Create Event"
                open={isDialogOpen}
                onOpenChange={toggleDialogOpenState}
                displayText={<Button variant={variant || 'default'} type="button" className={cn(className)} {...props}>
                    {children || 'Create Event'}
                    <MdEditCalendar size={18} /></Button>
                }
                content={<EventForm actor={actor} onSuccess={handleSuccess} />}
                onSave={handleSave}
                onClose={handleClose}
            />
        </>
    )
}

export default CreateEventForUser;