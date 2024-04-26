"use client";

import { Api } from "@/lib/api";
import { User } from "@/lib/logged-user";
import axios, { AxiosError } from "axios";
import React, { FormEvent } from "react";
import * as TicketNotFound from './not-found';
import * as EventNotFound from '../../events/[eventId]/not-found';
import html2PDF from "jspdf-html2canvas";
import html2pdf from "html2pdf.js";
import { Text } from "@/components/ui/text";
import TicketSlip from "@/components/ticket-slip";
import { Button } from "@/components/ui/button";
import { MdArrowDropDown, MdFileDownload, MdSend } from "react-icons/md";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";


export default function ViewTicket({ params }: { params: { ticketId: string } }) {
    const { ticketId } = params;
    const [ticket, setTicket] = React.useState<Ticket>();
    const [event, setEvent] = React.useState<SingleEvent>();
    const [suspenseText, setSuspenseText] = React.useState('Loading, please wait...');
    const [isSendOptionsTrayOpen, toggleSendOptionsTray] = React.useReducer(state => !state, false);
    
    let url = Api.server + Api.endpoints.admin.searchTickets;
    url += '?referenceNo=' + ticketId;
    const reqConf = {
        headers: {
            Authorization: `Bearer ${User.token}`,
        }
    }

    React.useEffect(() => {
        axios.get(url, reqConf)
        .then(res => {
            let result = res.data;
            if (!result.data) {
                return;
            }
            let data: Ticket = result.data.tickets.shift();

            setTicket(data);
            let eventUrl = Api.server + Api.endpoints.public.singleEvent;
            eventUrl = eventUrl.replace(':id', data?.eventRef);
            axios.get(eventUrl, reqConf)
            .then(eventRes => {
                let eventResult = eventRes.data;
                if (!eventResult.data) {
                    return;
                }
                setEvent(eventResult.data);
            })
            .catch(error => {
                if (error.code === '404') {
                    return <EventNotFound.default />
                } else {
                    console.log(error);
                    setSuspenseText('Oops! Something went wrong. The ticket could not be loaded.');
                }
            })
        })
        .catch((error: AxiosError) => {
            if (error.code === '404') {
                return <TicketNotFound.default />
            } else {
                console.log(error);
                setSuspenseText('Oops! Something went wrong. The ticket could not be loaded.');
            }
        })

        return;
    }, []);


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

    const sendTicketToCustomer = React.useCallback((ev: FormEvent) => {
        ev.preventDefault();
        if (!cardRef.current || !ticket || !event) return;
        
        const formData = new FormData(ev.target);
        html2pdf().from(cardRef.current).toPdf()
        .output('datauristring')
        .then((pdfAsString: string) => {
            const encodedFile = encodeURIComponent(pdfAsString);
            let  url = Api.server + Api.endpoints.admin.singleTicket;
            url = url.replace(':id', ticket._id);
            
            axios.post(url, formData, reqConf)
            .then(res => {
                if (res.data) {
                    console.log('Ticket sent sussfully');
                }
            })
            .catch((error: AxiosError) => {
                console.log(error.message);
            });
        });
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

const uploadToCloudinary = (encodedFile: string) => {
    const reqConf = {

    };
    axios.post('/path/to/ticket-sender', {'ticket_img': encodedFile}, reqConf)
    .then(res => {
        
    })
}

