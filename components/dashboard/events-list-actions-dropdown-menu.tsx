import React, { ReactNode } from "react";
// import { Row } from "@tanstack/react-table";
// import { Icons } from "../icons";
// import CommonDropdownMenu from "./dropdown-menu";
// import {
//     printTicket,
//     sendTicketToCustomer,
//     deleteTicket,
//     suspendTicket
// } from "@/hooks/ticket-actions";
// import Modal from "../ui/modal";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
// import Link from "next/link";
import { MdClose, MdLink, MdMoreVert } from "react-icons/md";
import DeleteEventButton from "../buttons/delete-event-button";
import EditEventButton from "../buttons/edit-event-button";
import { Button } from "../ui/button";
import { copyLink } from "@/lib/utils";
import useAuthenticatedUser from "@/hooks/useAuthenticatedUser";

const EventsListActionsDropdownMenu = ({ event, onSuccess }: {event: SingleEvent; onSuccess?: <T, S>(response: T, action: S) => void}) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const actor = useAuthenticatedUser();
    

    return (
        actor &&
        <DropdownMenu onOpenChange={setIsOpen} open={isOpen}>
            <DropdownMenuTrigger asChild>
                <Button variant='ghost' className='h-8 w-8 p-0'>
                    <span className='sr-only'>Open menu</span>
                    <MdMoreVert className='h-4 w-4' />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
                <DropdownMenuLabel>
                    <div className="flex justify-between items-center">
                        <span>Actions</span>
                        <Button variant={null} className="px-1 py-1 h-auto hover:bg-secondary" title="Cancel" onClick={() => setIsOpen(false)}><MdClose /></Button>
                    </div>
                </DropdownMenuLabel>
                <Button variant={null} onClick={ () => copyLink(`${window.location.origin}/events/${event._id}`) }
                    className='hover:bg-accent px-2 text-foreground flex justify-between items-center gap-5'>
                    <span>Copy Event Link</span><MdLink />
                </Button>
                { actor?.canUpdateEvent && 
                    <EditEventButton 
                        event={ event } 
                        actor={ actor }
                        variant={null} 
                        className='flex justify-between items-center w-full hover:bg-accent px-2 text-foreground gap-5' /> }
                <DropdownMenuSeparator />
                { actor?.canDeleteEvent && <DeleteEventButton 
                    event={ event }
                    actor={ actor }
                    variant={null}
                    callback={onSuccess ? (eventId) => {onSuccess(eventId, 'delete')} : undefined }
                    className='text-destructive flex justify-between items-center w-full hover:bg-accent px-2 gap-5' /> }
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default EventsListActionsDropdownMenu;
        // <div>
        //         <CommonDropdownMenu 
        //             trigger={<Icons.options color='text-gray' className='mr-2 h-4 w-4 text-gray' />}
        //             items={[
        //                 {
        //                     title: 'Print ticket', 
        //                     uri: '/tickets/' + row.original._id + '/?option=print',
        //                     actions: {
        //                         onClick: (e: Event) => { initDialog(e, printTicket, row.original._id, 'Print ticket', 'Description') }
        //                     }
        //                 },
        //                 {
        //                     title: <Modal title='Resend to customer' displayText='Resend to customer' content={'Hello'} onSave={() => {}} onClose={() => {}} description={'hello'} />, 
        //                     uri: '/tickets/' + row.original._id + '/?option=resend-to-customer',
        //                     actions: {
        //                         onClick: () => sendTicketToCustomer(row.original._id, row.original.email, row.original.phone)
        //                     }
        //                 },
        //                 // {
        //                 //     title: 'Mark as admitted', 
        //                 //     uri: '/tickets/' + row.original._id + '/?option=mark-admitted',
        //                 //     actions: {
        //                 //         onClick: () => TicketActions.markTicketAsAdmitted(row.original._id)
        //                 //     }
        //                 // },
        //                 // {
        //                 //     title: 'Suspend', 
        //                 //     uri: '/tickets/' + row.original._id + '/?option=suspend',
        //                 //     actions: {
        //                 //         onClick: () => TicketActions.suspendTicket(row.original._id)
        //                 //     }
        //                 // },
        //                 // {
        //                 //     title: 'Delete', 
        //                 //     uri: '/tickets/' + row.original._id + '/?option=delete',
        //                 //     actions: {
        //                 //         onClick: () => TicketActions.deleteTicket(row.original._id)
        //                 //     }
        //                 // },
        //             ]} />
        //         {
        //             isDialogOpen && <Modal title={ modalTitle } 
        //                 displayText={ modalTitle } 
        //                 content={ modalContent } 
        //                 onSave={() => handleSaveAction } 
        //                 onClose={() => handleCloseAction } 
        //                 description={ modalDesc } />
        //         }
        // </div>