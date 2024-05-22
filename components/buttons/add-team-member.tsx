import React from "react";
import Modal from "../ui/modal";
import { User } from "@/lib/logged-user";
import Link from "next/link";
import { MdPersonAdd } from "react-icons/md";
import UserForm from "../dashboard/user-form";
import { toast } from "../ui/sonner";
import { useRouter } from "next/navigation";
// import from '@/components/styles/styles.module.css';

const CreateUserButton = () => {
    const user = User;
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    const router = useRouter();

    // const initDialog = () => {
    //     setIsDialogOpen(true);
    // }

    const handleClose = () => {
        setIsDialogOpen(false);
    }

    const handleSave = () => {
        setIsDialogOpen(false);
    }
    
    const btnText = user.isOwner
        ? 'Add New User'
        : 'Add Team Member'

    const link = <Link href={'#'} 
    className='border border-primary flex flex-row hover:bg-primary 
    hover:text-primary-foreground items-end gap-1.5 py-1 md:py-2 px-1 
    md:px-2 lg:px-4 rounded-full text-primary'>
        <MdPersonAdd size={24}/> <span className="hidden lg:inline">{ btnText }</span>
        </Link>;

    
    const handleSuccess = (data: NewlyCreatedUserAccountData) => {
        toast('User account created');
        setIsDialogOpen(state => !state);
        
        location.assign('/users/' + data.userId);
    };

    const handleFailure = (error: unknown) => {

    }
    
    const content = <UserForm actor={ user } 
        onSuccess={ handleSuccess }
        onFailure={ handleFailure } />;

    return (
        <>
            <Modal title={ btnText } 
                displayText={ link } 
                content={ content } 
                onSave={ handleSave } 
                onClose={ handleClose }
                open={ isDialogOpen }
                onOpenChange={setIsDialogOpen}
                style={ { maxWidth: '45rem' } } />
        </>
    )
}


export default CreateUserButton;