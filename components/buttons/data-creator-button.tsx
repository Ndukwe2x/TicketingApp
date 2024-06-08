import { 
    DropdownMenuGroup, 
    DropdownMenu, 
    DropdownMenuItem, 
    DropdownMenuTrigger, 
    DropdownMenuContent
} from '@/components/ui/dropdown-menu';
import Image from 'next/image';
import Link from 'next/link';
import { Icons } from '../icons';
import CreateUserButton from './create-user-button';
import CreateEventButton from './create-event-button';
import useAuthenticatedUser from '@/hooks/useAuthenticatedUser';

const DataCreatorButton = () => {
    const actor = useAuthenticatedUser();

    return (
        <DropdownMenuGroup>
            <DropdownMenu>
                <DropdownMenuTrigger className='border border-primary flex flex-row hover:bg-primary 
                hover:text-primary-foreground items-end gap-1.5 py-1 md:py-2 px-1 md:px-2 lg:px-4 rounded-full text-primary'>
                    <Icons.plus width="24" height="24" /> 
                    <span className='hidden lg:inline'>Create</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent className='p-4 lg:hidden'>
                    <div className='flex items-center justify-between gap-4'>
                        { actor?.canCreateUser && <div><CreateUserButton /></div> }
                        { actor?.canCreateEvent && <div><CreateEventButton /></div> }
                    </div>
                </DropdownMenuContent>
            </DropdownMenu>
        </DropdownMenuGroup>
    )
}

export default DataCreatorButton;