import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import dateTime from 'date-and-time'

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
