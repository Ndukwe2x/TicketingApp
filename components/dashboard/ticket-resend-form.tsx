import React, { FormEvent, FormEventHandler, HtmlHTMLAttributes, MouseEvent, MouseEventHandler, useState } from "react";
import { Button } from "../ui/button";
import { Api } from "@/lib/api";
import useAuthenticatedUser from "@/hooks/useAuthenticatedUser";
import axios from "axios";
import { toast } from "../ui/sonner";
import { MdSend } from "react-icons/md";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

const TicketResendForm: React.FC<HtmlHTMLAttributes<HTMLButtonElement> & { ticketId: string; onSuccess?: Callback; onFailure?: Callback }> = ({
    children, className, ticketId, onSuccess, onFailure, ...props
}) => {
    const actor = useAuthenticatedUser();
    const url = Api.server + Api.endpoints.admin.singleTicket.replace(':id', ticketId);

    const requestTicketResend = async (url: string, data: {}, contactMethod: string) => {
        try {
            const response = await axios.post(url, data, {
                headers: {
                    Authorization: `Bearer ${actor?.token}`,
                }
            });
            if ( response.status == 200 ) {
                toast(`Ticket info has been sent to the customer's registered ${contactMethod}.`);
            }
        } catch (error) {
            toast(
                `Sorry, but your request could not be completed at the moment. 
                It's not your fault but ours, and we're working to fix it. 
                Our sincere apologise for this ugly experience.`
            );
        }
    }
    const sendTicketToCustomer: React.FormEventHandler<HTMLFormElement> = (ev: FormEvent) => {
        ev.preventDefault();
        
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
    };

    return (
        <form onSubmit={ sendTicketToCustomer }>
            <MessageTypeSelector messageTypes={ {email: 'Email only', sms: 'SMS only', both: 'Both Email & SMS'} } />
            <br />
            <div className="text-right p-3 border-t">
                <Button type="submit" className="w-full">Send <MdSend size={ 22 } className="ml-2" /></Button>
            </div>
        </form>
    )
}


const MessageTypeSelector = ({ messageTypes }: { messageTypes: {email: string, sms: string, both: string} }) => {
    const [selectedMessageType, setSelectedMessageType] = useState<string>('');

    return (
        <div className="p-4">
            {
                Object.entries(messageTypes).map(
                    ([messageType, description], index) => <Label htmlFor={`message-type-${messageType}`} className="flex gap-2 mb-3">
                        <Input id={ `message-type-${messageType}` } 
                            type="radio" key={ index } name="messageType" 
                            value={ messageType }
                            className="py-0 w-auto h-auto"
                            defaultChecked={ messageType === 'email' }
                             /> { description }
                    </Label>
                )
            }
        </div>
    )
}

export default TicketResendForm;