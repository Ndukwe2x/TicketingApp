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
import { MdAccountCircle, MdArrowDropDown, MdImage, MdVerifiedUser } from "react-icons/md";
import { DropdownMenuLabel, DropdownMenuSeparator } from "@radix-ui/react-dropdown-menu";
import { Session } from "@/lib/session";


export const NavbarUserDashboard = () => {
    const isAuthenticated = User ? true : false;
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
    const user = User;
    
    return (
        <DropdownMenuGroup className="flex items-center">
            <DropdownMenu>
                <DropdownMenuTrigger className="outline-none">
                    <span className="active-user flex gap-2 items-center">
                        <MdAccountCircle size={40} className="text-primary" />
                    </span>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel className="px-3 py-2">
                        <span className="hidden md:inline">{ user.email }</span> 
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="border-b" />
                    <DropdownMenuItem>
                        <Link href='/user/profile'>
                            Profile
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Link href='/logout' onClick={ (ev) => Session.logout(ev) }>
                            Logout
                        </Link>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </DropdownMenuGroup>
    )
}

