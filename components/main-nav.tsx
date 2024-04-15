'use client';

import * as React from 'react';
import Link from 'next/link';

import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
} from '@/components/ui/navigation-menu';
import { Button } from '@/components/ui/button';

import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarTrigger,
} from '@/components/ui/menubar';
import { HamburgerMenuIcon } from '@radix-ui/react-icons';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { AppLogo } from './app-logo';
import { NavbarUserDashboard } from './navbar-user-dashboard';
import DataCreatorButton from './buttons/data-creator-button';
import CreateUserButton from './buttons/create-user';
import CreateEventButton from './buttons/create-event';

const components: { title: string; href: string }[] = [
    {
        title: 'Events',
        href: '/events',
    },
    {
        title: 'Contact Us',
        href: '/contact-us',
    },
    {
        title: 'FAQ',
        href: '/faq',
    },
    // {
    //     title: 'Dashboard',
    //     href: '/dashboard',
    // },
];

export function MainNav() {
    const [hasScrolled, setHasScrolled] = React.useState(false);

    React.useEffect(() => {
        const setScrollHandler = () => {
            const scroll = document.documentElement.scrollTop;
            scroll > 16 ? setHasScrolled(true) : setHasScrolled(false);
        };

        document.addEventListener('scroll', setScrollHandler);

        return () => {
            document.removeEventListener('scroll', setScrollHandler);
        };
    }, []);

    return (
        <nav
            className={cn(
                'fixed w-full top-0 left-0 z-10 transition-all duration-300 bg-background border-b',
                hasScrolled && 'shadow-md bg-background'
            )}
        >
            <div className='flex items-center justify-between p-4 px-8 mx-auto'>
                <div className='flex items-center gap-4'>
                    <Link href='/'>
                        <AppLogo />
                    </Link>
                </div>
                <div className='flex items-center gap-10'>
                    <div className='flex flex-row items-center gap-6'>
                        <CreateUserButton />
                        <CreateEventButton />
                    </div>
                    <NavbarUserDashboard />
                </div>
            </div>
        </nav>
    );
}

function MobileNav() {
    return (
        <div className='block md:hidden'>
            <Menubar>
                <MenubarMenu>
                    <MenubarTrigger className='p-1.5'>
                        <HamburgerMenuIcon />
                    </MenubarTrigger>
                    <MenubarContent>
                        {components.map((component) => (
                                <MenubarItem  key={component.href} href={component.href}>{component.title}</MenubarItem>
                        ))}
                    </MenubarContent>
                </MenubarMenu>
            </Menubar>
        </div>
    );
}

function DesktopNav() {
    const pathname = usePathname();

    return (
        <div className='hidden md:block'>
            <NavigationMenu>
                <NavigationMenuList>
                    {components.map((component) => {
                        const isActive = pathname.includes(component.href);

                        return (
                            <NavigationMenuItem key={component.href}>
                                <NavigationMenuLink
                                    href={component.href} passHref
                                    className={cn(
                                        'px-4 py-2 text-sm font-medium transition-colors text-muted-foreground hover:text-primary',
                                        isActive && 'text-primary'
                                    )}
                                >
                                    {component.title}
                                </NavigationMenuLink>
                                {/* <Link href={component.href} passHref>
                                    
                                </Link> */}
                            </NavigationMenuItem>
                        );
                    })}
                </NavigationMenuList>
            </NavigationMenu>
        </div>
    );
}

