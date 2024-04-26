"use client";

import * as React from "react"
import { Button } from "../ui/button"
import Modal from "../ui/modal";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Api } from "@/lib/api";
import { Text } from "../ui/text";
import { Textarea } from "../ui/textarea";
// import { ButtonIcon } from "@radix-ui/react-icons";
import { Icons } from "../icons";
import styles from '../styles/styles.module.css';
import MediaUploader from "../buttons/media-uploader-2";
import axios from "axios";
import { User } from "@/lib/logged-user";
import { Checkbox } from "../ui/checkbox";
import Link from "next/link";


const CreateUserForm = () => {
    const [isFirstPage, setIsFirstPage] = React.useState<boolean>(true);
    const [isLastPage, setIsLastPage] = React.useState<boolean>(false);
    const [isCurrentPageCompleted, setIsCurrentPageCompleted] = React.useState<boolean>(false);
    const [pageNumber, setPageNumber] = React.useState(1);
    const pageBaseClass = styles.event_form_page;
    const pageActiveClass = styles.current;
    const currentPageSelector = `.${pageBaseClass}.${pageActiveClass}`;
    
    const dynamicCurrentPage = () => document.querySelector(currentPageSelector);

    const getInputsFromCurrentPage = () => {
        const fieldList = 'input:not([type="file"]), textarea, select';
        return document.querySelector(currentPageSelector)?.querySelectorAll(fieldList);
    }
    
    const [pages, setPages] = React.useState<Array<Element>>([]);
    const [pageCount, setPageCount] = React.useState(1);

    React.useEffect(() => {
        const updatePages = () => {
            const pageElements = document.querySelectorAll(`.${pageBaseClass}`);
            setPages(Array.from(pageElements));
            setPageCount(pageElements.length);
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

    const updatePageStatus = (): void => {
        const inputs = getInputsFromCurrentPage();
        let totalUnfilled = 0;

        inputs?.forEach(item => {
            let itemHasValue = item.value ?? false;
            if (!itemHasValue) {
                totalUnfilled += 1;
            }
        });

        if (totalUnfilled == 0) {
            setIsCurrentPageCompleted(true)
        } else {
            setIsCurrentPageCompleted(false)
        }
    };

    const gotoNextPage = (ev: MouseEvent) => {
        ev.preventDefault();

        if ( !isCurrentPageCompleted ) {
            return;
        }
        if ( ev.target.type == 'submit') {
            document.getElementById('user-form')?.dispatchEvent(
                new Event('submit', )
            );
            return;
        }
        const staticCurrentPage = document.querySelector(currentPageSelector);
        staticCurrentPage?.classList.remove(pageActiveClass);
        staticCurrentPage?.nextElementSibling?.classList.add(pageActiveClass);
        updatePageStatus();
        setIsFirstPage(false);

        const pagesArr = Array.from(pages);
        if (pagesArr.pop()?.id == dynamicCurrentPage()?.id) {
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

    const handleSubmit = (ev) => {
        if ( !ev.isDefaultPrevented() ) {
            ev.preventDefault();
        }

        const user = User;
        const formElements = ev.target.elements;
        const formData = new FormData();
        
        Array.from(formElements).forEach((input, key) => {
            formData.append(input.name, input.value);
        });

        try {
            axios.post(ev.target.action, formData, {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            })
            .then(
                response => {
                    console.log(response.data);
                },
                error => {
                    console.error(error);
                }
            )
            .catch(error => {
                console.log(error);
            })
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            <form id="user-form" action={ Api.server + Api.endpoints.admin.register } method="post" onSubmit={ handleSubmit }>
                <div className='flex flex-col gap-4 py-4'>
                    <div>
                        <Text variant='p'>Step { pageNumber } of { pageCount }</Text>
                    </div>
                    <div id="user-form_page_a" className={ `${pageBaseClass} ${pageActiveClass} flex flex-col gap-4 flex-1`}>
                        <Text variant='h3'>Basic Info</Text>
                        <div className="grid md:grid-cols-2 gap-5">
                            <div className='flex flex-col gap-2 flex-1'>
                                <Label htmlFor='firstname'>Firstname:</Label>
                                <Input id='firstname' name="firstname" type='text' className="input h-14 text-lg" placeholder='Firstname:' />
                            </div>
                            <div className='flex flex-col gap-2 flex-1'>
                                <Label htmlFor='lastname'>Lastname:</Label>
                                <Input id='lastname' name="lastname" type='text' className="input h-14 text-lg" placeholder='Lastname:' />
                            </div>
                        </div>
                        
                        <div className='flex flex-col gap-2'>
                            <Label htmlFor='email'>Email:</Label>
                            <Input id='email' name="email" type='email' className="input h-14 text-lg" placeholder='Email:' />
                        </div>
                        <div className='flex flex-col gap-2'>
                            <Label htmlFor='phone'>Phone:</Label>
                            <Input id='phone' name="phone" type='tel' className="input h-14 text-lg" placeholder='Phone:' />
                        </div>
                    </div>
                    
                    <div className="flex flex-row justify-content-between pt-5">
                        { !isFirstPage && <Button type="button" onClick={ backToPreviousPage } className="max-w-max"><Icons.backward /> Back</Button> }
                        { isLastPage && <Button type='submit' disabled={ !isCurrentPageCompleted } className="max-w-max ml-auto">Submit <Icons.forward /></Button> }
                        { !isLastPage && <Button type='button' disabled={ !isCurrentPageCompleted } onClick={ gotoNextPage } className="max-w-max ml-auto">Next <Icons.forward /></Button> }
                    </div>
                </div>
            </form>
        </>
    )
}

export default CreateUserForm;