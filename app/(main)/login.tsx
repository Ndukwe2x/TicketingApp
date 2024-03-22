import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AppLogo } from '@/components/app-logo';
import AuthLayout from '../auth/layout';
import { LoginForm } from '../auth/login/login-form';

export default function login() {
    return (
        <AuthLayout>
            <LoginForm />
        </AuthLayout>
    );
}
