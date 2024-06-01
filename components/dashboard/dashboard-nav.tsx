"use client";

import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useReducer } from 'react';
import { FaMoneyBills } from 'react-icons/fa6';
import { HiMiniUsers } from 'react-icons/hi2';
import { MdAddBox, MdEvent, MdHomeFilled } from 'react-icons/md';
import useDeviceViewPort from '@/hooks/useDeviceViewPort';
import CreateEventButton from '../buttons/create-event-button';
import CreateUserButton from '../buttons/create-user-button';
import AddTeamMember from '../buttons/add-team-member';
import useAuthenticatedUser from '@/hooks/useAuthenticatedUser';

export const DashboardNav = () => {
    const actor = useAuthenticatedUser();
    const viewPort = useDeviceViewPort();
    // const [state, setState] = React.useState('collapsed');
    let state = 'collapsed';
    if (viewPort && viewPort?.deviceWidth && viewPort?.deviceWidth > 1200) {
        // setState('expanded');
        state = 'expanded';
    }
    // Testing...
    return (
        <div id='dashboard-navigation' className={cn(`transition-[width] lg:flex ${state}`)}>
            <div className='fixed top-16'>
                <nav className='py-8 px-4 lg:px-8 border-r h-[90vh] flex flex-col gap-3'>
                    <ul className='menu'>
                        {
                            actor && actor.isOwner
                            ? <OwnerMenu actor={ actor } /> 
                            : <UserMenu actor={ actor } />
                        }
                    </ul>
                </nav>
            </div>
        </div>
    );
};

type NavItem = { 
    title: string; 
    href: string; 
    icon: React.ReactNode, 
    addon?: React.ReactNode; 
    submenu?: unknown[] | React.ReactNode; 
};

function MenuBuilder(menu: NavItem[]) {
    const pathname = usePathname();

    return menu.map((item, index) => {
        const isActive = pathname === item.href;
        
        return (
            <li key={ index } className={ cn(
                'hover:bg-primary hover:text-primary-foreground rounded-lg text-muted-foreground my-2',
                isActive && 'bg-primary text-primary-foreground', 
                item.addon ? 'has-addon ' : '', 
                item.submenu ? 'has-submenu' : '') }>
                <Link href={item.href}>
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
                    (item.addon) && <div className='menu-addon hidden xl:block'>{ item.addon }</div>
                }
                {
                    (item.submenu) && (
                        (React.isValidElement(item.submenu) && item.submenu) ||
                        item.submenu instanceof Array && <ul>{ MenuBuilder(item.submenu as NavItem[]) }</ul>
                    )
                }
            </li>
        );
    });
}


const OwnerMenu = ({actor}: {actor: AppUser}) => {

    const menuItems: NavItem[] = [
        { title: 'Dashboard', href: '/', icon: <MdHomeFilled /> },
        { 
            title: 'Events', 
            href: '/events', 
            icon: <MdEvent />,
            addon: actor?.canCreateEvent ? <CreateEventButton displayText={
                <Link href='#' >
                    <span className='sr-only'>Create Event</span><MdAddBox size={26} />
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
            addon: actor?.canCreateUser ? <CreateUserButton displayText={
                <Link href='#' >
                    <span className='sr-only'>Add New User</span><MdAddBox size={26} />
                </Link>
            } /> : null
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

const UserMenu = ({actor}: {actor: AppUser}) => {

    const menuItems: NavItem[] = [
        { title: 'Dashboard', href: '/', icon: <MdHomeFilled /> },
        { 
            title: 'My Events', 
            href: '/events', 
            icon: <MdEvent />,
            addon: actor?.canCreateEvent ? <CreateEventButton displayText={
                <Link href='#'>
                    <span className='sr-only'>Create Event</span><MdAddBox size={26} />
                </Link>
            } /> : null
        },
        { title: 'Tickets', href: '/tickets', icon: <FaMoneyBills /> },
        { 
            title: 'Team', 
            href: '/team', 
            icon: <HiMiniUsers />,
            addon: actor?.isSuperUser ? <AddTeamMember displayText={
                <Link href='#'>
                    <span className='sr-only'>Add New Team Member</span><MdAddBox size={26} />
                </Link>
            } /> : null
        }
    ];

    return (
        <>
            {
                MenuBuilder(menuItems)
            }
        </>
    )
}