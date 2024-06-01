import React, { HtmlHTMLAttributes, MouseEvent, ReactHTMLElement } from "react"
import Modal from "../ui/modal";
import Link from "next/link";
import { MdEditCalendar, MdEvent } from "react-icons/md";
import EventForm from "../dashboard/event-form";
import styles from '@/components/styles/styles.module.css';
import { Button } from "../ui/button";
import axios, { AxiosResponse } from "axios";
import { Api } from "@/lib/api";
import { toast } from "../ui/sonner";

interface CreateButtonProps extends HtmlHTMLAttributes<HTMLButtonElement> {
    actor: AppUser; 
    user: AppUser; 
}
const CreateEventForUser: React.FC<CreateButtonProps> = ({children, className, actor, user, ...props }) => {
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);

    const initDialog = () => {
        setIsDialogOpen(true);
    }

    const handleClose = () => {
        setIsDialogOpen(false);
    }

    const handleSave = () => {
        setIsDialogOpen(false);
    }

    const handleSuccess = async (response: AxiosResponse) => {
        const data = response.data;
        // user.setProperty('eventRef', [data.eventId, ...user.eventRef]);
        const modUser = Object.defineProperty(user, 'eventRef', [data.eventId, ...user.eventRef]);
        const url = Api.server + Api.endpoints.admin.singleUser.replace(':id', modUser.id);

        try {
            const post = await axios.patch(url, { eventRef: modUser.eventRef }, {
                headers: {
                    Authorization: `Bearer ${actor.token}`
                }
            });
            if (post.status === 200) {
                toast('Event added successfully.');
            }
        } catch (error) {
            toast('Unable to attach event');
            console.error(error);
        }
    }

    return (
        <>
            <Modal title="Create Event" 
                displayText={ <Button type="button" className={ className } { ...props }>
                    { children || 'Create Event' }
                    <MdEditCalendar size={18} /></Button> 
                } 
                content={ <EventForm actor={actor}  onSuccess={handleSuccess} /> } 
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

export default CreateEventForUser;