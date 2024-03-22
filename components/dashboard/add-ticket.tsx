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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MdSettings } from 'react-icons/md';

export function AddTicket() {
    return (
        <Dialog>
            <DialogTrigger>
                <MdSettings />
            </DialogTrigger>
            <DialogContent className='sm:max-w-md'>
                <DialogHeader>
                    <DialogTitle>Add Ticket</DialogTitle>
                </DialogHeader>
                <div className='flex gap-4 py-4'>
                    <div className='flex flex-col gap-2'>
                        <Label htmlFor='quantity'>Quantity</Label>
                        <Input id='quantity' type='number' placeholder='10' />
                    </div>
                    <div className='flex flex-col gap-2'>
                        <Label>Category</Label>
                        <Select>
                            <SelectTrigger className='w-44'>
                                <SelectValue placeholder='Select' />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value='student'>Student</SelectItem>
                                <SelectItem value='regular'>Regular</SelectItem>
                                <SelectItem value='vip'>VIP</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button type='submit'>Save Ticket</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
