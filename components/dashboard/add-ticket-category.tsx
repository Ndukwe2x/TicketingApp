"use client";

import React, { FormEvent, FormEventHandler, MouseEvent, useCallback, useEffect, useRef, useState } from "react";
import { Accordion, AccordionItem } from "../ui/rix-ui/accordion/accordion";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { MdAdd, MdClose, MdPlusOne } from "react-icons/md";
import { Button } from "../ui/button";
import { cn, formDataToObjects, formatCurrency, parseFormFields } from "@/lib/utils";
// import { Content } from "next/font/google";
import { Text } from "../ui/text";
import { toast } from "../ui/sonner";
import { useFormData } from "@/hooks/useFormDataContext";

const CallbackContext = React.createContext<any>(null);
const RenderCategoryForm = (
    onNameChange: (ev: FormEvent<HTMLInputElement>) => void, 
    onPriceChange: (ev: FormEvent<HTMLInputElement>) => void,
    key: number | string,
    category?: TicketCategory
) => {
    
    const {formData, setFormData} = useFormData() as FormDataContextType;
    const [groupData, setGroupData] = useState({});
    
    const handleInput: FormEventHandler<HTMLInputElement> = (ev) => {
        const {name, value} = ev.target as HTMLInputElement;
        const fieldRole = name.split('[').pop();
        const fieldKey = fieldRole?.slice(0, fieldRole?.length - 1) as string;
        setGroupData(prevData => ({
            ...prevData,
            [fieldKey]: value
        }));
    }
    
    useEffect(() => {
        if (Object.values(groupData).length) {
            let currentFormData: Partial<SingleEvent> = {...formData};
            if ( !currentFormData.ticketCategories || typeof currentFormData.ticketCategories === 'string' ) {
                currentFormData.ticketCategories = [];
            }
            const index: number = typeof key === 'string' ? parseInt(key, 10) : key;

            setFormData(prevData => {
                let ticketCategories = prevData.ticketCategories || [];
                ticketCategories[index] = groupData;
                return {...prevData, ticketCategories: ticketCategories}
            });
        }
    }, [groupData]);

    return (
        <div className='flex flex-col gap-4 p-4'>
            <div className='flex flex-col gap-2'>
                <Label>Name:</Label>
                <Input name={`ticketCategories[${key}][name]`} placeholder='Category name'
                onChange={ (ev) => { onNameChange(ev); handleInput(ev) } } defaultValue={ category ? category.name : ''} />
            </div>
            <div className='flex gap-4'>
                <div className='flex flex-col gap-2'>
                    <Label>Price</Label>
                    <Input type='number' name={`ticketCategories[${key}][price]`} placeholder='1000'
                        onChange={(ev) => { onPriceChange(ev); handleInput(ev) }} defaultValue={ category ? (category.price as unknown) as string: '' } />
                </div>
                <div className='flex flex-col gap-2'>
                    <Label>Discount</Label>
                    <Input type='text' name={`ticketCategories[${key}][discount]`} placeholder='Eg: 2%' 
                    onChange={(ev) => handleInput(ev)}
                    defaultValue={ category ? category.discount : '' } />
                </div>
                <div className='flex flex-col gap-2'>
                    <Label>Quantity</Label>
                    <Input name={`ticketCategories[${key}][qty]`} type="number" onChange={(ev) => handleInput(ev)} defaultValue={ category ? category.qty : '' } />
                </div>
            </div>
        </div>
    )
}


interface CategoryGroupProps extends React.HtmlHTMLAttributes<HTMLDivElement> {
    groupId: string | number;
    category?: TicketCategory;
};

const TicketCategoryGroup: React.FC<CategoryGroupProps> = ({children, className, groupId, category, ...props}) => {
    const nameRef = React.useRef<HTMLSpanElement>(null);
    const priceRef = React.useRef<HTMLSpanElement>(null);
    
    /******* Show the Category name and price while the user types ********/
    const onNameChange = React.useCallback((ev: FormEvent<HTMLInputElement>) => {
        if ( !nameRef || !nameRef.current ) {
            return;
        }
        const {name, value} = ev.target as HTMLInputElement;
        let v;
        if (value.length >= 1) {
            v = value;
        } else {
            v = 'Category Name';
        }
        nameRef.current.innerText = v;
    }, []);

    const onPriceChange = React.useCallback((ev: FormEvent<HTMLInputElement>) => {
        if ( !priceRef || !priceRef.current ) {
            return;
        }
        const {name, value} = ev.target as HTMLInputElement;
        let v;
        if (value.length >= 1) {
            v = formatCurrency(parseInt(value, 10))
        } else {
            v = 'Price';
        }
        priceRef.current.innerText = v;
    }, []);


    /******** Enables deletion of category group if need be ********/
    const deleteGroup = (ev: MouseEvent):void => {
        ev.preventDefault();
        const target = ev.target as HTMLButtonElement;
        const targetGroup = target.closest('.category-group') as HTMLElement;
        if ( !targetGroup ) {
            return;
        }
        targetGroup.remove();
    }
    const deleteBtn = () => (
        <button type="button" onClick={deleteGroup} 
        className="inline-flex items-center justify-center mx-2 opacity-70 pr-3 text-black transition-opacity"
        title="Remove Category"
        ><MdClose /></button>
    );

    const panelHeader = <span className="border-r flex flex-1 items-center justify-between mr-2 pr-3">
            <span className="c_name responsive-text-2" ref={ nameRef }>{ category ? category.name : 'Category Name' }</span>
            <span className="c_price responsive-text-2" ref={ priceRef }>{ category ? formatCurrency(category.price) : 'Price' }</span>
        </span>;
    return (
        <AccordionItem 
            itemId={groupId}
            header={panelHeader}
            body={ RenderCategoryForm( onNameChange, onPriceChange, groupId, category ) }
            addon={deleteBtn()}
            className={cn('category-group border', className)} {...props} />
    )
}

const AddTicketCategory = ({categories}: {categories?: TicketCategory[] | null}) => {
    const [categoryGroupIndices, addCategoryGroupIndex] = React.useState<number[]>([]);

    const addCategoryGroup = (e: MouseEvent) => {
        const ticketCategoriesGroups = document.querySelector('#ticket-categories');
        const groups = ticketCategoriesGroups?.querySelectorAll('.category-group');
        const groupIndex: number = groups?.length || 0;
        addCategoryGroupIndex(existingIndices => [...existingIndices, groupIndex]);
    };

    return (
        <>
            <Text variant='p' className="leading-5 mt-0 text-muted-foreground text-xs" style={{marginTop: '0'}}>
            Hint: Click/tap on the 'Add Ticket Category' tab to add a new category accordion panel. 
            Then, click/tap on the panel to provide details. You can add multiple categories.</Text>
            <Accordion id="ticket-categories">
                {
                    (categories?.length) && 
                    categories?.map((category, index) => <TicketCategoryGroup category={category} groupId={index} key={index} />)
                }
                {
                    categoryGroupIndices.length > 0 && 
                    categoryGroupIndices.map((groupIndex, index) => <TicketCategoryGroup groupId={groupIndex} key={groupIndex} />)
                }
            </Accordion>
            <div>
                <Button type="button" variant='outline' 
                    onClick={ addCategoryGroup } 
                    className={cn('flex justify-between items-center w-full px-4 h-10 bg-muted hover:bg-muted/50')}><span>Add Ticket Category</span><MdAdd size={22} /></Button>
            </div>
        </>
    )
};


export default AddTicketCategory;