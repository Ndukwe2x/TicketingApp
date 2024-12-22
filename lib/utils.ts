import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import dateTime from 'date-and-time';
import { setCookie } from 'cookies-next';
import { APPCONFIG } from './app-config';
import { toast } from '@/components/ui/sonner';

function isBool(data: unknown) {
    return typeof data === 'boolean';
}
function isString(data: unknown) {
    return typeof data === 'string';
}

function isNumber(data: unknown) {
    return typeof data === 'number';
}

function isNumeric(data: string) {
    return isString(data) && data.match(/^[\d+]/g);
}

function isFunction(data: unknown) {
    return typeof data === 'function';
}

function isDate(input: unknown) {
    return input instanceof Date;
}

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

function formatNumber(value: number) {
    return new Intl.NumberFormat().format(value)
}

function formatCurrency(value: number) {
    return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        currencyDisplay: 'symbol',
        maximumFractionDigits: 2,
    }).format(value);
}

const formatDate = dateTime.format;


type DateTimeFormatOptions = {};

const humanReadableDateFormat = (datetimeStr: string): string => {
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

const getElementSiblings = (element: Element): Element[] => {
    const parent = element.parentNode;
    return parent ? Array.from(parent.children).filter(child => child !== element) : [];
}

// const parseInputName = (name: string): { key: string; readable: string } => {
//     let key = '', readable = '';
//     const matches = name.match(/\[(\w+)\]/g);
//     if (matches) {
//         key = matches.map(m => m.replace(/\[|\]/g, '')).join('.');

//         readable = matches
//           .map(m => m.replace(/\[|\]/g, ''))
//           .map((s, i, arr) => (i === arr.length - 1 ? `name of category ${s}` : `category ${s}`))
//           .join(' > ');
//     } else {
//         key = name;
//     }

//     return { key, readable };
// }

function formDataToObjects(formData: IterableIterator<[string, FormDataEntryValue]>): { name: string; value: string }[] {
    const result: { name: string; value: string }[] = [];

    for (const [key, value] of formData) {
        result.push({ name: key, value: value.toString() });
    }

    return result;
}

// function parseFormFields(formFields: { name: string; value: string }[], inputObject?: Record<string, any>): Record<string, any> {
//     const result: Record<string, any> = {...inputObject};

//     for ( const field of formFields ) {
//         const fieldNameParts = field.name.split('[');
//         if ( fieldNameParts.length > 1 ) {
//             const key = fieldNameParts[0];
//             const index = parseInt(fieldNameParts[1].replace(']', ''), 10);

//             if ( !result[key] ) {
//                 result[key] = [];
//             }

//             if ( !result[key][index] ) {
//                 if ( fieldNameParts[2] ) {
//                     result[key][index] = {}
//                 } else {
//                     result[key][index] = field.value;
//                 }
//             }

//             if ( typeof result[key][index] !== 'string' ) {
//                 const subKey = fieldNameParts[2].replace(']', '');
//                 result[key][index][subKey] = field.value;
//             }
//         } else {
//             result[field.name] = field.value;
//         }
//     }

//     return result;
// }
// foo[bar][0][barz][hi][hello]' & 'foo[bar][1][barz][hi][bye]
// function parseFormFields(formFields: { name: string; value: string }[], inputObject?: Record<string, any>): Record<string, any> {
//     const result: Record<string, any> = { ...inputObject };

//     for (const field of formFields) {
//         const fieldNameParts = field.name.split('[');
//         if (fieldNameParts.length > 1) {
//             let currentObj = result;
//             for (let i = 0; i < fieldNameParts.length; i++) {
//                 const part = fieldNameParts[i];
//                 if (part.endsWith(']')) {
//                     const key = part.slice(0, -1);
//                     if (!currentObj[key]) {
//                         currentObj[key] = i === fieldNameParts.length - 1 ? field.value : {};
//                     }
//                     currentObj = currentObj[key];

//                 } else {
//                     currentObj[part] = i === fieldNameParts.length - 1 ? field.value : {};
//                     currentObj = currentObj[part];
//                 }
//             }
//             result[]
//         } else {
//             result[field.name] = field.value;
//         }
//     }

//     return result;
// }
function parseFormFields(formFields: { name: string; value: string | number }[], inputObject?: Record<string, any>
): Record<string, any> {
    const outputObject: Record<string, any> = { ...inputObject };

    for (const field of formFields) {
        const keys = field.name.split(/\[|\]/).filter(Boolean);
        let currentObject = outputObject;

        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            if (!currentObject[key]) {
                currentObject[key] = /^\d+$/.test(keys[i + 1]) ? [] : {};
            }
            if (i === keys.length - 1) {
                currentObject[key] = field.value;
            } else {
                currentObject = currentObject[key];
            }
        }
    }

    return outputObject;
}

function convertToDotNotation(path: string): string {
    return path.replace(/\[(\w+)\]/g, '.$1');
}


const orderByDate = (data: Record<string, any>[], prop = 'createdAt', dir = 'asc'): Record<string, string>[] => {
    const ordered: Record<string, string>[] = [...data].toSorted((a, b) => {
        return dir === 'desc'
            ? (new Date(a[prop])).valueOf() - (new Date(b[prop])).valueOf()
            : (new Date(b[prop])).valueOf() - (new Date(a[prop])).valueOf()
    });

    return ordered;
}

const calculateTimeDifference = (timestamp1: string, timestamp2: string): {
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



function copyLink(link: string) {
    navigator.clipboard.writeText(link);
    toast('Link copied!', { position: 'top-center' });
}

// interface FileReaderProps {
//     file: File;
//     options?: {
//         minSize?: number | string;
//         maxSize?: number | string;
//     };
//     sizeUnit?: 'KB' | 'MB' | 'GB' | 'TB';
// }
function parseFileToDataUri(
    file: File,
    options?: {
        minSize?: {
            size: number;
            unit: string
        };
        maxSize?: {
            size: number;
            unit: string
        }
    }
): Promise<string> {
    const checkFileSize = () => {
        let isTooSmall: boolean = false;
        let isTooLarge: boolean = false;

        if (options) {
            const {
                minSize = { size: 5, unit: 'KB' },
                maxSize = { size: 5, unit: 'MB' }
            } = options;

            const minSizeInBytes = minSize.unit === 'KB'
                ? minSize.size * 1024
                : minSize.size * 1024 * 1024;
            const maxSizeInBytes = maxSize.unit === 'KB'
                ? maxSize.size * 1024
                : maxSize.size * 1024 * 1024;

            if (file.size < minSizeInBytes) {
                isTooSmall = true;
            }
            if (file.size > maxSizeInBytes) {
                isTooLarge = true;
            }
        }

        return { isTooSmall, isTooLarge };
    }

    return new Promise((resolve, reject) => {
        const fileSize = checkFileSize();
        if (fileSize.isTooSmall) {
            reject(new Error('File size smaller than ' + (options?.minSize ?? '5KB')));
            return;
        } else if (fileSize.isTooLarge) {
            reject(new Error('File size larger than ' + (options?.maxSize ?? '5MB')));
            return;
        }
        const reader = new FileReader();
        reader.onload = () => {
            if (typeof reader.result === 'string') {
                resolve(reader.result);
            } else {
                reject(new Error('Failed to read data from file.'));
            }
        };

        reader.onerror = (error) => {
            reject(error);
        };
        reader.readAsDataURL(file);
    });
}


type StaticVariableSetterAction<TData> = (value: TData | ((prevValue: TData) => TData)) => void;

function defineStaticVariable<T>(iniValue: T): [T, StaticVariableSetterAction<T>] {
    let data: T = iniValue;
    const setter: StaticVariableSetterAction<T> = (newValueOrCallback: T | ((prevValue: T) => T)): void => {
        if (typeof newValueOrCallback === 'function') {
            data = (newValueOrCallback as (prevValue: T) => T)(data);
        } else {
            data = newValueOrCallback;
        }
    };

    return [data, setter];
}

const getEmptyFormFields = (form: HTMLFormElement, requiredOnly: boolean = false): TypeOfFormControl[] => {
    const formElements = Array.from(form.elements);
    var emptyFields = [];
    for (const element of formElements) {
        const input = element as TypeOfFormControl;
        if (requiredOnly && !input.required) {
            continue;
        }
        if (input.value === "") {
            emptyFields.push(input);
        }
    }

    return emptyFields;
}

const parseDate = (datetime: string | Date, format: string = 'DD/MM/YYYY H:i:s A') => {
    datetime = isDate(datetime) ? datetime : new Date(datetime);
    const formattedDate = formatDate(datetime, format);
    const [date, time, meridian] = formattedDate.split(' ');
    const dateSeparator = formattedDate.search('/') ? '/' : (formattedDate.search('-') ? '-' : '/');
    const [day, month, year] = date.split(dateSeparator);
    const yearArr = year.split('').chunk(2).map(chunk => chunk.join(''));

    return { day, month, year, yearArr, time, meridian }
}

export {
    isString,
    isNumber,
    isNumeric,
    isFunction,
    isDate,
    isBool,
    cn,
    formatNumber,
    formatCurrency,
    formatDate,
    humanReadableDateFormat,
    getElementSiblings,
    getEmptyFormFields,
    formDataToObjects,
    parseFormFields,
    convertToDotNotation,
    orderByDate,
    calculateTimeDifference,
    copyLink,
    parseFileToDataUri,
    defineStaticVariable,
    parseDate
}


declare global {
    interface Array<T> {
        /**
         * Splits an array into chunks of a specified size.
         * @param size The size of each chunk.
         * @returns An array of arrays, where each inner array contains `size` elements.
         */
        chunk(size: number): T[][];
        removeDuplicates(keys?: (keyof T)[] | keyof T | string): T[];
    }

    interface String {
        stripSpecialChar(replacement?: string, ignore?: string): string;
        truncateAt(length: number): string;
        isNumeric(this: string): boolean;
        isAlphanumeric(this: string): boolean;

    }
}

Array.prototype.chunk = function (size: number): any[][] {
    const result: any[][] = [];
    for (let i = 0; i < this.length; i += size) {
        result.push(this.slice(i, i + size));
    }
    return result;
};

Array.prototype.removeDuplicates = function <T>(this: T[], keys?: (keyof T)[] | keyof T | string): T[] {
    if (!keys) {
        return Array.from(new Set(this));
    }

    const seen = new Set();

    if (typeof keys === 'string') {
        return this.filter(item => {
            const keyValue = item[keys as (keyof T)];
            if (seen.has(keyValue)) {
                return false;
            } else {
                seen.add(keyValue);
                return true;
            }
        });
    }

    return this.filter(item => {
        const compositeKey = [...(keys as (keyof T)[])].map(key => item[key]).join('|');
        if (seen.has(compositeKey)) {
            return false;
        } else {
            seen.add(compositeKey);
            return true;
        }
    });
};

String.prototype.stripSpecialChar = function (replacement: string = '', ignore: string = ''): string {
    let regEx = /[^a-zA-Z0-9 ]/g
    // if (ignore.length) {
    //     regEx = /[^a-zA-Z0-9 ]/g
    // }

    return this.replace(regEx, replacement);
};

String.prototype.truncateAt = function (length: number) {
    return this.substring(0, length);
}

String.prototype.isNumeric = function (): boolean {
    return /^[0-9]+$/.test(this);
};

String.prototype.isAlphanumeric = function (): boolean {
    return /^[a-zA-Z0-9]+$/.test(this);
};