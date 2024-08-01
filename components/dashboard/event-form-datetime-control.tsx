import React, { FormEvent, FormEventHandler } from "react";
import { formatDate } from "@/lib/utils";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useFormData } from "@/hooks/useFormDataContext";

interface DateTimeProps extends Partial<HTMLInputElement> {
    datetime: string | Date
};
const DateTimeControls: React.FC<DateTimeProps> = ({datetime}) => {
    const [eventTimestamp, setEventTimestamp] = React.useState<string | number | Date>(datetime ? new Date(datetime) : '');
    const {formData, setFormData} = useFormData() as FormDataContextType;

    const handleDateTimeInput = (e: FormEvent<HTMLInputElement>): void => {
        const input = e.target as HTMLInputElement;
        let [date, time]: string[] = eventTimestamp instanceof Date ? eventTimestamp.toISOString().split('T') : ['',''];
        
        switch (input?.type) {
            case 'date':
                date = input.value;
                break;
            case 'time':
                if (date == '') date = (new Date).toDateString();
                time = input.value;
            default:
                break;
        }

        const finalDate = new Date(`${date} ${time}`).toISOString();
        setEventTimestamp(new Date(finalDate));
        setFormData(formData => ({
            ...formData,
            eventDate: new Date(finalDate).toISOString()
        }))
    }

    return (
        <div className="flex flex-row flex-1 gap-4">
            <input id='date' name="eventDate" type='hidden' 
            value={ eventTimestamp instanceof Date ? eventTimestamp.toISOString() : eventTimestamp } />
            <div className='flex flex-col gap-2 flex-1'>
                <Label htmlFor='date-control'>Date:</Label>
                <Input id='date-control' type='date'  
                onChange={ (e) => handleDateTimeInput(e) } required aria-required='true' 
                defaultValue={ eventTimestamp instanceof Date ? formatDate(new Date(eventTimestamp), 'YYYY-MM-DD') : '' } />
            </div>
            <div className='flex flex-col gap-2 flex-1 relative'>
                <Label htmlFor='time-control'>Time:</Label>
                <Input id='time-control' type='time'  
                onChange={ (e) => handleDateTimeInput(e) } required aria-required='true' 
                defaultValue={ eventTimestamp instanceof Date ? formatDate(eventTimestamp, 'hh:mm') : '' } />
                <span className="absolute time-of-day">{eventTimestamp instanceof Date ? formatDate(eventTimestamp, 'A') : '' }</span>
            </div>
        </div>
    )
}

export default DateTimeControls;