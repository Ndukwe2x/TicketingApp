import React, { HtmlHTMLAttributes, useCallback, useEffect, useState } from "react";
import Modal from "../ui/modal";
import Link from "next/link";
import { MdPersonAdd } from "react-icons/md";
import UserForm from "../dashboard/user-form";
import { toast } from "../ui/sonner";
import { useRouter } from "next/navigation";
import { useGetEventsByIds, useGetEventsByUser } from "@/hooks/useGetEvents";
import { DataTable, DataTableLoading } from "../ui/data-table";
import { columns } from "../dashboard/table-columns/checkable-events";
import useAuthenticatedUser from "@/hooks/useAuthenticatedUser";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

const AddTeamMember = ({user, displayText, variant}: {user?: AppUser; displayText?: string | React.ReactNode; variant?: string}) => {
    const actor = useAuthenticatedUser();
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    const router = useRouter();
    const event = null;

    const handleClose = () => {
        setIsDialogOpen(false);
    }

    const handleSave = () => {
        setIsDialogOpen(false);
    }
    
    const btnText = actor?.isOwner
        ? 'Add New User'
        : 'Add Team Member'

    const btn = displayText || <Link href='#' 
    className={ cn('border border-primary flex flex-row hover:bg-primary', 
    'hover:text-primary-foreground items-end gap-1.5 py-1 md:py-2 px-1', 
    'md:px-2 lg:px-4 rounded-full text-primary')}>
            <MdPersonAdd size={24}/> <span>{ btnText }</span>
        </Link>;

    
    const handleSuccess = (data: NewlyCreatedUserAccountData) => {

        toast('User account created');
        setIsDialogOpen(state => !state);
        
        location.assign('/users/' + data.userId);
    };

    const handleFailure = (error: unknown) => {

    }
    
    const content = <UserForm actor={ actor }
        event={ event } 
        onSuccess={ handleSuccess }
        onFailure={ handleFailure } />;

    return (
        <>
            <Modal title={ btnText } 
                displayText={ displayText || btn } 
                content={ <SelectEventToAddTeamMember /> } 
                onSave={ handleSave } 
                onClose={ handleClose }
                open={ isDialogOpen }
                onOpenChange={setIsDialogOpen}
                style={ { maxWidth: '45rem' } } />
        </>
    )
}

const SelectEventToAddTeamMember: React.FC<HtmlHTMLAttributes<HTMLDivElement>> = ({children, className}) => {
    const actor = useAuthenticatedUser();
    const [isLoading, events, error] = useGetEventsByIds(actor?.eventRef as string[], actor as AppUser);
    
    // useEffect(() => {
    //     if ( !isLoading ) {
    //         if ( !events.length ) {
    //             setFallback('There are no events to show.');
    //         }
    //     }
    // }, [events, isLoading]);
    if ( isLoading ) {
        return <DataTableLoading />
    } else if ( events.length < 1 ) {
        return <div className="text-center">No events available. <br />To add a team member, you need to create an event <br />and then add and attach users to them.</div> 
    }

    return (
        <>
            <DataTable columns={ columns } data={ events } />
        </>
    );
}

const SelectableEvent = ({event}: {event: SingleEvent}) => {
    
    return (
        <li>

        </li>
    )
}

export default AddTeamMember;