import { ReactElement, ReactNode } from "react";
import { 
    DropdownMenuGroup, 
    DropdownMenu, 
    DropdownMenuItem, 
    DropdownMenuTrigger, 
    DropdownMenuContent
} from '@/components/ui/dropdown-menu';
import Link from "next/link";
import Image from "next/image";


interface DropdownProps {
    trigger: ReactNode|string;
    items: { title: string|ReactNode, uri: string, actions: {} }[];
}
const CommonDropdownMenu: React.FC<DropdownProps> = ({trigger, items}) => {

    return (
        <DropdownMenuGroup>
            <DropdownMenu>
                <DropdownMenuTrigger>
                    { trigger }
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    {
                        items.map((item, index) => {
                            return (
                                <DropdownMenuItem key={index} className="flex-column">
                                    <Link href={ item.uri } {...item.actions } className='md:block flex-1'>
                                        { item.title }
                                    </Link>
                                </DropdownMenuItem>
                            );
                        })
                    }
                </DropdownMenuContent>
            </DropdownMenu>
        </DropdownMenuGroup>
    )
}

export default CommonDropdownMenu;