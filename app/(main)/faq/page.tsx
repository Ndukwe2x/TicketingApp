import React from 'react';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { Text } from '@/components/ui/text';

export default function FAQ() {
    return (
        <div className='grid lg:grid-cols-2 gap-5'>
            <Text variant='h1'>Frequently Asked Questions</Text>
            <div>
                <Accordion type='single' collapsible className='w-full'>
                    <AccordionItem value='item-1'>
                        <AccordionTrigger>Can I resell a ticket?</AccordionTrigger>
                        <AccordionContent>
                            Yes. You can resell a ticket, but you can only do so through our
                            official ticket exchange platform.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value='item-2'>
                        <AccordionTrigger>Can I get a refund?</AccordionTrigger>
                        <AccordionContent>
                            Yes. You can get a refund if you request it within 24 hours of
                            purchasing the ticket.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value='item-3'>
                        <AccordionTrigger>
                            How do I validate tickets purchased for my event?
                        </AccordionTrigger>
                        <AccordionContent>
                            You can validate tickets by scanning the QR code on the ticket at the
                            entrance of the event.
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        </div>
    );
}
