"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AppLogo } from '@/components/app-logo';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
// import useAuthenticatedUser from '@/hooks/useAuthenticatedUser';
import UserClass from '@/lib/User.class';

export default function AuthLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    // const [processing, setProcessing] = React.useState(true);

    // useAuthenticatedUser(authUser => {
    //     if ( authUser instanceof UserClass ) {
    //         window.location.assign('/');
    //     } else {
    //         setProcessing(false);
    //     }
    // });

    return (
        <div className='relative h-dvh overflow-hidden justify-center grid lg:max-w-none lg:grid-cols-2'>
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
                        <AppLogo color='white' shadow='dark' />
                    </Link>
                </div>
                <div className='relative z-20 mt-auto'>
                    <blockquote className='space-y-2'>
                        <p className='text-lg'>{/*quote*/}</p>
                        <footer className='text-sm'></footer>
                    </blockquote>
                </div>
            </div>
            <div className='overflow-y-auto '>
                <div className='flex flex-col gap-10 py-10 container lg:px-0'>
                    <div className='w-full mb-10 lg:hidden z-20'>
                        <Link href='/'>
                            <AppLogo />
                        </Link>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
