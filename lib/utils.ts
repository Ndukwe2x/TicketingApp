import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import dateTime from 'date-and-time';
import { setCookie } from 'cookies-next';
import { APPCONFIG } from './app-config';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatNumber(value: number) {
    return new Intl.NumberFormat().format(value)
}

export function formatCurrency(value: number) {
    return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        currencyDisplay: 'symbol',
        maximumFractionDigits: 2,
    }).format(value);
}

export const formatDate = dateTime.format;


type DateTimeFormatOptions = {};

export const humanReadableDateFormat = (datetimeStr: string): string => {
    const dt = new Date(datetimeStr);
    const options: DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        // second: '2-digit',
        // timeZoneName: 'short'
    };
    return dt.toLocaleString('en-US', options);
}

export const getElementSiblings = (element: Element): Element[] => {
    const parent = element.parentNode;
    return parent ? Array.from(parent.children).filter(child => child !== element) : [];
}

export const parseInputName = (name: string): { key: string; readable: string } => {
    let key = '', readable = '';
    const matches = name.match(/\[(\w+)\]/g);
    if (matches) {
        key = matches.map(m => m.replace(/\[|\]/g, '')).join('.');
  
        readable = matches
          .map(m => m.replace(/\[|\]/g, ''))
          .map((s, i, arr) => (i === arr.length - 1 ? `name of category ${s}` : `category ${s}`))
          .join(' > ');
    } else {
        key = name;
    }
  
    return { key, readable };
}

export const orderByDate= (data: unknown[], prop: string, dir: string = 'asc'): Array<S> => {
    const ordered = [...data].toSorted((a, b) => {
        return dir === 'desc' 
            ? (new Date(a[prop])).valueOf() - (new Date(b[prop])).valueOf()
            : (new Date(b[prop])).valueOf() - (new Date(a[prop])).valueOf()
    });
    return ordered;
}

export const calculateTimeDifference = (timestamp1: string, timestamp2: string): {
    milliseconds: number;
    seconds: number;
    minutes: number;
    hours: number;
    days: number;
} => {
    const date1 = new Date(timestamp1);
    const date2 = new Date(timestamp2);

    const differenceInMilliseconds = date2.valueOf() - date1.valueOf();
    const differenceInSeconds = differenceInMilliseconds / 1000;
    const differenceInMinutes = differenceInMilliseconds / (1000 * 60);
    const differenceInHours = differenceInMilliseconds / (1000 * 60 * 60);
    const differenceInDays = differenceInMilliseconds / (1000 * 60 * 60 * 24);

    return {
        milliseconds: differenceInMilliseconds,
        seconds: differenceInSeconds,
        minutes: differenceInMinutes,
        hours: differenceInHours,
        days: differenceInDays,
    }
}