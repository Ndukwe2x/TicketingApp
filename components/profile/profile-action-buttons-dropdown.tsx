import { MdAccountCircle, MdArrowDropDown, MdPersonAdd } from "react-icons/md";
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuGroup, 
    DropdownMenuItem, 
    DropdownMenuLabel, 
    DropdownMenuSeparator, 
    DropdownMenuTrigger 
} from "../ui/dropdown-menu";
import Link from "next/link";
import { Session } from "@/lib/session";
import useAuthenticatedUser from "@/hooks/useAuthenticatedUser";
import EditUserButton from "../buttons/edit-user-button";
import DeleteUserButton from "../buttons/delete-user-button";
import CreateEventForUser from "../buttons/create-event-for-user";
import AddTeamMember from "../buttons/add-team-member";
import { Button } from "../ui/button";
import { ChevronDownIcon, DotsVerticalIcon } from "@radix-ui/react-icons";
import React, { HtmlHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { IoChevronDownCircleOutline, IoChevronDownOutline } from "react-icons/io5";

const ActionButtons: React.FC<HtmlHTMLAttributes<HTMLElement> & {user: AppUser | UserInfo}> = ({children, className, user, ...props}) => {
    const actor = useAuthenticatedUser();

    const displayText = <Link href='#' 
    className={ cn('flex flex-row hover:bg-accent', 
    'text-accent-foreground hover:text-primary items-center justify-between gap-1.5 py-2 px-4', 
    'md:px-4 lg:px-4 w-full')}>
            <span>Add Team Member</span><MdPersonAdd size={24}/>
        </Link>;
    
    return (
        <DropdownMenuGroup className={ cn("flex items-center", className) }>
            <DropdownMenu>
                <DropdownMenuTrigger className="outline-none">
                    <span className='sr-only'>Open menu</span>
                    <IoChevronDownOutline size={28} className='text-white' />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="md:hidden">
                    {
                        actor && actor.canUpdateUser && <EditUserButton variant="link" userId={user.id} actor={ actor } className="w-full text-accent-foreground hover:text-primary hover:bg-accent justify-between items-center" />
                    }
                    {
                        actor && actor.canDeleteUser && <DeleteUserButton variant='link' actor={ actor } account={ user } className="w-full text-accent-foreground hover:text-primary hover:bg-accent justify-between items-center" />
                    }
                    {
                        actor && actor.isSuperUser && <AddTeamMember displayText={ displayText } user={ actor } />
                    }
                    {
                        actor && actor.canCreateEvent && <CreateEventForUser variant='link' user={ user } actor={ actor } className="gap-2 w-full text-accent-foreground hover:text-primary hover:bg-accent justify-between items-center" />
                    }
                </DropdownMenuContent>
            </DropdownMenu>
        </DropdownMenuGroup>
    )
}

export default ActionButtons;