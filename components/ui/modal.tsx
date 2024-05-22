import React, { ReactNode } from 'react';
import {
    Dialog,
    DialogPortal,
    DialogOverlay,
    DialogTrigger,
    DialogClose,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle,
    DialogDescription,
} from './dialog';
import { Button } from './button';

interface ModalProps {
    title: string;
    displayText: string|ReactNode;
    content: ReactNode|string;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    description?: string;
    style?: {};
    onSave?: () => void;
    onClose?: () => void;
    footerButtons?: ReactNode|boolean;
}

const Modal: React.FC<ModalProps> = ({title, displayText, content, open, onOpenChange, description, style, onSave, onClose, footerButtons = false, ...props}) => {
    // const [isOpen, setIsOpen] = React.useState(false);

    // const toggleState = React.useCallback((state: boolean) => {
    //     setIsOpen(state);
    // }, [])
    // React.useEffect(() => {

    // }, [])

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                { displayText }
            </DialogTrigger>
            <DialogContent className='dialog-responsive'>
                <DialogHeader className='dialog-header'>
                    <DialogTitle>{ title }</DialogTitle>
                </DialogHeader>
                <div className='dialog-body'>{ content }</div>
                {
                    footerButtons && 
                    <DialogFooter>
                        { footerButtons }
                    </DialogFooter>
                }
            </DialogContent>
        </Dialog>
    )
}

export default Modal;