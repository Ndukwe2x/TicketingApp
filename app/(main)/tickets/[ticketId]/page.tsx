"use client";

import { Api } from "@/lib/api";
import axios, { AxiosError } from "axios";
import React, { FormEvent, useEffect, useState } from "react";
import html2PDF from "jspdf-html2canvas";
import { Text } from "@/components/ui/text";
import TicketSlip from "@/components/ticket-slip";
import { Button } from "@/components/ui/button";
import { MdArrowDropDown, MdFileDownload } from "react-icons/md";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import useAuthenticatedUser from "@/hooks/useAuthenticatedUser";
import TicketResendForm from "@/components/dashboard/ticket-resend-form";
import { usePageHeader } from "@/hooks/usePageHeaderContext";


export default function ViewTicket({ params }: { params: { ticketId: string } }) {
    const { ticketId } = params;
    const [ticket, setTicket] = React.useState<Ticket | null>(null);
    const [event, setEvent] = React.useState<SingleEvent>();
    const [suspenseText, setSuspenseText] = React.useState('Loading, please wait...');
    const [isSendOptionsTrayOpen, toggleSendOptionsTray] = React.useReducer(state => !state, false);
    const actor = useAuthenticatedUser();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { pageTitle, setPageTitle, setDocTitle, setIsPageTitleEnabled } = usePageHeader();


    const fetchTicketEvent = async (url: string, config: {}) => {
        const res = await axios.get(url, config);
        const data = res.data.data || null;
        if (data == null) {
            return;
        }
        setEvent(data);
    }


    useEffect(() => {
        if (!ticket) {
            return;
        }
        setPageTitle('Ticket Info');
        const docTitle = `"${ticket?.ticketCategory}" ticket to ${ticket?.eventTitle}`;
        setDocTitle(docTitle);
        return () => { }
    }, [ticket]);

    React.useEffect(() => {
        if (!actor) {
            return;
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

                if (data == null) {
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
        let url: string = [Api.server, Api.endpoints.admin.searchTickets, '?referenceNo=', ticketId].join('');

        fetchTicketData(url, actor);
        return () => { }
    }, [actor, ticketId, setPageTitle]);


    const cardRef = React.useRef<HTMLDivElement>(null);

    const printTicket = React.useCallback(() => {
        if (!cardRef.current || !ticket || !event) return;
        html2PDF(cardRef.current, {
            jsPDF: {
                unit: 'in',
                format: 'legal',
                orientation: 'portrait',
            },
            html2canvas: {
                scale: 1.5,
            },
            imageType: 'image/jpeg',
            output: `${ticket.ticketCategory} Ticket to ${event.title}`,
        });
    }, [ticket, event]);

    return (
        <>
            <div className='mt-10 flex flex-col gap-5'>
                {
                    ticket && event &&
                    <div className='grid lg:grid-cols-[3fr_2fr] gap-7'>
                        <div id="ticket-info">
                            <Text variant='h3'>{`"${ticket.ticketCategory}" ticket to`}</Text>
                            <Text variant='h1' className="mb-5">{`${ticket.eventTitle}`}</Text>
                            <Card>
                                <CardHeader>Details</CardHeader>
                                <CardContent>
                                    <div className="flex gap-5 py-2 border-b">
                                        <Text className="font-semibold text-muted-foreground w-1/3">Customer Name:</Text>
                                        <Text>{ticket.name}</Text>
                                    </div>
                                    <div className="flex gap-5 py-2 border-b">
                                        <Text className="font-semibold text-muted-foreground w-1/3">Customer Email:</Text>
                                        <Text>{ticket.email}</Text>
                                    </div>
                                    <div className="flex gap-5 py-2 border-b">
                                        <Text className="font-semibold text-muted-foreground w-1/3">Customer Phone No:</Text>
                                        <Text>{ticket.phone}</Text>
                                    </div>
                                    <div className="flex gap-5 py-2 border-b">
                                        <Text className="font-semibold text-muted-foreground w-1/3">Ticket Category:</Text>
                                        <Text>{ticket.ticketCategory}</Text>
                                    </div>
                                    <div className="flex gap-5 py-2 border-b">
                                        <Text className="font-semibold text-muted-foreground w-1/3">Quantity:</Text>
                                        <Text>{ticket.numberOfTickets}</Text>
                                    </div>
                                    <div className="flex gap-5 py-2 border-b">
                                        <Text className="font-semibold text-muted-foreground w-1/3">Ticket Reference:</Text>
                                        <Text>{ticket.referenceNo}</Text>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                        <div id="ticket-preview" className="flex flex-col max-w-96">
                            <Text variant='h2' className="mb-5">Ticket</Text>
                            <TicketSlip ticket={ticket} event={event} cardRef={cardRef} />
                            <div className="flex gap-5 mt-6">
                                <Button onClick={printTicket}>Download Ticket <MdFileDownload size={22} className="ml-2" /></Button>
                                <Button variant='outline' onClick={toggleSendOptionsTray}>Send to Customer <MdArrowDropDown size={22} className="ml-2" /></Button>
                            </div>
                            <div id="ticket-sending-options" className={`mt-4 ${isSendOptionsTrayOpen ? 'shown' : 'hidden'}`}>
                                <TicketResendForm ticketId={ticket._id} />
                            </div>
                        </div>
                    </div> ||
                    <div className="text-center">{suspenseText}</div>
                }
            </div>
        </>
    );
}
