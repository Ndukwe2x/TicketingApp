import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import dateTime from 'date-and-time';

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