"use client";

import React, { HtmlHTMLAttributes, MouseEvent } from "react";
import { Button } from "../ui/button";
import axios from "axios";
import { Api } from "@/lib/api";
import { toast } from "../ui/sonner";
import { MdClose, MdDelete } from "react-icons/md";
import { cn } from "@/lib/utils";

interface ButtonProps extends HtmlHTMLAttributes<HTMLButtonElement> {
    actor: AppUser; 
    account: AppUser; 
    callback?: (deletedUserId: string) => void;
}
const DeleteUserButton: React.FC<ButtonProps> = ({children, className, actor, account, callback, ...props}) => {
    const [isSuccessful, setIsSuccessful] = React.useState(false);

    const handleDeleteAction = (ev: MouseEvent) => {
        const confirmed = confirm(`Are you sure you want to delete ${account.fullName}?`);

        if ( !confirmed ) {
            return;
        }

        const url = Api.server + Api.endpoints.admin.singleUser.replace(':id', account.id);
        axios.delete(url, {
            headers: {
                Authorization: `Bearer ${actor.token}`
            }
        })
        .then(res => {
            let result = res.data;
            if ( result.status === 'success' ) {
                toast('Account deleted.');
                if (callback) callback(result.userId);
                setIsSuccessful(true);
            }
        })
        .catch(err => {
            toast('Sorry, the account could not be deleted.');
        });
    }

    return (
        <Button onClick={ handleDeleteAction } className={ className } type="button" { ...props }>
            Delete <MdClose size={ 18 } className="ml-2" />
        </Button>
    )
}

export default DeleteUserButton;