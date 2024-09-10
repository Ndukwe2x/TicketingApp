import React, { FormEvent, FormEventHandler, MouseEvent, useRef } from "react";
import { formatDate } from "@/lib/utils";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useFormData } from "@/hooks/useFormDataContext";
import { Button } from "../ui/button";
import { FaClock } from "react-icons/fa6";
import { CalendarIcon, ClockIcon } from "@radix-ui/react-icons";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { DatePicker, MobileTimePicker, renderTimeViewClock, TimePicker } from "@mui/x-date-pickers";

interface DateTimeProps extends Partial<HTMLInputElement> {
    datetime: string | Date
};
const DateTimeControls: React.FC<DateTimeProps> = ({ datetime }) => {
    const [eventTimestamp, setEventTimestamp] = React.useState<string | number | Date>(datetime ? new Date(datetime) : '');
    const { formData, setFormData } = useFormData() as FormDataContextType;
    const dateInputRef = useRef<HTMLInputElement | null>(null);
    const timeInputRef = useRef<HTMLInputElement | null>(null);
    const isMobile = useMediaQuery('(max-width: 360px)');


    const showDateTimePicker = (fieldType: string) => {
        let input: HTMLInputElement | null = null;

        switch (fieldType) {
            case 'date':
                if (!dateInputRef.current) {
                    console.error('Date input not found');
                    return;
                }
                input = dateInputRef.current;
                break;
            case 'time':
                if (!timeInputRef.current) {
                    console.error('Time input not found.');
                    return;
                }
                input = timeInputRef.current;
                break;
            default:
                break;
        }

        input?.showPicker();
    }

    const handleDateTimeInput = (e: FormEvent<HTMLInputElement>): void => {
        const input = e.target as HTMLInputElement;
        let [date, time]: string[] = eventTimestamp instanceof Date ? eventTimestamp.toISOString().split('T') : ['', ''];

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
        if (date === '') {
            setEventTimestamp('');
            setFormData(formData => ({
                ...formData,
                eventDate: ''
            }));
            return;
        }

        const finalDate = new Date(`${date} ${time}`).toISOString();
        setEventTimestamp(new Date(finalDate));
        setFormData(formData => ({
            ...formData,
            eventDate: new Date(finalDate).toISOString()
        }))
    }

    const period = eventTimestamp instanceof Date ? formatDate(eventTimestamp, 'A') : '';

    return (
        <div className="flex flex-row flex-1 gap-5">
            <input id='date' name="eventDate" type='hidden'
                value={eventTimestamp instanceof Date ? eventTimestamp.toISOString() : eventTimestamp} />
            <div className='flex flex-col gap-2 flex-1'>
                <Label htmlFor='date-control' className="w-full block">Date:</Label>
                <div className="relative">
                    {/* <DatePicker /> */}
                    <Input ref={dateInputRef} id='date-control' type='date'
                        onChange={(e) => handleDateTimeInput(e)} required aria-required='true'
                        defaultValue={eventTimestamp instanceof Date ? formatDate(new Date(eventTimestamp), 'YYYY-MM-DD') : ''}
                        className="invisible"
                    />
                    <Button variant={'outline'}
                        className="border flex items-center justify-between cursor-default absolute w-full top-0 px-2"
                        type='button' onClick={() => showDateTimePicker('date')}>
                        <span>{eventTimestamp instanceof Date ? formatDate(new Date(eventTimestamp), 'DD/MM/YYYY') : 'DD/MM/YYYY'}</span>
                        <CalendarIcon width={22} height={22} />
                    </Button>
                </div>
            </div>
            <div className='flex flex-col gap-2 flex-1 relative'>
                <Label htmlFor='time-control'>Time:</Label>
                <div className="relative">
                    <Input ref={timeInputRef} id='time-control' type='time'
                        onChange={(e) => handleDateTimeInput(e)} required aria-required='true'
                        defaultValue={eventTimestamp instanceof Date ? formatDate(eventTimestamp, 'hh:mm') : ''}
                        className="invisible"
                    />
                    {/* <MobileTimePicker
                        label={'"seconds"'}
                        openTo="seconds"
                        views={['minutes', 'seconds']}
                        format="mm:ss"
                    /> */}
                    {/* <TimePicker
                        label="Time"
                        viewRenderers={{
                            hours: renderTimeViewClock,
                            minutes: renderTimeViewClock,
                            seconds: renderTimeViewClock,
                        }}
                    /> */}
                    <Button variant={'outline'}
                        className="border flex items-center justify-between gap-1.5 md:gap-7 cursor-default absolute w-full top-0 px-2"
                        type='button' onClick={() => showDateTimePicker('time')}>
                        <span>{eventTimestamp instanceof Date ? formatDate(eventTimestamp, 'hh:mm') : '00:00'}</span>
                        <span className="time-of-day mr-auto">
                            {
                                period === 'AM' && <>
                                    <span>A</span>
                                    {!isMobile && <span>M</span>}
                                </>
                            }
                            {
                                period === 'PM' && <>
                                    <span>P</span>
                                    {!isMobile && <span>M</span>}
                                </>
                            }
                        </span>
                        <span><ClockIcon width={22} height={22} /></span>
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default DateTimeControls;