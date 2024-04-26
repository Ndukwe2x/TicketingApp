import React from "react";
import './accordion.css';
import { getElementSiblings } from "@/lib/utils";
import { MdArrowDownward, MdArrowDropDown, MdArrowDropUp, MdArrowUpward, MdExpand, MdExpandLess, MdExpandMore } from "react-icons/md";


type RixUiAccordionProps = React.HTMLAttributes<S> & {

};
const Accordion: React.FC<RixUiAccordionProps> = ({children, ...props}) => (
    <div { ...props } className={`rix-ui_accordion ${props.className || ''}`}>
        {
            children
        }
    </div>
)

const AccordionItem: React.FC<RixUiAccordionProps> = ({children, ...props}) => (
    <div {...props} className={`rix-ui_accordion-item ${props.className || ''}`}>
        { children }
    </div>
)

const AccordionHeader: React.FC<RixUiAccordionProps> = ({children, ...props}) => (
    <h3 {...props} className={`rix-ui_accordion-header ${props.className || ''}`}>
        { children }
    </h3>
)

const AccordionTrigger: React.FC<RixUiAccordionProps & {extras: S}> = ({children, extras, ...props}) => {
    const [open, toggleOpen] = React.useReducer(state => !state, false);

    const togglePanelState = React.useCallback((ev) => {
        const target = ev.target as HTMLElement;
        const btn = target.closest('button');
        const itemContainer = btn?.closest('.rix-ui_accordion-item');
        
        if ( !itemContainer ) {
            return;
        }
        const siblings = getElementSiblings(itemContainer);
        siblings.forEach((sib) => {
            sib.classList.remove('active');
        })
        itemContainer?.classList.toggle('active');
    }, []);

    return (
        <AccordionHeader className="flex gap-4 items-center">
            <button type="button" onClick={ (ev) => {togglePanelState(ev); toggleOpen() } } { ...props } className={`rix-ui_accordion-trigger ${props.className || ''}`}>
                { children } { open ? <MdExpandLess /> : <MdExpandMore /> }
            </button>
            {extras}
        </AccordionHeader>
    )
}

const AccordionContent: React.FC<RixUiAccordionProps> = ({children, ...props}) => (
    <div {...props} className={`rix-ui_accordion-content ${props.className || ''}`}>
        { children }
    </div>
)

export {
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent
}