"use client";

import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { ReactNode, useReducer, useState } from 'react';
import { FaMoneyBills } from 'react-icons/fa6';
import { HiMiniUsers } from 'react-icons/hi2';
import { MdAddBox, MdEditCalendar, MdEvent, MdHomeFilled, MdPersonAdd } from 'react-icons/md';
import useDeviceViewPort from '@/hooks/useDeviceViewPort';
import CreateEventButton from '../buttons/create-event-button';
import CreateUserButton from '../buttons/create-user-button';
import AddTeamMember from '../buttons/add-team-member';
import useAuthenticatedUser from '@/hooks/useAuthenticatedUser';
import { Button } from '../ui/button';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { Skeleton } from '../ui/skeleton';

export const DashboardNav = () => {
    const actor = useAuthenticatedUser();
    const viewPort = useDeviceViewPort();
    let state = '';
    if (viewPort && viewPort?.deviceWidth && viewPort?.deviceWidth > 1024) {
        state = 'expanded';
    }
    // Testing...
    return (
        <div id='dashboard-navigation' className={cn(`transition-[width] lg:flex`, state)}>
            <div className='fixed top-offset bottom-0'>
                <nav className='py-8 px-4 lg:px-8 flex flex-col gap-3 h-full overflow-y-auto mini-scrollbar bg-white'>
                    <ul className='menu w-full'>
                        {
                            actor ? (
                                actor.isOwner
                                    ? (<OwnerMenu actor={actor as AppUser} />)
                                    : (<UserMenu actor={actor as AppUser} />)
                            ) : (
                                <>
                                    <li className='mb-2'><Skeleton className='w-full h-9' /></li>
                                    <li className='mb-2'><Skeleton className='w-full h-9' /></li>
                                    <li className='mb-2'><Skeleton className='w-full h-9' /></li>
                                    <li className='mb-2'><Skeleton className='w-full h-9' /></li>
                                </>
                            )
                        }
                    </ul>
                </nav>
            </div>
        </div>
    );
};

type NavItem = {
    title: string | ReactNode;
    href?: string;
    icon?: React.ReactNode,
    addon?: React.ReactNode;
    submenu?: NavItem[] | React.ReactNode;
};

function MenuBuilder(menu: NavItem[]) {

    return menu.map((item, index) => (<MenuItem key={index} item={item} index={index} />));
}

const MenuItem = ({ item, index }: { item: NavItem, index: number }) => {
    const pathname = usePathname();
    const isActive = pathname === item.href;
    const [isOpen, toggleOpen] = useReducer(state => !state, false);

    return (
        <li className={cn(
            'hover:bg-primary hover:text-primary-foreground rounded-lg text-muted-foreground my-2 overflow-hidden',
            isActive && 'bg-primary text-primary-foreground',
            item.addon ? 'has-addon ' : '',
            item.submenu ? 'has-submenu' : '',
            isOpen ? 'expanded' : '')}>
            <Link href={item.href as string}>
                <div
                    className={cn(
                        'flex items-center px-3 lg:px-4 py-2 cursor-pointer font-semibold'
                    )}
                >
                    <span className='text-lg'>{item.icon}</span>
                    <div
                        className={cn('text-sm overflow-hidden transition-[width]')}>
                        <span className='pl-2 menu-text'>{item.title}</span>
                    </div>
                </div>
            </Link>
            {
                (item.addon) && <div className='menu-addon hidden xl:block'>{item.addon}</div>
            }
            {
                (item.submenu) && <div className='menu-toggle hidden xl:flex items-center justify-between'>
                    <Button
                        variant={null} onClick={() => { toggleOpen() }}
                        className='px-1 h-auto my-auto py-0 ml-auto'>
                        {isOpen ? <FiChevronUp size={20} /> : <FiChevronDown size={20} />}
                    </Button>
                </div>
            }
            {
                (item.submenu) && (
                    React.isValidElement(item.submenu)
                        ? <div id={`db_menuitem_${index}_submenu`} className='submenu rounded-lg'>{item.submenu}</div>
                        : <ul id={`db_menuitem_${index}_submenu`} className='submenu rounded-lg'>{MenuBuilder(item.submenu as NavItem[])}</ul>
                )
            }
        </li>
    );
}


const OwnerMenu = ({ actor }: { actor: AppUser }) => {

    const menuItems: NavItem[] = [
        { title: 'Dashboard', href: '/', icon: <MdHomeFilled /> },
        {
            title: 'Events',
            href: '/events',
            icon: <MdEvent />,
            submenu: actor?.canCreateEvent ? <CreateEventButton displayText={
                <Link href='#' className='rounded-lg hover:bg-gray-400/40 cursor-pointer flex items-center lg:px-4 px-3 py-2'>
                    <MdEditCalendar size={20} className='mr-2 ml-4' /><span className='sr'>Create Event</span>
                </Link>
            } /> : null
        },
        {
            title: 'Tickets',
            href: '/tickets',
            icon: <FaMoneyBills />
        },
        {
            title: 'Users',
            href: '/users',
            icon: <HiMiniUsers />,
            // addon: <MdAddBox size={26} />,
            submenu: actor?.canCreateUser ? <CreateUserButton displayText={
                <Link href='#' className='rounded-lg hover:bg-gray-400/40 cursor-pointer flex items-center lg:px-4 px-3 py-2'>
                    <MdPersonAdd size={20} className='mr-2 ml-4' /><span className='sr' aria-description='Add New User'>Add New User</span>
                </Link>
            } /> : ''
        },
        // { title: 'Employees', href: '/users/employees', icon: <HiOfficeBuilding /> },
    ];

    return (
        <>
            {
                MenuBuilder(menuItems)
            }
        </>
    )
}

const UserMenu = ({ actor }: { actor: AppUser }) => {

    const menuItems: NavItem[] = [
        { title: 'Dashboard', href: '/', icon: <MdHomeFilled /> },
        {
            title: 'My Events',
            href: '/events',
            icon: <MdEvent />,
            submenu: actor?.canCreateEvent ? <CreateEventButton displayText={
                <Link href='#' className='rounded-lg hover:bg-gray-400/40 cursor-pointer flex items-center lg:px-4 px-3 py-2'>
                    <MdEditCalendar size={20} className='mr-2 ml-4' /><span className='sr'>Create Event</span>
                </Link>
            } /> : null
        },
        { title: 'Tickets', href: '/tickets', icon: <FaMoneyBills /> },
    ];

    if (actor?.isSuperUser) {
        menuItems.push(
            {
                title: 'Team',
                href: '/team',
                icon: <HiMiniUsers />,
                submenu: actor?.isSuperUser ? <AddTeamMember displayText={
                    <Link href='#' className='rounded-lg hover:bg-gray-400/40 cursor-pointer flex items-center lg:px-4 px-3 py-2'>
                        <MdPersonAdd size={20} className='mr-2 ml-4' /><span className='sr' aria-description='Add New Team Member'>Add New Team Member</span>
                    </Link>
                } /> : null
            }
        )
    }

    return (
        actor && MenuBuilder(menuItems)
    )
}
