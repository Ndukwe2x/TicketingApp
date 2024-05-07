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
    description?: ReactNode|string;
    footerButtons?: ReactNode|boolean;
    style?: {};
    onSave?: () => void;
    onClose?: () => void;
}

const Modal: React.FC<ModalProps> = ({title, displayText, description, footerButtons = false, style, onSave, onClose, ...props}) => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                { displayText }
            </DialogTrigger>
            <DialogContent className='dialog-responsive'>
                <DialogHeader className='dialog-header'>
                    <DialogTitle>{ title }</DialogTitle>
                </DialogHeader>
                <div className='dialog-body'>{ description }</div>
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