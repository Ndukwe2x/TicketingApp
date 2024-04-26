"use client";

import React, { ReactNode, ReactPropTypes } from "react";
import { Accordion, AccordionItem, AccordionTrigger,  AccordionContent} from "../ui/rix-ui/accordion/accordion";
// import { AccordionContent, AccordionHeader, AccordionItem, AccordionTrigger } from "@radix-ui/react-accordion";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { MdAdd, MdClose, MdPlusOne } from "react-icons/md";
import { Button } from "../ui/button";
import { v4 as uuidv4 } from 'uuid';
import { cn, formatNumber } from "@/lib/utils";
import { Content } from "next/font/google";
import useFakeState from "@/hooks/fake-state";
import { Text } from "../ui/text";

// const FormContext = React.createContext([]);

const AddTicketCategory = () => {
    const cg: Array<React.JSX.Element> = [];
    const [categoryGroups, addToCategoryGroups] = React.useState(cg);
    // const [forms, setForms] = React.useState([]);
    const [formData, setFormData] = React.useState({});

    const addCategoryGroup = React.useCallback(() => {
        const ticketCategoriesGroups = document.querySelector('#ticket-categories');
        const groups = ticketCategoriesGroups?.querySelectorAll('.category-group');
        let groupId = 0;
        if (groups?.length) {
            groupId = groups.length
        };
        const buildGroup = <TicketCategoryGroup className='category-group border' groupId={groupId} key={uuidv4()} />;
        addToCategoryGroups((state) => {
            return [...state, buildGroup];
        });
    }, []);

    return (
        <>
            <Text variant='p' className="leading-5 mt-0 text-muted-foreground text-xs" style={{marginTop: '0'}}>
            Hint: Click/tap on the 'Add Ticket Category' button to add a new category accordion panel. 
            Then, click/tap on the panel to provide details. You can add multiple categories.</Text>
            {
                (categoryGroups.length > 0) && <Accordion id="ticket-categories" children={categoryGroups} />
            }
            <div>
                <Button type="button" variant='outline' 
                    onClick={ addCategoryGroup } 
                    className={cn('flex justify-between items-center w-full px-4 h-10 bg-muted hover:bg-muted/50')}><span>Add Ticket Category</span><MdAdd size={22} /></Button>
            </div>
        </>
    )
};

type CategoryGroupProps = React.HTMLAttributes<S> & {
    groupId: number | string;
};
const TicketCategoryGroup: React.FC<CategoryGroupProps> = ({groupId, ...props}) => {
    const nameRef = React.useRef<HTMLSpanElement>(null);
    const priceRef = React.useRef<HTMLSpanElement>(null);
    
    /******* Show the Category name and price while the user types ********/
    const onNameChange = React.useCallback((ev) => {
        if ( !nameRef || !nameRef.current ) {
            return;
        }
        const {name, value} = ev.target;
        let v;
        if (value.length >= 1) {
            v = value;
        } else {
            v = 'Category Name';
        }
        nameRef.current.innerText = v;
    }, []);

    const onPriceChange = React.useCallback((ev) => {
        if ( !priceRef || !priceRef.current ) {
            return;
        }
        const {name, value} = ev.target;
        let v;
        if (value.length >= 1) {
            v = 'N' + formatNumber(value)
        } else {
            v = 'Price';
        }
        priceRef.current.innerText = v;
    }, []);


    /******** Enables deletion of category group if need be ********/
    const deleteGroup = (ev):void => {
        ev.preventDefault();
        const targetGroup = ev.target.closest('.category-group') as HTMLElement;
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
    )

    return (
        <AccordionItem itemID={groupId} {...props}>
            <AccordionTrigger className={ cn('flex justify-between items-center w-full p-3') } extras={deleteBtn()}>
                <span className="border-r flex flex-1 items-center justify-between mr-2 pr-3">
                    <span className="c_name text-auto-scale" ref={ nameRef }>Category Name</span>
                    <span className="c_price text-auto-scale" ref={ priceRef }>Price</span>
                </span>
            </AccordionTrigger>
            <AccordionContent>
                {/* <RenderCategoryForm onNameChange={ onNameChange } onPriceChange={ onPriceChange } /> */}
                { RenderCategoryForm( onNameChange, onPriceChange, groupId ) }
            </AccordionContent>
        </AccordionItem>
    )
}

const RenderCategoryForm = (
    onNameChange: (ev: InputEvent) => void, 
    onPriceChange: (ev: InputEvent) => void,
    key: number
) => {
    return (
        <div className='flex flex-col gap-4 p-4'>
            <div className='flex flex-col gap-2'>
                <Label>Name:</Label>
                <Input name={`ticketCategories[${key}][name]`} placeholder='Category name'
                onInput={ (ev) => { onNameChange(ev) } } />
            </div>
            <div className='flex gap-4'>
                <div className='flex flex-col gap-2'>
                    <Label>Price</Label>
                    <Input type='number' name={`ticketCategories[${key}][price]`} placeholder='1000'
                        onInput={ onPriceChange } />
                </div>
                <div className='flex flex-col gap-2'>
                    <Label>Discount</Label>
                    <Input type='text' name={`ticketCategories[${key}][discount]`} placeholder='Eg: 2%' />
                </div>
                <div className='flex flex-col gap-2'>
                    <Label>Quantity</Label>
                    <Input name={`ticketCategories[${key}][qty]`} type="number" />
                </div>
            </div>
        </div>
    )
}

export default AddTicketCategory;