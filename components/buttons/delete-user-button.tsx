"use client";

import React, { HtmlHTMLAttributes, MouseEvent, useState } from "react";
import { Button } from "../ui/button";
import axios from "axios";
import { Api } from "@/lib/api";
import { toast } from "../ui/sonner";
import { MdClose, MdDelete } from "react-icons/md";
import { cn } from "@/lib/utils";
import { Icons } from "../icons";

interface ButtonProps extends HtmlHTMLAttributes<HTMLButtonElement> {
    actor: AppUser;
    account: AppUser;
    onInit?(): boolean;
    onSuccess?(deletedUserId: string): void;
    onFailure?(error?: Error | unknown): void;
    variant?: any;
}
const DeleteUserButton: React.FC<ButtonProps> = ({ children, className, actor, account, onInit, onSuccess, onFailure, variant, ...props }) => {
    const [isSuccessful, setIsSuccessful] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleDeleteAction = (ev: MouseEvent) => {
        const confirmed = confirm(`Are you sure you want to delete ${account.fullName}?`);
        if (!confirmed) {
            return;
        }

        onInit && onInit();
        setIsLoading(true);
        const url = Api.server + Api.endpoints.admin.singleUser.replace(':id', account.id);
        axios.delete(url, {
            headers: {
                Authorization: `Bearer ${actor.token}`
            }
        })
            .then(res => {
                let result = res.data;
                if (result.status === 'success') {
                    setIsSuccessful(true);
                    setIsLoading(false);
                    if (onSuccess) onSuccess(result.userId);

                    toast('Account deleted successfully');
                    // if (t) location.assign('/users');
                }
            })
            .catch(err => {
                toast('Sorry, the account could not be deleted.');
                setIsLoading(false);
                onFailure && onFailure(err);
            });
    }

    return (
        <Button onClick={handleDeleteAction}
            variant={variant || 'default'}
            className={className}
            type="button" {...props}>
            {isLoading && <>Deleting... <Icons.spinner className='mr-2 h-4 w-4 animate-spin' /></>}
            {!isLoading && (children || <>Delete<MdClose size={18} className="ml-2" /></>)}
        </Button>
    )
}

export default DeleteUserButton;