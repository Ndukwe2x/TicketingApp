"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Session } from "@/lib/session";
import { 
    DropdownMenuGroup, 
    DropdownMenu, 
    DropdownMenuItem, 
    DropdownMenuTrigger, 
    DropdownMenuContent
} from '@/components/ui/dropdown-menu';

import Link from "next/link";
import Image from "next/image";

export const NavbarUserDashboard = () => {
    const isAuthenticated = Session.isAuthenticated();
    const router = useRouter();

    

    const logout = () => {
        localStorage.removeItem('user');
        router.push('./login')
    }

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

function ActiveUserDropdown({router}) {
    const logout = () => {
        localStorage.removeItem('user'); 
        router.push('./login')
    }
    return (
        <DropdownMenuGroup>
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <Image src={'/user/'} alt='User' width={45} height={45}/>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem>
                        <Link href='/user/profile' className='hidden md:block'>
                            Profile
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Link href='#' onClick={logout} className='hidden md:block'>
                            Logout
                        </Link>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </DropdownMenuGroup>
    )
}