"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AppLogo } from '@/components/app-logo';
import { User } from '@/lib/logged-user';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

export default function AuthLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    
    const route = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isAuthenticated, setIsAuthenticated] = React.useState(false);

    React.useEffect(() => {
        const user = User;
        if (user) {
            setIsAuthenticated(true);
        }
    })
    
    if (!isAuthenticated) {
        return (
            <>
                <div className='container relative h-dvh overflow-hidden flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0'>
                    <div className='relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r'>
                        <div className='absolute inset-0'>
                            <Image
                                src='/showcase.jpg'
                                fill
                                objectFit='cover'
                                alt='Authentication'
                            />
                        </div>
                        <div className='relative z-20 flex items-center text-lg font-medium'>
                            <Link href='/'>
                                <AppLogo color='white' />
                            </Link>
                        </div>
                        <div className='relative z-20 mt-auto'>
                            <blockquote className='space-y-2'>
                                <p className='text-lg'>{/*quote*/}</p>
                                <footer className='text-sm'></footer>
                            </blockquote>
                        </div>
                    </div>

                    <div className='w-full absolute top-8 left-8 lg:hidden z-20'>
                        <Link href='/'>
                            <AppLogo />
                        </Link>
                    </div>
                    {children}
                </div>
            </>
        );
    } else {
        let path: string|null|URL|any = '/';
        if (searchParams.has('redir')) {
            path = searchParams.get('redir');
        }
        
        location.assign(path);
    }
}
