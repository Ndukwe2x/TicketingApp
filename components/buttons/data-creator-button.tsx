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
import CreateUserButton from './create-user';
import CreateEventButton from './create-event';

const DataCreatorButton = () => {

    return (
        <DropdownMenuGroup>
            <DropdownMenu>
                <DropdownMenuTrigger className='border border-primary flex flex-row hover:bg-primary hover:text-primary-foreground items-center px-4 rounded-full text-primary'>
                    <Icons.plus width="40" height="40" /> Create
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem>
                        <CreateUserButton />
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <CreateEventButton />
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </DropdownMenuGroup>
    )
}

export default DataCreatorButton;