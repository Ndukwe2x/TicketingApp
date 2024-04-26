import React, { ReactNode } from "react";
import { Row } from "@tanstack/react-table";
import { Icons } from "../icons";
import CommonDropdownMenu from "./dropdown-menu";
import {
    printTicket,
    sendTicketToCustomer,
    deleteTicket,
    suspendTicket
} from "@/hooks/ticket-actions";
import Modal from "../ui/modal";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import Link from "next/link";
import { MdMoreVert } from "react-icons/md";

const TicketActionsDropdownMenu = ({ row }) => {
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    const [modalTitle, setModalTitle] = React.useState('');
    const [modalDesc, setModalDesc] = React.useState('');
    const [modalContent, setModalContent] = React.useState('');
    
    const handleSaveAction = () => {
        
        setIsDialogOpen(false);
    }

    const handleCloseAction = () => {

        setIsDialogOpen(false);
    }

    type ContentHook = (id: string) => ReactNode;

    const initDialog = (evt: Event, contentHook: ContentHook, ticketId: string, title: string, desc?: string) => {
        evt.preventDefault();

        setModalTitle(title);
        if (desc) {
            setModalDesc(desc);
        }

        setModalContent(
            contentHook(ticketId)
        );
        setIsDialogOpen(true);
    }

    return (
        <DropdownMenuGroup>
            <DropdownMenu>
                <DropdownMenuTrigger>
                {/* <Icons.options color='text-gray' className='mr-2 h-4 w-4 text-gray' /> */}
                    <MdMoreVert className="text-gray" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem className="flex-column">
                        <Link href={`/tickets/${row.original.referenceNo}/?option=print`}
                            target="_blank"
                            className='md:block flex-1'>Print Ticket
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex-column">
                        <Link href={`/tickets/${row.original.referenceNo}/?option=resend_to_customer`}
                            className='md:block flex-1'>Resend to Customer
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex-column">
                        <Link href={`/tickets/${row.original.referenceNo}/?option=mark_as_admitted`}
                            className='md:block flex-1'>Mark as Admitted
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex-column">
                        <Link href={`/tickets/${row.original.referenceNo}/?option=suspend`}
                            className='md:block flex-1'>Suspend Ticket
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex-column">
                        <Link href={`/tickets/${row.original.referenceNo}/?option=delete`}
                            className='md:block flex-1'>Delete Ticket
                        </Link>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </DropdownMenuGroup>
    )
}

export default TicketActionsDropdownMenu;
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