import React, { useEffect } from "react";
import './accordion.css';
import { cn, getElementSiblings } from "@/lib/utils";
import { MdArrowDownward, MdArrowDropDown, MdArrowDropUp, MdArrowUpward, MdExpand, MdExpandLess, MdExpandMore } from "react-icons/md";


interface RixUiAccordionProps extends React.HTMLAttributes<HTMLDivElement | HTMLButtonElement> {

};


const PanelContext = React.createContext<[boolean, React.DispatchWithoutAction] | null>(null);

const Accordion = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> &
    RixUiAccordionProps
>(({ children, className, ...props }, ref) => (
    <div className={cn('rix-ui_accordion', className)} {...props} ref={ref}>
        {
            children
        }
    </div>
));

Accordion.displayName = 'Accordion';

const AccordionTrigger = React.forwardRef<
    HTMLButtonElement,
    React.HTMLAttributes<HTMLButtonElement> &
    RixUiAccordionProps
>(({ children, className, ...props }, ref) => {
    const [open, toggleOpen] = React.useContext(PanelContext) as [boolean, React.DispatchWithoutAction]

    return (
        <button type='button' onClick={() => { toggleOpen() }} {...props} ref={ref}
            className={cn('rix-ui_accordion-trigger w-full', className)}>
            {children} {open ? <MdExpandLess /> : <MdExpandMore />}
        </button>
    )
});
AccordionTrigger.displayName = 'AccordionTrigger';

const AccordionHeader = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> &
    RixUiAccordionProps &
    { addon?: React.ReactNode | null }>(({ children, className, addon, ...props }, ref) => (
        <div className={cn('rix-ui_accordion-header', className)} ref={ref}>
            <h3 className='flex justify-between items-center w-full p-3'>
                <AccordionTrigger className='flex gap-4 items-center' {...props}>
                    {children}
                </AccordionTrigger>
                {addon ?? ''}
            </h3>
        </div>
    ));
AccordionHeader.displayName = 'AccordionHeader';


const AccordionContent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> &
    RixUiAccordionProps>(({ children, ...props }, ref) => (
        <div {...props} className={`rix-ui_accordion-content ${props.className || ''}`} ref={ref}>
            {children}
        </div>
    ));
AccordionContent.displayName = 'AccordionContent';

const AccordionItem = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> &
    RixUiAccordionProps &
    { itemId: string | number; header: React.ReactNode; body: React.ReactNode, addon?: React.ReactNode }>((
        { children, className, itemId, header, body, addon, ...props },
        ref
    ) => {
        const [open, toggleOpen] = React.useReducer(state => !state, false);

        return (
            <PanelContext.Provider value={[open, toggleOpen]}>
                <div id={itemId as string} className={cn('rix-ui_accordion-item', className, open ? 'active' : '')} {...props} ref={ref}>
                    <AccordionHeader className={cn('')} addon={addon}>
                        {header}
                    </AccordionHeader>
                    <AccordionContent>
                        {body}
                    </AccordionContent>
                </div>
            </PanelContext.Provider>
        )
    });

AccordionItem.displayName = 'AccordionItem';

export {
    Accordion,
    AccordionItem
}