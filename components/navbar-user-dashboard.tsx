"use client";

import { usePathname, useRouter } from "next/navigation";
import { deleteCookie } from "cookies-next";
import { 
    DropdownMenuGroup, 
    DropdownMenu, 
    DropdownMenuItem, 
    DropdownMenuTrigger, 
    DropdownMenuContent
} from '@/components/ui/dropdown-menu';

import Link from "next/link";
import Image from "next/image";
import { User } from "@/lib/logged-user";
import { APPCONFIG } from "@/lib/app-config";
import { MdArrowDropDown } from "react-icons/md";

export const NavbarUserDashboard = () => {
    const isAuthenticated = User() ? true : false;
    const router = useRouter();

    return (
        isAuthenticated 
            ? <ActiveUserDropdown router={router} />
            : <AuthActions />
    )
}



function AuthActions() {
    return (
        <div className='flex items-center space-x-4'>
            <Link href='/login' className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 h-9 px-4 py-2">
                Login
            </Link>
            <Link href='/register' className='hidden md:block'>
                Register
            </Link>
        </div>
    );
}

function ActiveUserDropdown() {
    const user = User();
    
    return (
        <DropdownMenuGroup>
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <span className="active-user flex gap-2 items-center">{ user.user.userEmail } <MdArrowDropDown /> </span>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem>
                        <Link href='/user/profile' className='hidden md:block'>
                            Profile
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Link href='/auth/logout' className='hidden md:block'>
                            Logout
                        </Link>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </DropdownMenuGroup>
    )
}