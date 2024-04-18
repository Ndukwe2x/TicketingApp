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

    return (
        <div id='dashboard-navigation' className={cn('transition-[width] lg:flex expanded')}>
            <div className='fixed top-16'>
                <nav className='py-8 px-4 lg:px-8 border-r h-[90vh] flex flex-col gap-3'>
                    {
                        user && user.token && user.user.userStatus === 'owner'
                        ? displayMenu(ownerNavItems) 
                        : displayMenu(userNavItems)
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
    { title: 'Tickets', href: '/tickets', icon: <FaMoneyBills /> },
    { title: 'Users', href: '/users', icon: <HiMiniUsers /> },
    // { title: 'Employees', href: '/users/employees', icon: <HiOfficeBuilding /> },
];

const userNavItems: NavItem[] = [
    { title: 'Dashboard', href: '/', icon: <MdHomeFilled /> },
    { title: 'My Events', href: '/events', icon: <MdEvent /> },
    { title: 'Tickets', href: '/tickets', icon: <FaMoneyBills /> },
    { title: 'Team', href: '/team', icon: <HiMiniUsers /> },
];

function displayMenu(menu: NavItem[]) {
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
                        className={cn('text-sm overflow-hidden transition-[width]')}>
                        <span className='pl-2 menu-text'>{item.title}</span>
                    </div>
                </div>
            </Link>
        );
    });
}