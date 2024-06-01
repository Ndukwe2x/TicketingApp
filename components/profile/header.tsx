import React, { HtmlHTMLAttributes, memo } from "react";
import { Text } from "../ui/text";
import { Button } from "../ui/button";
import { useGetUserById } from "@/hooks/useGetUsers";
import EditUserButton from "../buttons/edit-user-button";
import DeleteUserButton from "../buttons/delete-user-button";
import { toast } from "sonner";
import CreateEventForUser from "../buttons/create-event-for-user";
import useAuthenticatedUser from "@/hooks/useAuthenticatedUser";
import ActionButtons from "./profile-action-buttons-dropdown";
import AddTeamMember from "../buttons/add-team-member";


interface CompProps {
    userId: string;
}
const ProfileHeader: React.FC<React.HTMLAttributes<HTMLDivElement> & CompProps> = ({children, userId, ...props}) => {

    const actor = useAuthenticatedUser();
    const [isLoading, user] = useGetUserById(userId, actor);
    const handleAfterDelete = (deletedUserId: string) => {
        // let t = toast('Account deleted successfully');
        // if (t) location.assign('/users');
    }

    return (
        user &&
        <>
            <div className="account-name flex justify-between items-center mb-4">
                <Text variant='h1' className='text-white'>{ user?.firstname + ' ' + user?.lastname }</Text>
                <div className="hidden md:flex gap-4">
                    {
                        actor && actor.canUpdateUser && <EditUserButton variant="outline" userId={userId} actor={ actor } />
                    }
                    {
                        actor && actor.canDeleteUser && <DeleteUserButton variant='destructive' actor={ actor } account={ user } callback={ handleAfterDelete } />
                    }
                </div>
                <div className="md:hidden">
                    <ActionButtons user={ user } />
                </div>
            </div>
            <div className='action-btns hidden md:flex'>
                {
                    actor && actor.isSuperUser && actor.id == user.id && <AddTeamMember user={ actor } />
                }
                {
                    actor && actor.canCreateEvent && <CreateEventForUser user={ user } actor={ actor } className="gap-2" />
                }
            </div>
        </>
    )
}

export default memo( ProfileHeader );