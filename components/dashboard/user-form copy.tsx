"use client";

import React, { ChangeEvent, FormEvent, MouseEvent, useEffect, useReducer, useRef, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Api } from "@/lib/api";
import { Text } from "../ui/text";
import { Icons } from "../icons";
import axios, { AxiosError, isAxiosError } from "axios";
import { APPCONFIG } from "@/lib/app-config";
import { capitalCase } from "change-case";
import PasswordGenerator from "../password-generator";
import { Label } from "../ui/label";
import { FaEye, FaEyeSlash, FaRetweet } from "react-icons/fa6";
import useAuthenticatedUser from "@/hooks/useAuthenticatedUser";
import generator from "generate-password";
import { BiUser } from "react-icons/bi";
import * as NextImageAlias from "next/image";
import { cn, parseFileToDataUri } from "@/lib/utils";
import { toast } from "../ui/sonner";
import { MdOutlineCancel } from "react-icons/md";
import MediaUploader from "../buttons/media-uploader";
import { useRouter } from "next/navigation";

const NextImage = NextImageAlias.default;

type SubmittedData = UserInfo & {
    user_avatar: File;
    re_password: string;
    firstName?: string;
    lastName?: string;
};

const UserForm = (
    { onSuccess, onFailure, action, isNew = true, account = null, eventsToAttach = [] }:
        {
            onSuccess?: (data: NewlyCreatedUserAccountData) => void;
            onFailure?: (error?: unknown) => void;
            action?: string;
            isNew?: boolean;
            account?: AppUser | null;
            eventsToAttach?: string[]
        }
) => {
    const actor = useAuthenticatedUser();
    // const [isFirstPage, setIsFirstPage] = useState<boolean>(true);
    // const [isLastxcccbftyxxPage, setIsLastPage] = useState<boolean>(false);
    const [isPageCompleted, setIsPageCompleted] = useState<boolean>(false);
    // const [pageNumber, setPageNumber] = useState<number>(1);
    const pageBaseClass = 'user-form-page';
    const pageActiveClass = 'active';
    const currentPageSelector = `.${pageBaseClass}.${pageActiveClass}`;
    const { accountTypes, userRoles } = APPCONFIG;

    // const dynamicCurrentPage = () => document.querySelector(currentPageSelector);
    // const [pages, setPages] = useState<Array<Element>>([]);
    // const [pageCount, setPageCount] = useState(1);
    const [selectedAccountType, setSelectedAccountType] = useState((account ? account.accountType : null));
    const [selectedRole, setSelectedRole] = useState((account ? account.role : null));
    const [passwordHidden, togglePasswordHidden] = useReducer(state => !state, true);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | AxiosError | null>(null);
    const formRef = useRef<HTMLFormElement | null>(null);
    const router = useRouter();

    const updatePageStatus = (): void => {
        const getInputsFromCurrentPage = () => {
            const fieldList = 'input[type="file"]:required, input:not([type="hidden"]), textarea, select';
            return formRef?.current?.querySelector(currentPageSelector)?.querySelectorAll(fieldList);
        }
        const inputs = getInputsFromCurrentPage();
        let totalUnfilled = 0;

        inputs?.forEach(item => {
            const input = item as HTMLInputElement;
            let itemHasValue = input.value || false;
            if (!itemHasValue) {
                totalUnfilled += 1;
            }
        });

        if (totalUnfilled == 0) {
            setIsPageCompleted(true)
        } else {
            setIsPageCompleted(false)
        }
    }
    // updatePageStatus();

    // React.useEffect(() => {
    //     const updatePages = () => {
    //         const pageElements = document.querySelectorAll(`.${pageBaseClass}`);
    //         setPages(Array.from(pageElements));
    //         setPageCount(pageElements.length);
    //         setIsLastPage(
    //             pageElements.length === 1
    //         )
    //     };

    //     updatePages();

    //     // const observer = new MutationObserver(updatePages);
    //     // const config = { childList: true, subtree: true };
    //     // const targetNode = document.getElementById('user-form');

    //     // observer.observe(targetNode, config);

    //     return () => {
    //         // observer.disconnect();
    //     };
    // }, []);

    useEffect(() => {
        if (formRef.current === null) {
            return;
        }
        const elements = Array.from(formRef.current.elements);
        elements.forEach((element, index) => {
            element.addEventListener('change', (ev) => {
                updatePageStatus();
            })
        })
    }, [formRef, updatePageStatus]);

    // const gotoNextPage = (ev: MouseEvent) => {
    //     ev.preventDefault();

    //     if (!isPageCompleted) {
    //         return;
    //     }
    //     const target = ev.target as HTMLButtonElement;
    //     if (target?.type == 'submit') {
    //         document.getElementById('user-form')?.dispatchEvent(
    //             new Event('submit')
    //         );
    //         return;
    //     }
    //     const staticCurrentPage = document.querySelector(currentPageSelector);
    //     staticCurrentPage?.classList.remove(pageActiveClass);
    //     staticCurrentPage?.nextElementSibling?.classList.add(pageActiveClass);
    //     updatePageStatus();
    //     setIsFirstPage(false);

    //     // const pagesArr = Array.from(pages);
    //     if (pages.pop()?.id == dynamicCurrentPage()?.id) {
    //         setIsLastPage(true)
    //     } else {
    //         setIsLastPage(false)
    //     }
    //     setPageNumber(state => {
    //         if (state >= pageCount) {
    //             state = pageCount;
    //         } else {
    //             state += 1
    //         }
    //         return state;
    //     });
    // }

    // const backToPreviousPage = (ev: MouseEvent) => {
    //     ev.preventDefault();

    //     const staticCurrentPage = document.querySelector(currentPageSelector);
    //     staticCurrentPage?.classList.remove(pageActiveClass);
    //     staticCurrentPage?.previousElementSibling?.classList.add(pageActiveClass);
    //     updatePageStatus();
    //     setIsLastPage(false);

    //     const pagesArr = Array.from(pages);
    //     if (pagesArr[0]?.id == dynamicCurrentPage()?.id) {
    //         setIsFirstPage(true);
    //     } else {
    //         setIsFirstPage(false)
    //         // setPageNumber(state => state - 1);
    //     }
    //     setPageNumber(state => {
    //         if (state <= 1) {
    //             state = 1;
    //         } else {
    //             state -= 1
    //         }
    //         return state;
    //     });
    // }

    // const createSuspense = (containerId: string | HTMLElement, hideUploadBtn: boolean = true): void => {
    //     const container: HTMLElement | null =
    //         typeof containerId === 'string'
    //             ? document.querySelector(containerId)
    //             : containerId;

    //     if (!container) {
    //         console.error('Target container not found.');
    //         return;
    //     }

    //     const loading = document.createElement('div');
    //     const spinner = document.createElement('span');
    //     const hint = document.createElement('span');

    //     spinner.classList.add(styles.spinner);
    //     hint.innerText = 'Loading, please wait...';
    //     hint.classList.add(styles.hint);
    //     loading.classList.add('suspense', styles.content_loading);
    //     loading.appendChild(spinner);
    //     loading.appendChild(hint);
    //     container.appendChild(loading);

    //     const uploadBtn = container.parentElement?.getElementsByClassName('upload-btn')[0];
    //     if (uploadBtn && hideUploadBtn) {
    //         // container.parentElement?.removeChild(uploadBtn);
    //         uploadBtn.remove();
    //     }

    //     container.style.display = 'flex';
    // };

    const handleSubmit = async (ev: FormEvent) => {
        if (!ev.defaultPrevented) {
            ev.preventDefault();
        }
        if (!navigator.onLine) {
            toast(<p className="text-red-800">{"Sorry, it appears you're offline. Check your internet connectivity and try again."}</p>);
            return;
        }

        setIsLoading(true);
        const form = ev.target as HTMLFormElement;
        const formData = new FormData(form);
        const rawData = (Object.fromEntries(formData.entries()) as unknown) as SubmittedData;
        const refinedData: Omit<SubmittedData, 'user_avatar' | 're_password'> = rawData;

        // Handle avatar image upload at this point and modify
        // the finalData accordingly, before proceeding to 
        // create account
        try {
            const uploadResponse = await MediaUploader.uploadFile(
                rawData.user_avatar, 0, (refinedData.firstName ?? refinedData.firstname)
            );
            if (isAxiosError(uploadResponse)) {
                throw uploadResponse;
            }
            if (null === uploadResponse) {
                throw new Error('Unable to upload avatar. An unknown error has occurred.');
            }
            refinedData.avatar = uploadResponse.secure_url;

            // Attach any attachable event IDs to the user
            let finalData = refinedData;
            if (eventsToAttach?.length > 0) {
                finalData = { ...finalData, eventRef: eventsToAttach }
            }

            const apiRes = await axios.post(form.action, finalData, {
                headers: {
                    Authorization: `Bearer ${actor?.token}`
                }
            });

            if (onSuccess) {
                onSuccess(apiRes.data);
            } else {
                console.log('Account created successfully');
                toast('Account created successfully');
                setIsLoading(false);
                router.push('/users');
            }
        } catch (error) {
            setIsLoading(false);
            setError(error as any);
            toast((error as Error | AxiosError).message);
        }
    }

    // generator.generate(options);
    const passwordOptions = {
        length: 12,
        numbers: true,
        symbols: true,
        uppercase: true,
        lowercase: true
    };

    const password = generator.generate(passwordOptions);
    const [pass, setPass] = useState(password);
    const [rePass, setRePass] = useState(password);

    return (
        <>
            <form
                id="user-form"
                ref={formRef}
                action={action || Api.server + Api.endpoints.admin.register}
                method={isNew ? 'post' : 'patch'}
                onSubmit={handleSubmit}>
                <div className='flex flex-col gap-4 py-4'>
                    {
                        error && (
                            <div className="border border-destructive rounded-lg p-2">
                                <Text variant='p' className="text-destructive m-0">{error?.message}</Text>
                            </div>
                        )
                    }
                    <div id="user-form_page_a" className={`${pageBaseClass} ${pageActiveClass} flex flex-col gap-4 flex-1`}>
                        {/* <Text variant='h3'>User Info</Text> */}
                        <div className="grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-3">
                            <aside className="avatar-section md:order-1">
                                <AccountAvatar account={account} />
                            </aside>
                            <aside className="input-section grid gap-5">
                                <p className="text-muted-foreground text-xs required">All fields are required except otherwise indicated</p>
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
                                <div className="gap-5 grid grid-col md:grid-cols-1">
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
                                                    className="text-lg responsive-text-2" placeholder='Password:'
                                                    required aria-required='true' value={pass} onChange={(ev) => { setPass(ev.target.value); updatePageStatus() }} />
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
                                                    className="text-lg responsive-text-2"
                                                    placeholder='Re-Password:'
                                                    required aria-required='true' value={rePass} onChange={(ev) => { setRePass(ev.target.value); updatePageStatus() }} />
                                                <Button onClick={() => togglePasswordHidden()} variant={null}
                                                    className="absolute top-0 right-0" type="button">
                                                    {passwordHidden ? (<FaEye />) : (<FaEyeSlash />)}
                                                </Button>
                                            </div>
                                        </div>
                                        <PasswordGenerator
                                            handleGeneratedPassword={(randPass) => {
                                                setPass(randPass);
                                                setRePass(randPass)
                                            }}
                                            options={{ length: 16 }} />
                                    </>
                                }
                            </aside>
                        </div>
                    </div>

                    <div className="flex flex-row justify-content-between pt-5">
                        {/* { !isFirstPage && <Button type="button" onClick={ backToPreviousPage } className="max-w-max"><Icons.backward /> Back</Button> } */}
                        {/* {isLastPage && <Button type='submit' disabled={!isPageCompleted} className="max-w-max ml-auto">Submit <Icons.forward /></Button>} */}
                        {<Button type='submit' disabled={!isPageCompleted && !account} className="max-w-max ml-auto">
                            {
                                isLoading ?
                                    <><Icons.spinner className='mr-2 h-4 w-4 animate-spin' /> Loading...</>
                                    : <>Submit <Icons.forward /></>
                            }
                        </Button>}
                        {/* { !isLastPage && <Button type='button' disabled={ !isPageCompleted } onClick={ gotoNextPage } className="max-w-max ml-auto">Next <Icons.forward /></Button> } */}
                    </div>
                </div>
            </form>
        </>
    )
}

export default UserForm;

function AccountAvatar({ account }: { account: AppUser | null }) {

    const editBtnClass = 'change-image';
    const resetBtnClass = 'reset-picker';
    const filePickerRef = useRef<HTMLInputElement | null>(null);
    const selectedFilePreviewRef = useRef<HTMLSpanElement | null>(null);
    const [avatar, setAvatar] = useState<{ url?: string, alt?: string }>({
        url: (account && account.avatar ? account.avatar : ''),
        alt: (account && account.avatar ? account.fullName : '')
    });
    const [selection, setSelection] = useState<string>('');

    useEffect(() => {
        if (!selection) {
            return;
        }
        setAvatar({
            url: selection,
            alt: 'Selected Image'
        });

    }, [selection]);

    const handlePickAvatar = (ev: ChangeEvent<HTMLInputElement>) => {
        const files = ev.target.files;
        if (!files?.length || !selectedFilePreviewRef.current) {
            return;
        }
        const avatarPreview = selectedFilePreviewRef.current as HTMLSpanElement;
        const file = files[0];
        parseFileToDataUri(file)
            .then((dataUri) => {
                const img = avatarPreview.querySelector('img') ?? new Image(200, 200);
                img.src = dataUri;
                img.alt = file.name;
                avatarPreview.style.backgroundImage = `url(${dataUri})`;

                // Replace any existing image with the new one
                if (!avatarPreview.querySelector('img')) {
                    avatarPreview.appendChild(img);
                }
                setSelection(dataUri);
            })
            .catch((error) => {
                const msg = 'Unable to preview image';
                toast(msg)
                console.error(`${msg}: `, error.message());
            });
    }

    const resetFilePicker = (ev: MouseEvent) => {
        setSelection('');
        setAvatar({});
    }

    const filePicker = <Input type='file' accept='image/jpeg,image/png'
        ref={filePickerRef}
        name='user_avatar' required className="hidden" onChange={handlePickAvatar} />;
    // const actionBtns = (
    //     <span className="flex items-center absolute right-0 left-0 px-4 gap-4 justify-center">
    //         <Label className={cn(editBtnClass, 'bg-black/80 text-white px-2 py-2 rounded-full ')}>
    //             {filePicker}
    //             <FaRetweet size={28} />
    //         </Label>
    //         <Button type="button" variant={null}
    //             className={cn(resetBtnClass, "rounded-full bg-black/80 py-2 px-2 h-auto text-destructive")}
    //             onClick={resetFilePicker}
    //         >
    //             <MdOutlineCancel size={28} />
    //         </Button>
    //     </span>
    // );


    return (
        <div className="flex flex-col items-center avatar-uploader">
            <div className="avatar-picker fancy-file-picker border md:p-5 rounded-xl bg-gray-200 cursor-pointer relative">
                {
                    avatar.url && avatar.alt ? (
                        <React.Fragment>
                            <Input type='hidden' name="avatar" value={account ? account.avatar : ''} />
                            <span className={cn(
                                'avatar-upload-preview flex items-center loaded'
                            )} style={{ backgroundImage: `url(${avatar.url})` }}>
                                <NextImage src={avatar.url} alt={avatar.alt} title={avatar.alt} width={200} height={200} />
                                <span className="flex items-center absolute right-0 left-0 px-4 gap-4 justify-center">
                                    <Label className={cn(editBtnClass, 'bg-black/80 text-white px-2 py-2 rounded-full ')}>
                                        {filePicker}
                                        <FaRetweet size={28} />
                                    </Label>
                                    <Button type="button" variant={null}
                                        className={cn(resetBtnClass, "rounded-full bg-black/80 py-2 px-2 h-auto text-destructive")}
                                        onClick={resetFilePicker}
                                    >
                                        <MdOutlineCancel size={28} />
                                    </Button>
                                </span>
                            </span>
                        </React.Fragment>
                    ) : (
                        <React.Fragment>
                            <Label>
                                {filePicker}
                                <BiUser size={160} className="text-muted-foreground" />
                                <span ref={selectedFilePreviewRef}
                                    className="avatar-upload-preview flex items-center"></span>
                            </Label>
                        </React.Fragment>
                    )
                }
            </div>
        </div>
    )
}