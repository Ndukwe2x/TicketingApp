import { cn, parseDate } from "@/lib/utils";
import React from "react";

interface BrickwallDateTimeProps {
    datetime: string | Date;
    dateFormat?: string;
}

const BrickwallDateTime = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & BrickwallDateTimeProps
>(({ children, className, datetime, dateFormat = 'DD/MMM/YYYY hh:mm:s A' }, ref) => {

    const {
        day,
        month,
        year,
        yearArr,
        time,
        meridian
    } = parseDate(datetime, dateFormat);

    return (
        <div className={cn('brickwall-datetime', className)} ref={ref}>
            <div className="brickwall datetime-wrapper">
                <div className="block1 date-day-month">
                    <div className="grid">
                        <div className="date-day">{day}</div>
                        <div className="date-month">{month}</div>
                    </div>
                </div>
                <div className="block2 date-year">
                    <div className="grid">
                        <div className="date-year-thousands">{yearArr[0]}</div>
                        <div className="date-year-hundreds">{yearArr[1]}</div>
                    </div>
                </div>
                <div className="block3 date-time">{time} {meridian}</div>
            </div>
        </div>
    )
});

BrickwallDateTime.displayName = 'BrickwallDateTime';

export default BrickwallDateTime;