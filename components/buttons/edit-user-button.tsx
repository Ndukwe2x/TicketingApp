import React, { HtmlHTMLAttributes } from "react";
import Modal from "../ui/modal";
import { User } from "@/lib/logged-user";
import Link from "next/link";
import { MdEdit } from "react-icons/md";
import UserForm from "../dashboard/user-form";
import { toast } from "../ui/sonner";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { Api } from "@/lib/api";
import { useGetUserById } from "@/hooks/useGetUsers";
import UserClass from "@/lib/User.class";
import { cn } from "@/lib/utils";
// import from '@/components/styles/styles.module.css';

interface EditButtonProps extends HtmlHTMLAttributes<HTMLButtonElement> {
    userId: string;
    actor: AppUser;
}
const EditUserButton: React.FC<EditButtonProps> = ({children, className, userId, actor, ...props}) => {
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    const formAction = Api.server + Api.endpoints.admin.singleUser.replace(':id', userId);
    const [user] = useGetUserById(userId, actor);
    // const account = new UserClass(user);

    // const initDialog = () => {
    //     setIsDialogOpen(true);
    // }

    const handleClose = () => {
        setIsDialogOpen(false);
    }

    const handleSave = () => {
        setIsDialogOpen(false);
    }

    const btn = <Button type="button" className={ className } { ...props }>
        { children || <>Edit User <MdEdit size={ 18 } className="ml-2" /></> }
    </Button>;
    // <Link href={'#'} 
    // className='border border-primary flex flex-row hover:bg-primary 
    // hover:text-primary-foreground items-end gap-1.5 py-1 md:py-2 px-1 
    // md:px-2 lg:px-4 rounded-full text-primary'>
    //     <MdPersonAdd size={24}/> <span className="hidden lg:inline">{ btnText }</span>
    //     </Link>;

    
    const handleSuccess = (data: NewlyCreatedUserAccountData | AppUser) => {
        toast('User account updated!');
        setIsDialogOpen(state => !state);
        
        location.assign('/users/' + ( data.userId || data.id ));
    };

    const handleFailure = (error: unknown) => {

    }
    
    const content = <UserForm actor={ actor } 
        onSuccess={ handleSuccess }
        onFailure={ handleFailure }
        isNew={ false }
        action={ formAction }
        account={user} />;

    return (
        <>
            <Modal title='Edit User'
                displayText={ btn } 
                content={ content } 
                onSave={ handleSave } 
                onClose={ handleClose }
                open={ isDialogOpen }
                onOpenChange={setIsDialogOpen}
                style={ { maxWidth: '45rem' } } />
        </>
    )
}


export default EditUserButton;