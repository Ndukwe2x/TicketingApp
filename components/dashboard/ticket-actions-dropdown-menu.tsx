import React, { ReactNode } from "react";
import { Row } from "@tanstack/react-table";
import { Icons } from "../icons";
import CommonDropdownMenu from "../dropdown-menu";
import {
    printTicket,
    sendTicketToCustomer,
    deleteTicket,
    suspendTicket
} from "@/hooks/ticket-actions";
import Modal from "../ui/modal";

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
        <div>
                <CommonDropdownMenu 
                    trigger={<Icons.options color='text-gray' className='mr-2 h-4 w-4 text-gray' />}
                    items={[
                        {
                            title: 'Print ticket', 
                            uri: '/tickets/' + row.getValue('_id') + '/?option=print',
                            actions: {
                                onClick: (e: Event) => { initDialog(e, printTicket, row.getValue('_id'), 'Print ticket', 'Description') }
                            }
                        },
                        // {
                        //     title: <Modal title='Resend to customer' displayText='Resend to customer' content={'Hello'} onSave={() => {}} onClose={() => {}} description={'hello'} />, 
                        //     uri: '/tickets/' + row.getValue('_id') + '/?option=resend-to-customer',
                        //     actions: {
                        //         onClick: () => TicketActions.sendTicketToCustomer(row.getValue('_id'), row.getValue('email'), row.getValue('phone'))
                        //     }
                        // },
                        // {
                        //     title: 'Mark as admitted', 
                        //     uri: '/tickets/' + row.getValue('_id') + '/?option=mark-admitted',
                        //     actions: {
                        //         onClick: () => TicketActions.markTicketAsAdmitted(row.getValue('_id'))
                        //     }
                        // },
                        // {
                        //     title: 'Suspend', 
                        //     uri: '/tickets/' + row.getValue('_id') + '/?option=suspend',
                        //     actions: {
                        //         onClick: () => TicketActions.suspendTicket(row.getValue('_id'))
                        //     }
                        // },
                        // {
                        //     title: 'Delete', 
                        //     uri: '/tickets/' + row.getValue('_id') + '/?option=delete',
                        //     actions: {
                        //         onClick: () => TicketActions.deleteTicket(row.getValue('_id'))
                        //     }
                        // },
                    ]} />
                {
                    isDialogOpen && <Modal title={ modalTitle } 
                        displayText={ modalTitle } 
                        content={ modalContent } 
                        onSave={() => handleSaveAction } 
                        onClose={() => handleCloseAction } 
                        description={ modalDesc } />
                }
        </div>
    )
}

export default TicketActionsDropdownMenu;