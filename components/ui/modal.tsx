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
    content: string|ReactNode;
    displayText: string|ReactNode;
    onSave: () => void;
    onClose: () => void;
    style?: {};
    footerButtons?: ReactNode|boolean;
    description?: string|null;
}

const Modal: React.FC<ModalProps> = ({title, content, displayText, onSave, onClose, style, footerButtons = false, description, ...props}) => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                { displayText }
            </DialogTrigger>
            <DialogPortal>
                <DialogContent style={ style }>
                    <DialogHeader>
                        <DialogTitle>{ title }</DialogTitle>
                    </DialogHeader>
                    
                    {
                        description 
                            ? <DialogDescription>{ description }</DialogDescription>
                            : ''
                    }
                    { content }
                    {
                        footerButtons && 
                        <DialogFooter>
                            { footerButtons }
                        </DialogFooter>
                    }
                </DialogContent>
            </DialogPortal>
        </Dialog>
    )
}

export default Modal;