import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Text } from '@/components/ui/text';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

export default function ContactUs() {
    return (
        <div className='grid lg:grid-cols-2 gap-10'>
            <Text variant='h1'>Get in touch with a representative.</Text>
            <div>
                <form className='grid w-full max-w-sm items-center gap-4'>
                    <Input type='email' id='email' placeholder='Email' />
                    <Input type='text' id='name' placeholder='Name' />
                    <Input type='text' id='phone' placeholder='Phone' />
                    <Input type='text' id='company' placeholder='Company Name' />
                    <Textarea
                        placeholder='Message'
                        id='message'
                        name='message'
                        rows={4}
                        className='w-full p-3 border border-gray-300 rounded-md'
                    />
                </form>
                <Button className='mt-5 w-full md:w-fit'>Send Message</Button>
            </div>
        </div>
    );
}
