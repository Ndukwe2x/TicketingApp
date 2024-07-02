// 'use client';

// import { IoBagHandle } from 'react-icons/io5';
// import { Button } from '@/components/ui/button';
// import { FiPlus, FiMinus } from 'react-icons/fi';
// import { HiXMark } from 'react-icons/hi2';
// import {
//     Sheet,
//     SheetClose,
//     SheetContent,
//     SheetFooter,
//     SheetHeader,
//     SheetTitle,
//     SheetTrigger,
// } from '@/components/ui/sheet';
// import {
//     Drawer,
//     DrawerClose,
//     DrawerContent,
//     DrawerFooter,
//     DrawerHeader,
//     DrawerTitle,
//     DrawerTrigger,
// } from '@/components/ui/drawer';
// import { useMediaQuery } from '@/hooks/useMediaQuery';
// import { getPublicEvents } from '@/hooks/getPublicEvents';
// import { Text } from './ui/text';
// import Image from 'next/image';
// import { formatCurrency } from '@/lib/utils';
// import { useState } from 'react';

// export const Cart = () => {
//     const isDesktop = useMediaQuery('(min-width: 768px)');
//     const init = getPublicEvents().events ?? [];
//     const events = init.slice(0, 3);
//     const total = events.reduce((acc, event) => acc + event.price, 0);

//     const content = (
//         <div className=''>
//             <div className='flex items-center justify-between my-4'>
//                 <Text variant='h4'>
//                     {events.length} {events.length === 1 ? 'item' : 'items'}
//                 </Text>
//                 <Button variant='ghost'>Clear all</Button>
//             </div>

//             <div className='overflow-y-auto max-h-[60dvh] grid gap-4 border-b pb-7 no-scrollbar'>
//                 {events.map((item) => (
//                     <CartItem key={item.id} {...item} />
//                 ))}
//             </div>

//             <div className='flex justify-between my-6'>
//                 <Text variant='h4'>Total price</Text>
//                 <Text variant='h4'>{formatCurrency(total)}</Text>
//             </div>
//         </div>
//     );

//     if (isDesktop) {
//         return (
//             <Sheet>
//                 <SheetTrigger asChild>
//                     <IoBagHandle className='w-6 h-6 cursor-pointer' />
//                 </SheetTrigger>
//                 <SheetContent>
//                     <SheetHeader>
//                         <SheetTitle>{cartConstants.title}</SheetTitle>
//                     </SheetHeader>
//                     {content}
//                     <SheetFooter className='justify-self-end'>
//                         <SheetClose asChild>
//                             <Button type='submit'>Checkout</Button>
//                         </SheetClose>
//                     </SheetFooter>
//                 </SheetContent>
//             </Sheet>
//         );
//     }
//     return (
//         <Drawer>
//             <DrawerTrigger>
//                 <IoBagHandle className='w-6 h-6 cursor-pointer' />
//             </DrawerTrigger>
//             <DrawerContent>
//                 <DrawerHeader>
//                     <DrawerTitle>{cartConstants.title}</DrawerTitle>
//                 </DrawerHeader>
//                 {content}
//                 <DrawerFooter>
//                     <DrawerClose className='text-end'>
//                         <Button>Checkout</Button>
//                     </DrawerClose>
//                 </DrawerFooter>
//             </DrawerContent>
//         </Drawer>
//     );
// }

// const cartConstants = {
//     title: 'Your Cart',
// };

// const CartItem = (item: any) => {
//     const [count, setCount] = useState(1);

//     return (
//         <div className='grid grid-cols-[2fr_5fr] gap-4'>
//             <div className='relative w-full h-full bg-gray-200 rounded-lg overflow-hidden'>
//                 <Image src={item.image} alt={item.title} fill objectFit='cover' />
//             </div>
//             <div className='flex flex-col gap-2'>
//                 <div className='flex justify-between'>
//                     <Text variant='h4' className='line-clamp-1'>
//                         {item.title}
//                     </Text>
//                     <Button variant='ghost' size='icon'>
//                         <HiXMark className='w-5 h-5 cursor-pointer' />
//                     </Button>
//                 </div>

//                 <div className='flex justify-between'>
//                     <Text className='line-clamp-2 text-sm'>{item.summary}</Text>
//                 </div>

//                 <div className='flex items-center gap-4'>
//                     <Text variant='h4'>{formatCurrency(item.price)}</Text>

//                     <div className='flex items-center gap-1'>
//                         <Button
//                             variant='outline'
//                             size='icon'
//                             onClick={() => setCount((prev) => (prev > 1 ? count - 1 : prev))}
//                         >
//                             <FiMinus />
//                         </Button>
//                         <Text className='w-5 text-center'>{count}</Text>
//                         <Button
//                             variant='outline'
//                             size='icon'
//                             onClick={() => setCount((prev) => (prev < 5 ? count + 1 : prev))}
//                         >
//                             <FiPlus />
//                         </Button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };
