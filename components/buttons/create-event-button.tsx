import React, { MouseEvent, ReactHTMLElement } from "react"
import Modal from "../ui/modal";
import Link from "next/link";
import { MdEvent } from "react-icons/md";
import CreateEventForm from "../create-event-form";
import styles from '@/components/styles/styles.module.css';

const CreateEventButton = () => {
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

    return (
        <>
            <Modal title="Create Event" 
                displayText={ <Link href={'#'}
                className={`bg-primary border border-primary flex flex-row gap-1.5 
                hover:bg-primary/90 items-end px-1 md:px-2 lg:px-4 py-1 md:py-2 rounded-full text-white`}>
                    <MdEvent size={24} />
                    <span className="hidden lg:inline">Create Event</span></Link> 
                } 
                content={ <CreateEventForm /> } 
                onSave={ handleSave } 
                onClose={ handleClose }
                style={ { maxWidth: '40rem' } } />
        </>
    )
}



// npm i @cloudinary/url-gen @cloudinary/react

// import {Cloudinary} from "@cloudinary/url-gen";

// const App = () => {
//   const cld = new Cloudinary({cloud: {cloudName: 'dtuznvywy'}});
// };

export default CreateEventButton;