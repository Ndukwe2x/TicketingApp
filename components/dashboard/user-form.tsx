"use client";

import * as React from "react"
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Api } from "@/lib/api";
import { Text } from "../ui/text";
import { Icons } from "../icons";
import styles from '../styles/styles.module.css';
import axios from "axios";
import { APPCONFIG } from "@/lib/app-config";
import { capitalCase } from "change-case";
import PasswordGenerator from "../password-generator";
import { Label } from "../ui/label";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { useCallback } from "react";


const UserForm = (
    { actor, onSuccess, onFailure, action, isNew = true, account = null, eventsToAttach = [] }:
        {
            actor: AppUser;
            onSuccess?: (data: NewlyCreatedUserAccountData | AppUser) => void;
            onFailure?: (error?: unknown) => void;
            action?: string;
            isNew?: boolean;
            account?: AppUser | null;
            eventsToAttach: string[]
        }
) => {
    const [isFirstPage, setIsFirstPage] = React.useState<boolean>(true);
    const [isLastPage, setIsLastPage] = React.useState<boolean>(false);
    const [isCurrentPageCompleted, setIsCurrentPageCompleted] = React.useState<boolean>(false);
    const [pageNumber, setPageNumber] = React.useState(1);
    const pageBaseClass = 'user-form-page';
    const pageActiveClass = 'active';
    const currentPageSelector = `.${pageBaseClass}.${pageActiveClass}`;
    const { accountTypes, userRoles } = APPCONFIG;

    const dynamicCurrentPage = () => document.querySelector(currentPageSelector);
    const [pages, setPages] = React.useState<Array<Element>>([]);
    const [pageCount, setPageCount] = React.useState(1);
    const [selectedAccountType, setSelectedAccountType] = React.useState((account ? account.accountType : null));
    const [selectedRole, setSelectedRole] = React.useState((account ? account.role : null));
    // const [randomPassword, setRandomPassword] = React.useState(
    //     generateRandomString(10, 'alphanumeric', true)
    // );
    const [passwordHidden, togglePasswordHidden] = React.useReducer(state => !state, true);

    const updatePageStatus = useCallback((): void => {
        const getInputsFromCurrentPage = () => {
            const fieldList = 'input:not([type="file"]), textarea, select';
            return document.querySelector(currentPageSelector)?.querySelectorAll(fieldList);
        }
        const inputs = getInputsFromCurrentPage();
        let totalUnfilled = 0;

        inputs?.forEach(item => {
            let itemHasValue = item.value || false;
            if (!itemHasValue) {
                totalUnfilled += 1;
            }
        });

        if (totalUnfilled == 0) {
            setIsCurrentPageCompleted(true)
        } else {
            setIsCurrentPageCompleted(false)
        }
    }, [currentPageSelector]);
    updatePageStatus();

    React.useEffect(() => {
        const updatePages = () => {
            const pageElements = document.querySelectorAll(`.${pageBaseClass}`);
            setPages(Array.from(pageElements));
            setPageCount(pageElements.length);
            setIsLastPage(
                pageElements.length === 1
            )
        };

        updatePages();

        const observer = new MutationObserver(updatePages);
        const config = { childList: true, subtree: true };
        const targetNode = document.getElementById('user-form');

        observer.observe(targetNode, config);

        return () => {
            observer.disconnect();
        };
    }, []);

    const gotoNextPage = (ev: MouseEvent) => {
        ev.preventDefault();

        if (!isCurrentPageCompleted) {
            return;
        }
        if (ev.target.type == 'submit') {
            document.getElementById('user-form')?.dispatchEvent(
                new Event('submit')
            );
            return;
        }
        const staticCurrentPage = document.querySelector(currentPageSelector);
        staticCurrentPage?.classList.remove(pageActiveClass);
        staticCurrentPage?.nextElementSibling?.classList.add(pageActiveClass);
        updatePageStatus();
        setIsFirstPage(false);

        // const pagesArr = Array.from(pages);
        if (pages.pop()?.id == dynamicCurrentPage()?.id) {
            setIsLastPage(true)
        } else {
            setIsLastPage(false)
        }
        setPageNumber(state => {
            if (state >= pageCount) {
                state = pageCount;
            } else {
                state += 1
            }
            return state;
        });
    }

    const backToPreviousPage = (ev: MouseEvent) => {
        ev.preventDefault();

        const staticCurrentPage = document.querySelector(currentPageSelector);
        staticCurrentPage?.classList.remove(pageActiveClass);
        staticCurrentPage?.previousElementSibling?.classList.add(pageActiveClass);
        updatePageStatus();
        setIsLastPage(false);

        const pagesArr = Array.from(pages);
        if (pagesArr[0]?.id == dynamicCurrentPage()?.id) {
            setIsFirstPage(true);
        } else {
            setIsFirstPage(false)
            // setPageNumber(state => state - 1);
        }
        setPageNumber(state => {
            if (state <= 1) {
                state = 1;
            } else {
                state -= 1
            }
            return state;
        });
    }

    const createSuspense = (containerId: string | HTMLElement, hideUploadBtn: boolean = true): void => {
        const container: HTMLElement | null =
            typeof containerId === 'string'
                ? document.querySelector(containerId)
                : containerId;

        if (!container) {
            console.error('Target container not found.');
            return;
        }

        const loading = document.createElement('div');
        const spinner = document.createElement('span');
        const hint = document.createElement('span');

        spinner.classList.add(styles.spinner);
        hint.innerText = 'Loading, please wait...';
        hint.classList.add(styles.hint);
        loading.classList.add('suspense', styles.content_loading);
        loading.appendChild(spinner);
        loading.appendChild(hint);
        container.appendChild(loading);

        const uploadBtn = container.parentElement?.getElementsByClassName('upload-btn')[0];
        if (uploadBtn && hideUploadBtn) {
            // container.parentElement?.removeChild(uploadBtn);
            uploadBtn.remove();
        }

        container.style.display = 'flex';
    };

    const handleSubmit = (ev: SubmitEvent) => {
        if (!ev.defaultPrevented) {
            ev.preventDefault();
        }

        const form = ev.target as HTMLFormElement;
        const formData = new FormData(form);
        let finalData = (Object.fromEntries(formData.entries()) as unknown) as UserInfo;
        if (eventsToAttach.length > 0) {
            finalData = { ...finalData, eventRef: eventsToAttach }
        }

        axios.post(form.action, finalData, {
            headers: {
                Authorization: `Bearer ${actor.token}`
            }
        })
            .then(
                response => {
                    const { userId } = typeof response.data === 'string'
                        ? JSON.parse(response.data)
                        : response.data;

                    if (typeof onSuccess === 'function') {
                        onSuccess(response.data);
                    } else {
                        console.log('Account created successfully');
                    }
                }
            )
            .catch(error => {
                if (typeof onFailure === 'function') {
                    onFailure(error);
                } else {
                    console.error(error);
                }
            });
    }

    const passRef = React.useRef(null);
    const rePassRef = React.useRef(null);

    return (
        <>
            <form
                id="user-form"
                action={action || Api.server + Api.endpoints.admin.register}
                method={isNew ? 'post' : 'patch'}
                onSubmit={handleSubmit}>
                <div className='flex flex-col gap-4 py-4'>
                    {/* <div>
                        <Text variant='p'>Step {pageNumber} of {pageCount}</Text>
                    </div> */}
                    <div id="user-form_page_a" className={`${pageBaseClass} ${pageActiveClass} flex flex-col gap-4 flex-1`}>
                        {/* <Text variant='h3'>User Info</Text> */}
                        <p className="text-muted-foreground text-xs required">All fields are required except otherwise indicated</p>
                        <div className="grid md:grid-cols-2 gap-5">
                            <div className='flex flex-col gap-2 flex-1'>
                                <Label htmlFor='firstName'>Firstname:</Label>
                                <Input id='firstName' name="firstName" type='text' className="text-lg responsive-text-2"
                                    placeholder='Firstname:' defaultValue={account ? account.firstname : ''} required aria-required='true' />
                            </div>
                            <div className='flex flex-col gap-2 flex-1'>
                                <Label htmlFor='lastName'>Lastname:</Label>
                                <Input id='lastName' name="lastName" type='text' className="text-lg responsive-text-2"
                                    placeholder='Lastname:' defaultValue={account ? account.lastname : ''} required aria-required='true' />
                            </div>
                        </div>

                        <div className='flex flex-col gap-2'>
                            <Label htmlFor='email'>Email:</Label>
                            <Input id='email' name="email" type='email' className="text-lg responsive-text-2"
                                placeholder='Email:' defaultValue={account ? account.email : ''} required aria-required='true' />
                        </div>
                        <div className='flex flex-col gap-2'>
                            <Label htmlFor='phone'>Phone:</Label>
                            <Input id='phone' name="phone" type='tel' className="text-lg responsive-text-2"
                                placeholder='Phone:' defaultValue={account ? account.phone : ''} required aria-required='true' />
                        </div>
                        <div className="gap-5 grid md:grid-cols-2">
                            {
                                actor !== null && actor.isOwner ?
                                    <div className='flex flex-col gap-2'>
                                        <Label htmlFor='account-type'>Account Type:</Label>
                                        <Select name="accountType" required aria-required='true' value={selectedAccountType ?? ''} defaultValue={selectedAccountType ?? ''} onValueChange={setSelectedAccountType} >
                                            <SelectTrigger>
                                                <SelectValue placeholder='Select account type' />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {
                                                    accountTypes.map(
                                                        (accountType, index) => <SelectItem key={index} value={accountType}>{capitalCase(accountType)}</SelectItem>
                                                    )
                                                }
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    :
                                    <Input name="accountType" type='hidden' value='user' />

                            }
                            <div className='flex flex-col gap-2'>
                                <Label htmlFor='account-role'>Role:</Label>
                                <Select name="role" value={selectedRole ?? ''} defaultValue={selectedRole ?? ''} onValueChange={setSelectedRole} required aria-required='true'>
                                    <SelectTrigger>
                                        <SelectValue placeholder='Select user role' />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {
                                            userRoles.map(
                                                (role, index) => <SelectItem key={index} value={role}>{role}</SelectItem>
                                            )
                                        }
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        {
                            isNew &&
                            <>
                                <div className='flex flex-col gap-2'>
                                    <Label htmlFor='password'>Password:</Label>
                                    <div className="relative">
                                        <Input id='password' name="password" type={passwordHidden ? 'password' : 'text'}
                                            onChange={updatePageStatus} ref={passRef}
                                            className="text-lg responsive-text-2" placeholder='Password:' required aria-required='true' />
                                        <Button onClick={() => togglePasswordHidden()} variant={null}
                                            className="absolute top-0 right-0" type="button">
                                            {passwordHidden ? (<FaEye />) : (<FaEyeSlash />)}
                                        </Button>
                                    </div>
                                </div>
                                <div className='flex flex-col gap-2'>
                                    <Label htmlFor='re-password'>Re-Password:</Label>
                                    <div className="relative">
                                        <Input id='re-password' name="re_password" type={passwordHidden ? 'password' : 'text'}
                                            onChange={updatePageStatus} ref={rePassRef}
                                            className="text-lg responsive-text-2"
                                            placeholder='Re-Password:'
                                            required aria-required='true' />
                                        <Button onClick={() => togglePasswordHidden()} variant={null}
                                            className="absolute top-0 right-0" type="button">
                                            {passwordHidden ? (<FaEye />) : (<FaEyeSlash />)}
                                        </Button>
                                    </div>
                                </div>
                                <PasswordGenerator onClick={updatePageStatus} outputRef={[passRef, rePassRef]} options={{ length: 16 }} />
                            </>
                        }
                    </div>

                    <div className="flex flex-row justify-content-between pt-5">
                        {/* { !isFirstPage && <Button type="button" onClick={ backToPreviousPage } className="max-w-max"><Icons.backward /> Back</Button> } */}
                        {isLastPage && <Button type='submit' disabled={!isCurrentPageCompleted} className="max-w-max ml-auto">Submit <Icons.forward /></Button>}
                        {/* { !isLastPage && <Button type='button' disabled={ !isCurrentPageCompleted } onClick={ gotoNextPage } className="max-w-max ml-auto">Next <Icons.forward /></Button> } */}
                    </div>
                </div>
            </form>
        </>
    )
}

export default UserForm;