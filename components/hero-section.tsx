import React from 'react';
import { Input } from './ui/input';
import { BiSearch } from 'react-icons/bi';
import { Text } from './ui/text';

export function HeroSection() {
    return (
        <div className='absolute top-0 left-0 w-full h-[70dvh] bg-[url("/showcase.jpg")] bg-[50%_80%] bg-cover'>
            <div className='absolute top-0 left-0 w-full h-full bg-black/60' />
            <div className='relative flex flex-col gap-5 px-5 mt-10 md:mt-20 h-full justify-center'>
                <Text variant='h1' className='text-white text-center border-none pb-0'>
                    Discover Unforgettable Moments
                </Text>
                <Text variant='h4' className='text-white text-center'>
                    Find events happening near you
                </Text>

                <div className='max-w-lg mx-auto relative w-full'>
                    <Input
                        placeholder='Search for events'
                        className='w-full rounded-full h-14 pl-14 pb-1.5 border-white bg-white focus-visible:ring-0'
                    />
                    <BiSearch
                        size={20}
                        className='absolute top-1/2 left-6 -translate-y-1/2 text-black'
                    />
                </div>
            </div>
        </div>
    );
}
