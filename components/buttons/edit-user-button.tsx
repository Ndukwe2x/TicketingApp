import React, { HtmlHTMLAttributes } from "react";
import Modal from "../ui/modal";
import { MdEdit } from "react-icons/md";
import UserForm from "../dashboard/user-form";
import { toast } from "../ui/sonner";
import { Button } from "../ui/button";
import { Api } from "@/lib/api";
import { useGetUserById } from "@/hooks/useGetUsers";
import { cn } from "@/lib/utils";
import UserClass from "@/lib/User.class";

interface EditButtonProps extends HtmlHTMLAttributes<HTMLButtonElement> {
    userId: string;
    actor: AppUser;
    variant?: any;
}
const EditUserButton: React.FC<EditButtonProps> = ({ children, className, userId, actor, variant, ...props }) => {
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    const formAction = Api.server + Api.endpoints.admin.singleUser.replace(':id', userId);
    const [isLoading, user] = useGetUserById(userId, actor);

    const handleClose = () => {
        setIsDialogOpen(false);
    }

    const handleSave = () => {
        setIsDialogOpen(false);
    }

    const btn = <Button variant={variant || 'default'} type="button" className={cn(className)} {...props}>
        {children || <>Edit User <MdEdit size={18} className="ml-2" /></>}
    </Button>;


    const handleSuccess = (data: NewlyCreatedUserAccountData | AppUser) => {
        toast('User account updated!');
        setIsDialogOpen(state => !state);
        const userId: string = data instanceof UserClass ? data.id : data.userId;

        location.assign('/users/' + (userId));
    };

    const handleFailure = (error: any) => {

    }

    const content = <UserForm actor={actor}
        onSuccess={handleSuccess}
        onFailure={handleFailure}
        isNew={false}
        action={formAction}
        account={user as AppUser} />;

    return (
        <>
            <Modal title='Edit User'
                displayText={btn}
                content={content}
                onSave={handleSave}
                onClose={handleClose}
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                style={{ maxWidth: '45rem' }} />
        </>
    )
}


export default EditUserButton;