'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';
import { Icons } from '@/components/icons';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Text, textVariants } from '@/components/ui/text';
import Link from 'next/link';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { Api, HttpRequest } from '@/lib/api';
import { Toaster } from '@/components/ui/sonner';

export function RegisterForm() {
    const router = useRouter();
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [isSuccess, setIsSuccess] = React.useState<boolean>(false);
    const url = Api.server + Api.endpoints.admin.register;
    const userData = {};

    const handleSubmit = async (ev: React.SyntheticEvent) => {
        ev.preventDefault();
        // if (!navigator.onLine) {
        //     return (<Toaster />)
        // }
        setIsLoading(true);

        const formData = new FormData(ev.target);
        
        formData.forEach((value, key) => {
            if (key.search(/name/)) {
                key.replace(/name/, 'Name');
            }
            userData[key] = value;
        });

        try {
            const response = await HttpRequest(url, 'POST', userData);
        
            if (response.ok) {
                response.json().then((data) => {
                    localStorage.setItem('user', JSON.stringify(data));
                    setIsLoading(false);
                    setIsSuccess(true);
                });
                router.push('/');

            } else {
                // Failure feedback...
                setIsLoading(false);
            }
        } catch (error) {
            setIsLoading(false);
            console.error('Error logging in:', error);
            // return (<FormFeedback />);
        }
    }

    return (
        <div className={cn('grid gap-6')}>
            <form onSubmit={handleSubmit}>
                <div className='grid gap-4'>
                    <div className='grid gap-2'>
                        <Label className='sr-only' htmlFor='firstname'>
                            First Name:
                        </Label>
                        <Input
                            id='firstname'
                            name='firstName'
                            placeholder='First Name:'
                            type='text'
                            autoCapitalize='none'
                            autoComplete='firstName'
                            autoCorrect='off'
                            disabled={isLoading}
                        />
                        <Label className='sr-only' htmlFor='lastname'>
                            Last Name:
                        </Label>
                        <Input
                            id='lastname'
                            name='lastName'
                            placeholder='Last Name:'
                            type='text'
                            autoCapitalize='none'
                            autoComplete='lastName'
                            autoCorrect='off'
                            disabled={isLoading}
                        />
                        <Label className='sr-only' htmlFor='email'>
                            Email
                        </Label>
                        <Input
                            id='email'
                            name='email'
                            placeholder='Email:'
                            type='email'
                            autoCapitalize='none'
                            autoComplete='email'
                            autoCorrect='off'
                            disabled={isLoading}
                        />
                        <Label className='sr-only' htmlFor='phone'>
                            Phone
                        </Label>
                        <Input
                            id='phone'
                            name='phone'
                            placeholder='Phone:'
                            type='phone'
                            autoCapitalize='none'
                            autoComplete='phone'
                            autoCorrect='off'
                            disabled={isLoading}
                        />

                        <Label className='sr-only' htmlFor='password'>
                            Password
                        </Label>
                        <Input
                            id='password'
                            name='password'
                            placeholder='Password'
                            type='password'
                            autoCapitalize='none'
                            autoCorrect='off'
                            disabled={isLoading}
                        />
                    </div>
                    <Button disabled={isLoading}>
                        {isLoading && <><Icons.spinner className='mr-2 h-4 w-4 animate-spin' /> Loading...</>}
                        {isSuccess && <><Icons.userChecked className='mr-2 h-4 w-4 text-white' /> Successful</>}
                        { ! (isLoading || isSuccess) && <span>Sign Up</span> }
                    </Button>
                </div>
            </form>

            <div
                className={cn(
                    'flex items-center justify-center gap-1',
                    textVariants({ asLabel: true })
                )}
            >
                <Text>Already have an account?</Text>
                <Link href='/auth/login' className='text-primary underline'>
                    Login
                </Link>
            </div>

            {/*<div className='relative'>
                <div className='absolute inset-0 flex items-center'>
                    <span className='w-full border-t' />
                </div>
                <div className='relative flex justify-center text-xs uppercase'>
                    <span className='bg-background px-2 text-muted-foreground'>Or</span>
                </div>
            </div>
            <Button variant='outline' type='button' disabled={isLoading}>
                {isLoading ? (
                    <Icons.spinner className='mr-2 h-4 w-4 animate-spin' />
                ) : (
                    <FcGoogle className='mr-2 h-4 w-4' />
                )}{' '}
                Continue with Google
            </Button>*/}
        </div>
    );
}

