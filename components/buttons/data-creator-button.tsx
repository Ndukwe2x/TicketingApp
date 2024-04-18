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

const DataCreatorButton = () => {

    return (
        <DropdownMenuGroup>
            <DropdownMenu>
                <DropdownMenuTrigger className='border border-primary flex flex-row hover:bg-primary 
                hover:text-primary-foreground items-end gap-1.5 py-1 md:py-2 px-1 md:px-2 lg:px-4 rounded-full text-primary'>
                    <Icons.plus width="24" height="24" /> 
                    <span className='hidden lg:inline'>Create</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent className='p-4'>
                    <div className='flex items-center justify-between gap-4'>
                        <div><CreateUserButton /></div>
                        <div><CreateEventButton /></div>
                    </div>
                </DropdownMenuContent>
            </DropdownMenu>
        </DropdownMenuGroup>
    )
}

export default DataCreatorButton;