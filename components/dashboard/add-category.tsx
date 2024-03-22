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
import { MdSettings } from 'react-icons/md';
import { Textarea } from '@/components/ui/textarea';

export function AddCategory() {
    return (
        <Dialog>
            <DialogTrigger>
                <MdSettings />
            </DialogTrigger>
            <DialogContent className='sm:max-w-md'>
                <DialogHeader>
                    <DialogTitle>Add Ticket Category</DialogTitle>
                </DialogHeader>
                <div className='flex flex-col gap-4 py-4'>
                    <div className='flex flex-col gap-2'>
                        <Label htmlFor='title'>Title</Label>
                        <Input id='title' placeholder='Category Title' />
                    </div>
                    <div className='flex gap-4'>
                        <div className='flex flex-col gap-2'>
                            <Label>No. of Persons</Label>
                            <Input type='number' placeholder='10' />
                        </div>
                        <div className='flex flex-col gap-2'>
                            <Label>Price</Label>
                            <Input placeholder='1000' />
                        </div>
                    </div>
                    <div className='flex flex-col gap-2'>
                        <Label>Description</Label>
                        <Textarea placeholder='About this category' />
                    </div>
                </div>
                <DialogFooter>
                    <Button type='submit'>Save Category</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
