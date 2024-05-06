import React from "react";
import Modal from "../ui/modal";
import { User } from "@/lib/logged-user";
import Link from "next/link";
import { MdPersonAdd } from "react-icons/md";
import CreateUserForm from "../dashboard/create-user-form";
// import from '@/components/styles/styles.module.css';

const CreateUserButton = () => {
    const user = User;
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
    
    const btnText = user.isOwner
        ? 'Create New User'
        : 'Add Team Member'

    return (
        <>
            <Modal title="Create New User" 
                displayText={ <Link href={'#'} className='border border-primary flex flex-row hover:bg-primary 
                hover:text-primary-foreground items-end gap-1.5 py-1 md:py-2 px-1 md:px-2 lg:px-4 rounded-full text-primary'>
                    <MdPersonAdd size={24}/> <span className="hidden lg:inline">{ btnText }</span>
                    </Link> } 
                description={ <CreateUserForm user={ user } /> } 
                onSave={ handleSave } 
                onClose={ handleClose }
                style={ { maxWidth: '45rem' } } />
        </>
    )
}

export default CreateUserButton;