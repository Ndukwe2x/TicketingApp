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
import { cn, getEmptyFormFields, parseFileToDataUri } from "@/lib/utils";
import { toast } from "../ui/sonner";
import { MdOutlineCancel } from "react-icons/md";
import MediaUploader from "../buttons/media-uploader";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { useFormContext } from "@/hooks/useCustomContexts";

const NextImage = NextImageAlias.default;

type SubmittedData = UserInfo & {
    user_avatar: File;
    re_password: string;
    firstName?: string;
    lastName?: string;
};

type FormDataProps = {
    user_avatar?: File | null;
    firstName?: string | null;
    lastName?: string | null;
    email?: string | null;
    phone?: string | null;
    accountType?: string | null;
    role?: string | null;
    password?: string | null;
    re_password?: string | null
}

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
    const pageBaseClass = 'user-form-page';
    const pageActiveClass = 'active';
    const { accountTypes, userRoles } = APPCONFIG;
    const [passwordHidden, togglePasswordHidden] = useReducer(state => !state, true);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | AxiosError | null>(null);
    const formRef = useRef<HTMLFormElement | null>(null);
    const router = useRouter();
    const submitBtnRef = useRef<HTMLButtonElement>(null);
    const formAction = isNew
        ? Api.server + Api.endpoints.admin.register
        : Api.server + Api.endpoints.admin.singleUser.replace(':id', account?.id as string)

    const strongPassword = {
        length: 12,
        numbers: true,
        symbols: true,
        uppercase: true,
        lowercase: true
    };

    const password = generator.generate(strongPassword);

    const [formData, setFormData] = useState<FormDataProps>({
        user_avatar: null,
        firstName: account?.firstname || null,
        lastName: account?.lastname || null,
        email: account?.email || null,
        phone: account?.phone || null,
        accountType: account?.accountType || null,
        role: account?.role || null,
        password: password,
        re_password: password
    });

    useEffect(() => {
        const frm = formRef.current as HTMLFormElement;
        const btn = submitBtnRef.current as HTMLButtonElement;
        const formElements = new FormData(frm).entries();
        let emptyFields = [];
        for (const [field, value] of Array.from(formElements)) {
            if (!value) {
                emptyFields.push(field);
            }
        }
        if (emptyFields.length) {
            btn.disabled = true;
        } else {
            btn.disabled = false;
        }

        return () => { }
    }, [formData, formRef, submitBtnRef]);


    const handleInput = (fieldName: string, value: string) => {
        setFormData(existing => ({ ...existing, [fieldName]: value }));
    }

    const handleSelectedAvatar = (file: File) => {
        setFormData(state => ({ ...state, user_avatar: file }));
    }

    const handleSubmit = async (ev: FormEvent) => {
        if (!ev.defaultPrevented) {
            ev.preventDefault();
        }
        if (!navigator.onLine) {
            toast(<p className="text-red-800">{"Sorry, it appears you're offline. Check your internet connectivity and try again."}</p>);
            return;
        }

        setIsLoading(true);

        const rawData = formData as SubmittedData;
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
            const handleRequest = isNew ? axios.post : axios.patch;
            const apiRes = await handleRequest(formAction, finalData, {
                headers: {
                    Authorization: `Bearer ${actor?.token}`
                }
            });

            console.log('Account created successfully');
            toast('Account created successfully');
            if (onSuccess) {
                onSuccess(apiRes.data);
            } else {
                setIsLoading(false);
                router.push('/users');
            }
        } catch (error) {
            setIsLoading(false);
            setError(error as any);
            toast((error as Error | AxiosError).message);
        }
    }

    return (
        <>
            <form
                id="user-form"
                ref={formRef}
                action={formAction}
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

                                <AccountAvatar onSelection={(file) => { handleSelectedAvatar(file as File) }} account={account} />
                            </aside>
                            <aside className="input-section grid gap-5">
                                <p className="text-muted-foreground text-xs required">All fields are required except otherwise indicated</p>
                                <div className='flex flex-col gap-2 flex-1'>
                                    <Label htmlFor='firstName'>Firstname:</Label>
                                    <Input id='firstName' name="firstName" type='text' className="text-lg responsive-text-2"
                                        placeholder='Firstname:'
                                        defaultValue={formData.firstName ?? account?.firstname ?? ''}
                                        required aria-required='true' onChange={ev => handleInput('firstName', ev.target.value)} />
                                </div>
                                <div className='flex flex-col gap-2 flex-1'>
                                    <Label htmlFor='lastName'>Lastname:</Label>
                                    <Input id='lastName' name="lastName" type='text' className="text-lg responsive-text-2"
                                        placeholder='Lastname:' defaultValue={formData.lastName ?? account?.lastname ?? ''}
                                        required aria-required='true' onChange={ev => handleInput('lastName', ev.target.value)} />
                                </div>

                                <div className='flex flex-col gap-2'>
                                    <Label htmlFor='email'>Email:</Label>
                                    <Input id='email' name="email" type='email' className="text-lg responsive-text-2"
                                        placeholder='Email:' defaultValue={formData.email ?? account?.email ?? ''}
                                        required aria-required='true' onChange={ev => handleInput('email', ev.target.value)} />
                                </div>
                                <div className='flex flex-col gap-2'>
                                    <Label htmlFor='phone'>Phone:</Label>
                                    <Input id='phone' name="phone" type='tel' className="text-lg responsive-text-2"
                                        placeholder='Phone:' defaultValue={formData.phone ?? account?.phone ?? ''}
                                        required aria-required='true' onChange={ev => handleInput('phone', ev.target.value)} />
                                </div>
                                <div className="gap-5 grid grid-col md:grid-cols-1">
                                    {
                                        actor !== null && actor.isOwner ?
                                            <div className='flex flex-col gap-2'>
                                                <Label htmlFor='account-type'>Account Type:</Label>
                                                <Select name="accountType" required aria-required='true'
                                                    value={formData.accountType ?? account?.accountType ?? ''}
                                                    defaultValue={formData.accountType ?? account?.accountType ?? ''}
                                                    onValueChange={value => handleInput('accountType', value)}
                                                    autoComplete="off">
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
                                            <Input name="accountType" type='hidden' value='user' autoComplete='off' />

                                    }
                                    <div className='flex flex-col gap-2'>
                                        <Label htmlFor='account-role'>Role:</Label>
                                        <Select name="role" value={formData.role ?? account?.role ?? ''}
                                            defaultValue={formData.role ?? account?.role ?? ''}
                                            onValueChange={value => handleInput('role', value)}
                                            required aria-required='true'>
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
                                                    required aria-required='true'
                                                    value={formData.password ?? ''}
                                                    onChange={(ev) => {
                                                        // setPass(ev.target.value);
                                                        handleInput('password', ev.target.value)
                                                    }} />
                                                <Button onClick={() => togglePasswordHidden()} variant={null}
                                                    className="absolute top-0 right-0" type="button">
                                                    {passwordHidden ? <FaEye /> : <FaEyeSlash />}
                                                </Button>
                                            </div>
                                        </div>
                                        <div className='flex flex-col gap-2'>
                                            <Label htmlFor='re-password'>Re-Password:</Label>
                                            <div className="relative">
                                                <Input id='re-password' name="re_password" type={passwordHidden ? 'password' : 'text'}
                                                    className="text-lg responsive-text-2"
                                                    placeholder='Re-Password:'
                                                    required aria-required='true'
                                                    value={formData.re_password ?? ''}
                                                    onChange={(ev) => {
                                                        // setRePass(ev.target.value);
                                                        handleInput('re_password', ev.target.value)
                                                    }} />
                                                <Button onClick={() => togglePasswordHidden()} variant={null}
                                                    className="absolute top-0 right-0" type="button">
                                                    {passwordHidden ? <FaEye /> : <FaEyeSlash />}
                                                </Button>
                                            </div>
                                        </div>
                                        <PasswordGenerator
                                            handleGeneratedPassword={randPass => {
                                                // setPass(randPass);
                                                // setRePass(randPass);
                                                // setFormData(prev => (
                                                //     { ...prev, password: randPass, re_password: randPass }
                                                // ))
                                                handleInput('password', randPass);
                                                handleInput('re_password', randPass)
                                            }}
                                            options={{ length: 16 }} />
                                    </>
                                }
                            </aside>
                        </div>
                    </div>

                    <div className="flex flex-row justify-content-between pt-5">
                        {<Button ref={submitBtnRef} disabled={true} type='submit' className="max-w-max ml-auto">
                            {
                                isLoading ?
                                    <><Icons.spinner className='mr-2 h-4 w-4 animate-spin' /> Loading...</>
                                    : <>Submit <Icons.forward /></>
                            }
                        </Button>}
                    </div>
                </div>
            </form>
        </>
    )
}

export default UserForm;

function AccountAvatar({ onSelection, account }: { onSelection: Callback; account: AppUser | null }) {
    const editBtnClass = 'change-image';
    const resetBtnClass = 'reset-picker';
    const filePickerRef = useRef<HTMLInputElement | null>(null);
    const selectedFilePreviewRef = useRef<HTMLSpanElement | null>(null);
    const [avatar, setAvatar] = useState<{ url?: string, alt?: string }>({
        url: (account?.avatar ?? ''),
        alt: (account?.fullName ?? account?.avatar ?? '')
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
        console.log(files);
        if (!files?.length || !selectedFilePreviewRef.current) {
            return;
        }
        const avatarPreview = selectedFilePreviewRef.current as HTMLSpanElement;
        const file = files[0];
        console.log(file);
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
                console.log(dataUri);
                setSelection(dataUri);
            })
            .catch((error) => {
                const msg = 'Unable to preview image';
                toast(msg)
                console.error(`${msg}: `, error.message());
            });

        onSelection(file);
    }

    const resetFilePicker = (ev: MouseEvent) => {
        setSelection('');
        setAvatar({});

    }

    const filePicker = <Input type='file' accept='image/jpeg,image/png'
        ref={filePickerRef}
        name='user_avatar' className="hidden" onChange={handlePickAvatar} />;

    return (
        <div className="flex flex-col items-center avatar-uploader">
            <div className="avatar-picker fancy-file-picker border md:p-5 rounded-xl bg-gray-200 cursor-pointer relative">
                {
                    avatar.url && avatar.alt ? (
                        <React.Fragment>
                            <Input type='hidden' name="avatar" value={account ? account.avatar : ''} />
                            <span ref={selectedFilePreviewRef} className={cn(
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