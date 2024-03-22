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
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { AppLogo } from './app-logo';
import { Cart } from './cart';

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
            <div className='flex items-center justify-between p-4 max-w-7xl mx-auto'>
                <div className='flex items-center gap-4'>
                    <MobileNav />

                    <Link href='/'>
                        <AppLogo />
                    </Link>

                    <DesktopNav />
                </div>

                <UserNav />
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

function UserNav() {
    return (
        <div className='flex items-center space-x-4'>
            <Cart />
            <Link href='/auth/login' className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 h-9 px-4 py-2">
                Login
            </Link>
            <Link href='/auth/register' className='hidden md:block'>
                Register
            </Link>
        </div>
    );
}
