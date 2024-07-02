"use client";

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
import { NavbarUserDashboard } from './navbar-user-dashboard';
import CreateUserButton from './buttons/create-user-button';
import CreateEventButton from './buttons/create-event-button';
import { MdOutlineMenu, MdOutlineMenuOpen, MdPersonAdd } from 'react-icons/md';
import DataCreatorButton from './buttons/data-creator-button';
import { ToggleSidebar } from '@/lib/sidebar-toggle';
import useAuthenticatedUser from '@/hooks/useAuthenticatedUser';
import AddTeamMember from './buttons/add-team-member';
import { Skeleton } from './ui/skeleton';

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
interface NavProps extends React.HtmlHTMLAttributes<HTMLElement> {

};

const MainNav: React.FC<NavProps> = ({ children, className, ...props }) => {
    const [hasScrolled, setHasScrolled] = React.useState(false);
    const [deviceWidth, setDeviceWidth] = React.useState<any>(null);
    const [open, setOpen] = React.useState(false);
    const actor = useAuthenticatedUser();

    React.useEffect(() => {
        const handleResize = () => {
            const dWidth = window.innerWidth;
            if (dWidth >= 1200 || document.querySelector('#dashboard-navigation.expanded') != null) {
                setOpen(true);
            } else {
                setOpen(false);
            }
            setDeviceWidth(dWidth);
        }
        window.addEventListener('resize', handleResize);
        handleResize();

        const setScrollHandler = () => {
            const scroll = document.documentElement.scrollTop;
            scroll > 16 ? setHasScrolled(true) : setHasScrolled(false);
        };

        document.addEventListener('scroll', setScrollHandler);

        return () => {
            document.removeEventListener('scroll', setScrollHandler);
            window.removeEventListener('resize', handleResize);
        };
    }, []);


    return (
        <nav {...props} className={cn(
            'fixed w-full top-0 left-0 z-10 transition-all duration-300 bg-background border-b ' + className,
            hasScrolled && 'shadow-md bg-background'
        )}>
            <div className='flex items-center justify-between p-4 lg:px-8 mx-auto'>
                <div className='flex items-center gap-4'>
                    <Button size={'sm'}
                        onClick={() => { ToggleSidebar(); setOpen(state => state ? false : true) }}
                        className={cn('text-primary outline-none bg-transparent shadow-none border-none')} style={{ background: 'none' }}>
                        {!open && <MdOutlineMenu size={26} />}
                        {open && <MdOutlineMenuOpen size={26} />}
                    </Button>
                    <Link href='/'>
                        <AppLogo />
                    </Link>
                </div>
                <div className='flex flex-row items-center gap-3'>
                    {
                        (actor !== null && (actor.canCreateUser || actor.canCreateEvent)) ? (
                            <>
                                <div className='hidden lg:flex items-center gap-3'>
                                    {
                                        actor.isOwner && actor.canCreateUser
                                            ? <CreateUserButton />
                                            : <AddTeamMember user={actor} displayText={
                                                <Button variant='outline' className='rounded-full h-auto border-primary text-primary hover:text-white hover:bg-primary flex gap-2 items-center lg:px-4 md:px-2 md:py-2 px-1 py-1'>
                                                    <MdPersonAdd size={24} /> Add Team Member
                                                </Button>
                                            } />
                                    }
                                    {
                                        actor.canCreateEvent && <CreateEventButton />
                                    }
                                </div>
                                <div className='lg:hidden'><DataCreatorButton /></div>
                            </>
                        ) : (
                            <>
                                <Skeleton className="lg:hidden h-10 rounded-full" style={{ width: "2.5rem", height: "2.5rem" }} />
                                <Skeleton className="hidden lg:inline-block h-10 rounded-full" style={{ width: "10.8rem" }} />

                                <Skeleton className="hidden lg:inline-block h-10 rounded-full" style={{ width: "10.8rem" }} />
                                <Skeleton className="rounded-full" style={{ width: "2.5rem", height: "2.5rem" }} />
                            </>
                        )
                    }
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
                            <MenubarItem key={component.href}>{component.title}</MenubarItem>
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
                                    href={component.href}
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

export { MainNav };