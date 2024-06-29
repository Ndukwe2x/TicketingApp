import React, { useEffect } from "react";
import './accordion.css';
import { cn, getElementSiblings } from "@/lib/utils";
import { MdArrowDownward, MdArrowDropDown, MdArrowDropUp, MdArrowUpward, MdExpand, MdExpandLess, MdExpandMore } from "react-icons/md";
import { Providers } from "@/app/providers";


interface RixUiAccordionProps extends React.HtmlHTMLAttributes<HTMLDivElement> {

};


const PanelContext = React.createContext<[boolean, React.DispatchWithoutAction] | null>(null);

const Accordion: React.FC<RixUiAccordionProps> = ({ children, className, ...props }) => (
    <div className={cn('rix-ui_accordion', className)} {...props}>
        {
            children
        }
    </div>
)

const AccordionTrigger: React.FC<RixUiAccordionProps> = ({ children, className, ...props }) => {
    const [open, toggleOpen] = React.useContext(PanelContext) as [boolean, React.DispatchWithoutAction]

    return (
        <button type="button" onClick={(ev) => { toggleOpen() }} {...props} className={cn('rix-ui_accordion-trigger w-full', className)}>
            {children} {open ? <MdExpandLess /> : <MdExpandMore />}
        </button>
    )
}


const AccordionHeader: React.FC<RixUiAccordionProps & { addon?: React.ReactNode | null }> = ({ children, className, addon, ...props }) => (
    <div className={cn('rix-ui_accordion-header', className)}>
        <h3 className='flex justify-between items-center w-full p-3'>
            <AccordionTrigger className='flex gap-4 items-center' {...props}>
                {children}
            </AccordionTrigger>
            {addon ?? ''}
        </h3>
    </div>
)


const AccordionContent: React.FC<RixUiAccordionProps> = ({ children, ...props }) => (
    <div {...props} className={`rix-ui_accordion-content ${props.className || ''}`}>
        {children}
    </div>
);

const AccordionItem: React.FC<RixUiAccordionProps &
{ itemId: string | number; header: React.ReactNode; body: React.ReactNode, addon?: React.ReactNode }> = (
    { children, className, itemId, header, body, addon, ...props }
) => {
        const [open, toggleOpen] = React.useReducer(state => !state, false);

        return (
            <PanelContext.Provider value={[open, toggleOpen]}>
                <div itemID={itemId} className={cn('rix-ui_accordion-item', className, open ? 'active' : '')} {...props}>
                    <AccordionHeader className={cn('')} addon={addon}>
                        {header}
                    </AccordionHeader>
                    <AccordionContent>
                        {body}
                    </AccordionContent>
                </div>
            </PanelContext.Provider>
        )
    }

export {
    Accordion,
    AccordionItem
}