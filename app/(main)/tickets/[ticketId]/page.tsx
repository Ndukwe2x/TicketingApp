"use client";

import { Api } from "@/lib/api";
import axios, { AxiosError } from "axios";
import React, { FormEvent, useState } from "react";
// import * as TicketNotFound from './not-found';
// import * as EventNotFound from '../../events/[eventId]/not-found';
import html2PDF from "jspdf-html2canvas";
// import html2pdf from "html2pdf.js";
import { Text } from "@/components/ui/text";
import TicketSlip from "@/components/ticket-slip";
import { Button } from "@/components/ui/button";
import { MdArrowDropDown, MdFileDownload, MdSend } from "react-icons/md";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import useAuthenticatedUser from "@/hooks/useAuthenticatedUser";
import { toast } from "@/components/ui/sonner";


export default function ViewTicket({ params }: { params: { ticketId: string } }) {
    const { ticketId } = params;
    const [ticket, setTicket] = React.useState<Ticket | null>(null);
    const [event, setEvent] = React.useState<SingleEvent>();
    const [suspenseText, setSuspenseText] = React.useState('Loading, please wait...');
    const [isSendOptionsTrayOpen, toggleSendOptionsTray] = React.useReducer(state => !state, false);
    const actor = useAuthenticatedUser();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    

    const fetchTicketEvent = async (url: string, config: {}) => {
        const res = await axios.get(url, config);
        const data = res.data.data || null;
        if ( data == null) {
            return;
        }
        setEvent(data);
    }
    const fetchTicketData = async (url: string, actor: AppUser) => {
        setIsLoading(true);
        const config = {
            headers: {
                Authorization: `Bearer ${actor?.token}`,
            }
        };

        try {
            const res = await axios.get(url, config);
            const result = res.data.data || [];
            const data: Ticket | null = result.tickets ? result.tickets.shift() : null;

            if ( data == null ) {
                throw new AxiosError('Unable to fetch ticket info.', 'Internal Server Error');
            }

            setTicket(data);
            let eventUrl = Api.server + Api.endpoints.public.singleEvent.replace(':id', data?.eventRef);
            fetchTicketEvent(eventUrl, config);
        } catch (err) {
            console.error(err);
                setSuspenseText('Oops! Something went wrong. Unable to fetch ticket or associated event.');
        } finally {
            setIsLoading(false)
        }

    }

    React.useEffect(() => {
        let url: string = [Api.server, Api.endpoints.admin.searchTickets, '?referenceNo=', ticketId].join('');

        if ( actor != null ) {
            fetchTicketData(url, actor);
        }
    }, [actor]);


    const cardRef = React.useRef<HTMLDivElement>(null);

    const printTicket = React.useCallback(() => {
        if (!cardRef.current || !ticket || !event) return;
        html2PDF(cardRef.current, {
            jsPDF: {
                unit: 'in',
                format: 'letter',
                orientation: 'portrait',
            },
            html2canvas: {
                scale: 1.5,
            },
            imageType: 'image/jpeg',
            output: `${ticket.ticketCategory} Ticket to ${event.title}`,
        });
    }, [ticket, event]);

    const requestTicketResend = async (url: string, data: {}, contactMethod: string) => {
        try {
            const response = await axios.post(url, data, {
                headers: {
                    Authorization: `Bearer ${actor?.token}`,
                }
            });
            if ( response.status == 200 ) {
                toast(`Ticket info has been sent to your registered ${contactMethod}.`);
            }
        } catch (error) {
            toast(
                `Sorry, but your request could not be completed at the moment. 
                It's not your fault but ours, and we're working to fix it. 
                Our sincere apologise for this ugly experience.`
            );
        }
    }
    const sendTicketToCustomer = React.useCallback((ev: SubmitEvent) => {
        ev.preventDefault();
        if (!cardRef.current || !ticket || !event) return;

        let  url = Api.server + Api.endpoints.admin.singleTicket;
        url = url.replace(':id', ticket._id);
        
        const formData = new FormData(ev.target as HTMLFormElement);
        const postData = Object.fromEntries(formData.entries());
        let contactMethod: string;

        switch ( postData.messageType ) {
            case 'email':
                contactMethod = 'email';
                break;
            case 'phone':
                contactMethod = 'phone';
                break;
            default:
                contactMethod = 'email and phone';
                break;
        }
        
        requestTicketResend(url, postData, contactMethod);
        
        // html2pdf().from(cardRef.current).toPdf()
        // .output('datauristring')
        // .then((pdfAsString: string) => {
        //     const encodedFile = encodeURIComponent(pdfAsString);
            
        //     axios.post(url, formData, reqConf)
        //     .then(res => {
        //         if (res.data) {
        //             console.log('Ticket sent sussfully');
        //         }
        //     })
        //     .catch((error: AxiosError) => {
        //         console.log(error.message);
        //     });
        // });
    }, [ticket, event]);
    

    return (
        <>
            <div className='flex flex-col gap-5'>
            {
                ticket && event &&
                <div className='grid lg:grid-cols-[3fr_2fr] gap-7'>
                    <div id="ticket-info">
                        <Card>
                            <CardHeader>Details</CardHeader>
                            <CardContent>
                                <div className="flex gap-5 py-2 border-b">
                                    <Text className="font-semibold text-muted-foreground w-1/3">Customer Name:</Text>
                                    <Text>{ ticket.name }</Text>
                                </div>
                                <div className="flex gap-5 py-2 border-b">
                                    <Text className="font-semibold text-muted-foreground w-1/3">Customer Email:</Text>
                                    <Text>{ ticket.email }</Text>
                                </div>
                                <div className="flex gap-5 py-2 border-b">
                                    <Text className="font-semibold text-muted-foreground w-1/3">Customer Phone No:</Text>
                                    <Text>{ ticket.phone }</Text>
                                </div>
                                <div className="flex gap-5 py-2 border-b">
                                    <Text className="font-semibold text-muted-foreground w-1/3">Ticket Category:</Text>
                                    <Text>{ ticket.ticketCategory }</Text>
                                </div>
                                <div className="flex gap-5 py-2 border-b">
                                    <Text className="font-semibold text-muted-foreground w-1/3">Quantity:</Text>
                                    <Text>{ ticket.numberOfTickets }</Text>
                                </div>
                                <div className="flex gap-5 py-2 border-b">
                                    <Text className="font-semibold text-muted-foreground w-1/3">Ticket Reference:</Text>
                                    <Text>{ ticket.referenceNo }</Text>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    <div id="ticket-preview" className="flex flex-col max-w-96">
                        <Text variant='h2' className="mb-5">Ticket</Text>
                        <TicketSlip ticket={ ticket } event={ event } cardRef={ cardRef } />
                        <div className="flex gap-5 mt-6">
                            <Button onClick={printTicket}>Download Ticket <MdFileDownload size={22} className="ml-2" /></Button>
                            <Button variant='outline' onClick={ toggleSendOptionsTray }>Send to Customer <MdArrowDropDown size={22} className="ml-2" /></Button>
                        </div>
                        <div id="ticket-sending-options" className={ `mt-4 ${isSendOptionsTrayOpen ? 'shown' : 'hidden'}` }>
                            <form onSubmit={ sendTicketToCustomer }>
                                <Select name="messageType">
                                    <SelectTrigger>
                                        <SelectValue placeholder='Message Type' />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="email">Email</SelectItem>
                                        <SelectItem value="phone">Phone</SelectItem>
                                        <SelectItem value="both">Email & Phone</SelectItem>
                                    </SelectContent>
                                </Select>
                                <br />
                                <div className="text-right"><Button type="submit" >Send<MdSend size={22} className="ml-2" /></Button></div>
                            </form>
                        </div>
                    </div>
                </div> ||
                <div className="text-center">{ suspenseText }</div>
            }
            </div>
        </>
    );
}

// const uploadToCloudinary = (encodedFile: string) => {
//     const reqConf = {

//     };
//     axios.post('/path/to/ticket-sender', {'ticket_img': encodedFile}, reqConf)
//     .then(res => {
        
//     })
// }

