import { cn } from '@/lib/utils';
import { MainNav } from '@/components/main-nav';
import { APPCONFIG } from '@/lib/app-config';
import { Text } from '@/components/ui/text';
import { AppLogo } from '@/components/app-logo';
import { FaFacebook, FaInstagram, FaXTwitter } from 'react-icons/fa6';

export default function MainLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className={cn('relative min-h-screen flex flex-col justify-between pt-14')}>
            <MainNav />

            <div className='px-4 py-8 md:py-16 w-full max-w-7xl mx-auto'>
                {/*<div className='absolute -left-10 top-[15rem] md:top-[32rem] -z-[1] h-96 w-5/6 md:w-3/5 bg-primary/5 rounded-[84%_16%_45%_55%_/_72%_14%_86%_28%]' />*/}
                {children}
            </div>

            <footer className='w-full relative z-20 py-8 md:py-12 px-4 bg-foreground text-background text-sm'>
                <div className='max-w-7xl mx-auto flex gap-5 flex-wrap justify-between items-center'>
                    <div className='flex gap-4 items-center'>
                        <AppLogo />
                        <Text>
                            &copy; {(new Date()).getFullYear()} {APPCONFIG.title}. All rights reserved
                        </Text>
                    </div>
                    <div className='flex gap-5 items-center'>
                        <a href='#' className=''>
                            Privacy
                        </a>
                        <a href='#' className=''>
                            Terms
                        </a>

                        <div className='flex gap-5 items-center ml-5 text-lg'>
                            <FaXTwitter />
                            <FaInstagram />
                            <FaFacebook />
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
