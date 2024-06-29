import useAuthenticatedUser from "@/hooks/useAuthenticatedUser";
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import CreateEventForUser from "../buttons/create-event-for-user";
import EditUserButton from "../buttons/edit-user-button";
import DeleteUserButton from "../buttons/delete-user-button";
import Link from "next/link";
import { DotsVerticalIcon } from '@radix-ui/react-icons';
import { MdPerson } from "react-icons/md";

export default function UsersListActionsDropdownMenu({ user }: { user: AppUser }) {
    const actor = useAuthenticatedUser() as AppUser;
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant='ghost' className='h-8 w-8 p-0'>
                    <span className='sr-only'>Open menu</span>
                    <DotsVerticalIcon className='h-4 w-4' />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <Link href={'/users/' + user.id} className='flex gap-6 hover:bg-accent items-center justify-between p-1.5 rounded-sm w-full'>Profile <MdPerson size={18} /></Link>
                <CreateEventForUser variant={null} actor={actor} user={user} className='flex gap-6 text-foreground hover:bg-accent items-center justify-between p-1.5 rounded-sm w-full' />

                <EditUserButton variant={null} actor={actor} userId={user.id} className='flex gap-6 text-foreground hover:bg-accent items-center justify-between p-1.5 rounded-sm w-full' />
                <DropdownMenuSeparator />
                <DeleteUserButton actor={actor} account={user} className='flex gap-6 hover:bg-accent items-center justify-between p-1.5 rounded-sm w-full text-destructive' />

            </DropdownMenuContent>
        </DropdownMenu>
    );
}