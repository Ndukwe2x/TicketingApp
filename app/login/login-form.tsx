'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';
import { Icons } from '@/components/icons';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useSearchParams } from 'next/navigation';
import { Api } from '@/lib/api';
import axios from 'axios';
import { Session } from '@/lib/session';
import { getAuthenticatedUserFullData } from '@/hooks/useGetUsers';
import { toast } from '@/components/ui/sonner';

export function LoginForm() {
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [isSuccess, setIsSuccess] = React.useState<boolean>(false);
    const [userId, setUserId] = React.useState<string>('');
    const [pass, setPass] = React.useState<string>('');
    const url = Api.server + Api.endpoints.admin.login;
    const searchParams = useSearchParams();

    const handleSubmit = async (event: React.SyntheticEvent) => {
        event.preventDefault();
        setIsLoading(true);

        try {
            const response = await axios.post(url, { email: userId, password: pass });
            if (response.status === 200) {
                const authData = response.data;
                let fullData: UserInfo = await getAuthenticatedUserFullData(authData.user.userEmail, authData.token) as UserInfo;
                if (!fullData.id) {
                    toast('Login failed. An internal error has occurred. Please try again.');
                    return;
                }
                fullData = { ...fullData, token: authData.token }
                Session.authenticate(fullData);
                toast('Login successful.');
                setIsLoading(false);
                setIsSuccess(true);
                let nextDestination = searchParams.get('redir');

                if (nextDestination) {
                    location.assign(nextDestination)
                } else {
                    location.assign('/');
                }
            }
        } catch (error: any) {
            setIsLoading(false);
            console.error('Error logging in:', error);
            if (error.code) {
                if (["ECONNABORTED", "ERR_NETWORK"].includes(error.code)) {
                    toast('Unable to login. It appears your connection was lost. Check your internet connectivity.');
                    return;
                }
            }
            toast('Error logging in! Please try again.');
        }
    }

    return (
        <React.Suspense fallback={<div className='text-center'>Loading...</div>}>
            <div className={cn('grid gap-6')}>
                {
                    searchParams.get('session_expired') &&
                    <div style={{ color: '#df0000', textAlign: 'center', fontSize: '90%' }}>Your session has expired. Please sign back in to continue.</div>
                }
                <form onSubmit={handleSubmit}>
                    <div className='grid gap-4'>
                        <div className='grid gap-2'>
                            <Label className='sr-only' htmlFor='email'>
                                Email
                            </Label>
                            <Input
                                id='email'
                                placeholder='Email or Phone'
                                type='email'
                                autoCapitalize='none'
                                autoComplete='email'
                                autoCorrect='off'
                                disabled={isLoading}
                                onChange={(ev) => setUserId(ev.target.value)}
                            />

                            <Label className='sr-only' htmlFor='email'>
                                Password
                            </Label>
                            <Input
                                id='password'
                                placeholder='Password'
                                type='password'
                                autoCapitalize='none'
                                autoCorrect='off'
                                disabled={isLoading}
                                onChange={(ev) => setPass(ev.target.value)}
                            />
                        </div>
                        <Button disabled={isLoading}>
                            {isLoading && <><Icons.spinner className='mr-2 h-4 w-4 animate-spin' /> Loading...</>}
                            {isSuccess && <><Icons.userChecked className='mr-2 h-4 w-4 text-white' /> Successful</>}
                            {!(isLoading || isSuccess) && <span>Sign In</span>}
                        </Button>
                    </div>
                </form>
            </div>
        </React.Suspense>
    );
}
