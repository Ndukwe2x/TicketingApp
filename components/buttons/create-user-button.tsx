"use client";

import React from "react";
import Modal from "../ui/modal";
import { MdPersonAdd } from "react-icons/md";
import UserForm from "../dashboard/user-form";
import { toast } from "../ui/sonner";
import useAuthenticatedUser from "@/hooks/useAuthenticatedUser";
import { Skeleton } from "../ui/skeleton";

const CreateUserButton = ({ displayText }: { displayText?: string | React.ReactNode }) => {
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    const actor = useAuthenticatedUser();

    // const initDialog = () => {
    //     setIsDialogOpen(true);
    // }

    const handleClose = () => {
        setIsDialogOpen(false);
    }

    const handleSave = () => {
        setIsDialogOpen(false);
    }

    const btnText = actor?.isOwner
        ? 'Add New User'
        : 'Add Team Member'



    const handleSuccess = (data: NewlyCreatedUserAccountData) => {
        toast('User account created');
        setIsDialogOpen(state => !state);

        location.assign('/users/' + data.userId);
    };

    const handleFailure = (error: any) => {

    }

    displayText = displayText || <a href={'#'}
        className='border border-primary flex flex-row hover:bg-primary 
        hover:text-primary-foreground items-end gap-1.5 py-1 md:py-2 px-1 
        md:px-2 lg:px-4 rounded-full text-primary'>
        <MdPersonAdd size={24} /> <span className="hidden lg:inline">{btnText}</span>
    </a>;

    return (
        actor ? (
            <Modal title={btnText}
                displayText={displayText}
                content={<UserForm onSuccess={handleSuccess} onFailure={handleFailure} />}
                onSave={handleSave}
                onClose={handleClose}
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                style={{ maxWidth: '45rem' }} />
        ) : (
            <Skeleton className="h-10 rounded-full" />
        )
    )
}


export default CreateUserButton;