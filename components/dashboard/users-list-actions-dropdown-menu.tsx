import useAuthenticatedUser from "@/hooks/useAuthenticatedUser";
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import CreateEventForUser from "../buttons/create-event-for-user";
import EditUserButton from "../buttons/edit-user-button";
import DeleteUserButton from "../buttons/delete-user-button";
import Link from "next/link";
import { DotsVerticalIcon } from '@radix-ui/react-icons';
import { MdClose, MdPerson } from "react-icons/md";
import { HTMLAttributes, useState } from "react";


interface UsersListActionsMenuProps extends HTMLAttributes<HTMLDivElement> {
    user: AppUser;
    onBeforeAction?(action: string): boolean;
    onActionSuccess?(data: any, action: string): void;
    onActionFailure?(action: string, error?: Error | unknown): void;
}
export default function UsersListActionsDropdownMenu({
    user,
    onBeforeAction,
    onActionSuccess,
    onActionFailure,
    ...props
}: UsersListActionsMenuProps) {
    const actor = useAuthenticatedUser() as AppUser;
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div {...props}>
            <DropdownMenu onOpenChange={setIsOpen} open={isOpen}>
                <DropdownMenuTrigger asChild>
                    <Button variant='ghost' className='h-8 w-8 p-0'>
                        <span className='sr-only'>Open menu</span>
                        <DotsVerticalIcon className='h-4 w-4' />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end'>
                    <DropdownMenuLabel>
                        <div className="flex justify-between items-center">
                            <span>Actions</span>
                            <Button variant={null} className="px-1 py-1 h-auto hover:bg-secondary" title="Cancel"
                                onClick={() => setIsOpen(false)}><MdClose /></Button>
                        </div>
                    </DropdownMenuLabel>
                    <Link href={'/users/' + user.id} className='flex gap-6 hover:bg-accent items-center justify-between p-1.5 rounded-sm w-full'>Profile <MdPerson size={18} /></Link>

                    {actor && actor.canCreateEvent && <CreateEventForUser variant={null} actor={actor} user={user}
                        className='flex gap-6 bg-transparent shadow-none text-foreground hover:bg-accent items-center justify-between p-1.5 rounded-sm w-full' />}


                    {actor && actor.canUpdateUser && <EditUserButton variant={null} actor={actor} userId={user.id}
                        className='flex gap-6 bg-transparent shadow-none text-foreground hover:bg-accent items-center justify-between p-1.5 rounded-sm w-full' />}

                    <DropdownMenuSeparator />

                    {actor && actor.canDeleteUser && <DeleteUserButton
                        variant={null}
                        actor={actor}
                        account={user}
                        onInit={() => (onBeforeAction && onBeforeAction('delete')) as boolean}
                        onSuccess={(data) => { onActionSuccess && onActionSuccess(data, 'delete'); setIsOpen(false) }}
                        onFailure={(error) => onActionFailure && onActionFailure('delete', error)}
                        className='flex gap-6 bg-transparent hover:bg-accent items-center justify-between p-1.5 shadow-none w-full text-destructive' />}

                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}