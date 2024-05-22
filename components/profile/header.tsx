import React, { HtmlHTMLAttributes, memo } from "react";
import { Text } from "../ui/text";
import { Button } from "../ui/button";
import { User } from "@/lib/logged-user";
import { useGetUserById } from "@/hooks/useGetUsers";
import { MdEdit } from "react-icons/md";
import EditUserButton from "../buttons/edit-user-button";
import DeleteUserButton from "../buttons/delete-user-button";
import { toast } from "sonner";
import CreateEventForUser from "../buttons/create-event-for-user";


interface CompProps {
    userId: string;
}
const ProfileHeader: React.FC<React.HTMLAttributes<HTMLDivElement> & CompProps> = ({children, userId, ...props}) => {

    const actor = User;
    const [user] = useGetUserById(userId, actor);
    const handleAfterDelete = (deletedUserId: string) => {
        let t = toast('Account deleted successfully');
        if (t) location.assign('/users');
    }

    return (
        user &&
        <>
            <div className="account-name flex justify-between items-center">
                <Text variant='h1' className='text-white'>{ user?.firstname + ' ' + user?.lastname }</Text>
                <div className="flex gap-4">
                    {
                        actor && actor.canUpdateUser && <EditUserButton variant="outline" userId={userId} actor={ actor } />
                    }
                    {
                        actor && actor.canDeleteUser && <DeleteUserButton variant='destructive' actor={ actor } account={ user } callback={ handleAfterDelete } />
                    }
                </div>
            </div>
            <div className='action-btns flex gap-4'>
                {
                    actor && actor.isSuperUser && <Button>Add Team Member</Button>
                }
                {
                    actor && actor.canCreateEvent && <CreateEventForUser user={ user } actor={ actor } className="gap-2" />
                }
            </div>
        </>
    )
}

export default memo( ProfileHeader );