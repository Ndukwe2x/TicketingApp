import React from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MdAdd } from 'react-icons/md';
import { Textarea } from '@/components/ui/textarea';

export function CreateTicket({eventRef}: {eventRef?: string}) {
    return (
        <Dialog>
            <DialogTrigger className='border flex flex-row hover:bg-accent items-center px-3 py-1 rounded-md shadow text-sm'>
                <MdAdd size={26} /> Add New Ticket
            </DialogTrigger>
            <DialogContent className='sm:max-w-md'>
                <DialogHeader>
                    <DialogTitle>Create Ticket</DialogTitle>
                </DialogHeader>
                <div className='flex flex-col gap-4 py-4'>
                    {eventRef && <Input type='hidden' name='eventRef' value={ eventRef } /> }
                    <div className='flex flex-col gap-2'>
                        <Label htmlFor='title'>Title</Label>
                        <Input id='title' name='title' placeholder='Ticket Title' />
                    </div>
                    <div className='flex flex-col gap-2'>
                        <Label htmlFor='description'>Description</Label>
                        <Textarea id='description' name='description' placeholder='About this category' />
                    </div>
                    <div className='flex gap-4'>
                        <div className='flex flex-col gap-2'>
                            <Label>No. of Persons</Label>
                            <Input type='number' name='no_of_persons' placeholder='10' />
                        </div>
                        <div className='flex flex-col gap-2'>
                            <Label>Price</Label>
                            <Input type='number' name='price' placeholder='1000' />
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button type='submit'>Save Ticket</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
