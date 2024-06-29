import React, { FormEvent, HtmlHTMLAttributes, useEffect, useRef, useState } from "react";
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
import { cn, formatDate } from "@/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Checkbox } from "../ui/checkbox";
import { CheckboxProps } from "@radix-ui/react-checkbox";
import { Input } from "../ui/input";
import CreateUserButton from "./create-user-button";
import { Skeleton } from "../ui/skeleton";

const AddTeamMember = ({ user, displayText, variant }: { user?: AppUser; displayText?: string | React.ReactNode; variant?: string }) => {
    const actor = useAuthenticatedUser();
    const [dialogOpenState, toggleDialogOpenState] = React.useReducer(state => !state, false);
    // const router = useRouter();
    // const event = null;

    const handleClose = () => {
        toggleDialogOpenState();
    }

    const handleSave = () => {
        toggleDialogOpenState();
    }

    const btnText = actor?.isOwner
        ? 'Add New User'
        : 'Add Team Member'

    const btn = displayText || <Link href='#'
        className={cn('border border-primary flex flex-row hover:bg-primary',
            'hover:text-primary-foreground items-end gap-1.5 py-1 md:py-2 px-1',
            'md:px-2 lg:px-4 rounded-full text-primary')}>
        <MdPersonAdd size={24} /> <span>{btnText}</span>
    </Link>;


    const handleSuccess = (data: NewlyCreatedUserAccountData) => {

        toast('User account created and successfully added as a team for the selected event(s)');
        toggleDialogOpenState();

        location.assign('/users/' + data.userId);
    };

    const handleFailure = (error: any) => {
        toast('Unable to create user account')
    }


    return (
        actor ? (
            <Modal title={btnText}
                displayText={displayText || btn}
                content={<SelectEventToAddTeamMember onSuccess={handleSuccess} onFailure={handleFailure} />}
                onSave={handleSave}
                onClose={handleClose}
                open={dialogOpenState}
                onOpenChange={toggleDialogOpenState}
                style={{ maxWidth: '45rem' }} />
        ) : (
            <Skeleton className="h-10 rounded-full" />
        )
    )
}

const SelectEventToAddTeamMember:
    React.FC<HtmlHTMLAttributes<HTMLDivElement> &
    {
        onSuccess?: (data: NewlyCreatedUserAccountData) => void;
        onFailure?: (error: any) => void;
    }
    > = ({ children, className, onSuccess, onFailure }) => {

        const actor = useAuthenticatedUser();
        const [isLoading, events, error] = useGetEventsByIds(actor?.eventRef as string[], actor as AppUser);
        const [fallback, setFallback] = useState<string | React.ReactNode>('Fetching your events, please wait...');

        useEffect(() => {
            if (error) {
                let errorMsg: any;
                switch (error.code) {
                    case 'ERR_NETWORK':
                        if (!navigator.onLine) {
                            errorMsg = (<span>
                                Network Error. <br />
                                Your device is currently offline. <br />
                                Please reconnect and refresh the page.</span>);
                        } else {
                            errorMsg = <span>The server encountered an error while trying to fetch your events.</span>;
                        }
                        break;
                    default:
                        errorMsg = <span>An unknown error has occurred</span>;
                        break;
                }
                setFallback(errorMsg);
                return;
            }
            if (!isLoading && !error) {
                if (!events.length) {
                    setFallback(<div>
                        No events available.
                        <br />
                        To add a team member, you need to create an event
                        <br />
                        and then add and attach users to them.</div>);
                }
                return;
            }
            return () => {

            }
        }, [events, isLoading, error]);

        const checkRef = useRef<Record<string, HTMLInputElement>>({});
        const masterCheckerRef = useRef<HTMLInputElement>(null);
        const formRef = useRef<HTMLDivElement>(null);
        const [selections, setSelections] = useState<string[]>([]);

        const toggleCheckAll = (e: FormEvent) => {
            if (!checkRef.current) {
                return;
            }

            const masterChecker = e.target as HTMLInputElement;
            Object.values(checkRef.current).map(checkbox => {
                checkbox.checked = masterChecker.checked;
            });
            updateSelections();
        }

        const handleCheckboxChange = (eventId: string) => {
            if (!checkRef.current || !masterCheckerRef.current) {
                return;
            }
            const checkbox = checkRef.current[eventId] as HTMLInputElement;
            if (masterCheckerRef.current.checked) {
                masterCheckerRef.current.checked = false;
                Object.values(checkRef.current).map(chbx => (
                    chbx.checked = false
                ))
            }
            checkbox.checked = true;
            updateSelections();
        }

        const updateSelections = () => {
            if (!checkRef.current) {
                return;
            }

            const allChecks = Object.values(checkRef.current);
            const newSelections: string[] = (
                allChecks
                    .filter(check => check.checked)
                    .map(check => {
                        if (check.checked) {
                            return check.value;
                        }
                    }) as string[]
            );

            setSelections(newSelections);
        }

        const gotoNextPage = () => {
            // const pages = document.querySelectorAll('.form-page');
            if (formRef.current === null) {
                return;
            }
            const currentPage = formRef.current.querySelector('.form-page.current');
            if (currentPage === null) {
                return;
            }
            currentPage.classList.remove('current');
            currentPage.nextElementSibling?.classList.add('current');

        }

        return (
            <>
                {
                    (events.length > 0) ? (
                        <div ref={formRef}>
                            <section id="event-selector" className="form-page current">
                                {/* <DataTable columns={columns} data={events} fallback={fallback} /> */}
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>
                                                <Input ref={masterCheckerRef} type="checkbox" name={`check_all_events`} onChange={toggleCheckAll} />
                                            </TableHead>
                                            <TableHead>Title</TableHead>
                                            <TableHead>State</TableHead>
                                            <TableHead>City</TableHead>
                                            <TableHead>Date</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {
                                            events.map((event, index) => (
                                                <TableRow key={event._id}>
                                                    <TableCell>
                                                        <label htmlFor={`check_event_${index}`} className="hidden"
                                                        >{event.title}</label>
                                                        <Input id={`check_event_${index}`} type="checkbox"
                                                            ref={(el) => (checkRef.current[event._id] = el as HTMLInputElement)} className="event-check"
                                                            name={`check_event_${index}`} value={event._id}
                                                            onChange={e => handleCheckboxChange(e.target.value)} />
                                                    </TableCell>
                                                    <TableCell>{event.title}</TableCell>
                                                    <TableCell>{event.state}</TableCell>
                                                    <TableCell>{event.city}</TableCell>
                                                    <TableCell>{formatDate(new Date(event.eventDate), "DD MM, YYYY")}</TableCell>
                                                </TableRow>
                                            ))
                                        }
                                    </TableBody>
                                </Table>
                                <div className="flex justify-between items-center">
                                    <Button className="ml-auto" type="button"
                                        disabled={selections.length < 1}
                                        onClick={gotoNextPage}>Add team members</Button>
                                </div>
                            </section>
                            <section id="user-selector" className="form-page">
                                <div>
                                    <UserForm actor={actor as AppUser} onSuccess={onSuccess} eventsToAttach={selections} />
                                </div>
                            </section>
                        </div>
                    ) : (
                        <div className="text-center">
                            {fallback}
                        </div>
                    )
                }
            </>
        );
    }


export default AddTeamMember;