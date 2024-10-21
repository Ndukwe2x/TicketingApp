import React, { HtmlHTMLAttributes, memo } from "react";
import { Text } from "../ui/text";
import { Button } from "../ui/button";
import { useGetUserById } from "@/hooks/useGetUsers";
import EditUserButton from "../buttons/edit-user-button";
import DeleteUserButton from "../buttons/delete-user-button";
import CreateEventForUser from "../buttons/create-event-for-user";
import useAuthenticatedUser from "@/hooks/useAuthenticatedUser";
import ActionButtons from "./profile-action-buttons-dropdown";
import AddTeamMember from "../buttons/add-team-member";


interface CompProps {
    account: AppUser | UserInfo;
}
const ProfileHeader: React.FC<React.HTMLAttributes<HTMLDivElement> & CompProps> = ({ children, account, ...props }) => {

    const actor = useAuthenticatedUser();
    // const [isLoading, user] = useGetUserById(userId, actor as AppUser);
    const handleAfterDelete = (deletedUserId: string) => {
        // let t = toast('Account deleted successfully');
        // if (t) location.assign('/users');
    }
    // let account: AppUser | UserInfo | null;

    // if (actor && actor.id === userId) {
    //     account = actor;
    // } else {
    //     account = user;
    // }

    return (
        account &&
        <>
            <div className="account-name flex justify-between items-center mb-4">
                <Text variant='h1' className='text-white'>{account?.firstname + ' ' + account?.lastname}</Text>
                <div className="hidden md:flex gap-4">
                    {
                        actor && actor.canUpdateUser && <EditUserButton variant="outline" user={account as AppUser | UserInfo} actor={actor} />
                    }
                    {
                        actor && actor.canDeleteUser && <DeleteUserButton variant='destructive' actor={actor} account={account as AppUser} onSuccess={handleAfterDelete} />
                    }
                </div>
                <div className="md:hidden">
                    <ActionButtons user={account as AppUser} />
                </div>
            </div>
            <div className='action-btns hidden md:flex'>
                {
                    actor && actor.isSuperUser && actor.id == account.id && <AddTeamMember user={actor} />
                }
                {
                    actor && actor.canCreateEvent && <CreateEventForUser user={account as AppUser} actor={actor} className="gap-2" />
                }
            </div>
        </>
    )
}

export default memo(ProfileHeader);