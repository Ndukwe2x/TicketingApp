'use client';

import { cn } from '@/lib/utils';
import { ChevronRightIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useReducer } from 'react';
import { FaMoneyBills } from 'react-icons/fa6';
import { HiMiniUsers } from 'react-icons/hi2';
import { HiOfficeBuilding } from 'react-icons/hi';
import { MdEvent, MdHomeFilled } from 'react-icons/md';
import {User} from '@/lib/logged-user';

export const DashboardNav = () => {
    const user = User();
    const [open, toggleOpen] = useReducer((state) => !state, true);

    return (
        <div id='dashboard-navigation' className={cn('w-14 lg:w-48 transition-[width]', open ? 'lg:w-48 expanded' : 'lg:w-16 collapsed')}>
            <div className='fixed top-16'>
                <div
                    className='absolute top-10 -right-3 bg-white border p-1 rounded-full hidden lg:block cursor-pointer'
                    onClick={toggleOpen}
                >
                    <ChevronRightIcon
                        className={cn('w-4 h-4 transition-all', open && 'rotate-180')}
                    />
                </div>

                <nav className='pt-5 pr-2 lg:pr-7 border-r h-[90vh] flex flex-col gap-3'>
                    {
                        user && user.token && user.user.userStatus === 'owner'
                        ? displayMenu(ownerNavItems, open) 
                        : displayMenu(userNavItems, open)
                    }
                </nav>
            </div>
        </div>
    );
};

type NavItem = { title: string; href: string; icon: React.ReactNode };
const ownerNavItems: NavItem[] = [
    { title: 'Dashboard', href: '/', icon: <MdHomeFilled /> },
    { title: 'Events', href: '/events', icon: <MdEvent /> },
    { title: 'Users', href: '/users', icon: <HiMiniUsers /> },
    { title: 'Employees', href: '/users/employees', icon: <HiOfficeBuilding /> },
];

const userNavItems: NavItem[] = [
    { title: 'Dashboard', href: '/', icon: <MdHomeFilled /> },
    { title: 'My Events', href: '/events', icon: <MdEvent /> },
    { title: 'Tickets', href: '/tickets', icon: <FaMoneyBills /> },
    { title: 'Team', href: '/team', icon: <HiMiniUsers /> },
];

function displayMenu(menu: NavItem[], open: boolean) {
    const pathname = usePathname();

    return menu.map((item, index) => {
        const isActive = pathname === item.href;

        return (
            <Link key={index} href={item.href}>
                <div
                    className={cn(
                        'flex items-center px-3 lg:px-4 py-2 cursor-pointer rounded-lg text-muted-foreground font-semibold',
                        'hover:bg-primary hover:text-primary-foreground',
                        isActive && 'bg-primary text-primary-foreground'
                    )}
                >
                    <span className='text-lg'>{item.icon}</span>
                    <div
                        className={cn(
                            'text-sm hidden lg:block overflow-hidden transition-[width]',
                            open ? 'w-28' : 'w-0'
                        )}
                    >
                        <span className='pl-2'>{item.title}</span>
                    </div>
                </div>
            </Link>
        );
    });
}