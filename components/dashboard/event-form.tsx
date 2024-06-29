import React, { FormEvent, FormEventHandler, useRef, useState } from "react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Api } from "@/lib/api";
import { Text } from "../ui/text";
import { Icons } from "../icons";
import styles from '../styles/styles.module.css';
import MediaUploader from "../buttons/media-uploader";
import axios, { AxiosResponse } from "axios";
import { Checkbox } from "../ui/checkbox";
import AddTicketCategory from "./add-ticket-category";
import { cn, formatDate, parseFileToDataUri, parseFormFields } from "@/lib/utils";
import { toast } from "../ui/sonner";
import DateTimeControls from "./event-form-datetime-control";
import generateRandomString from "@/lib/random-string-generator";
import { MdInfo } from "react-icons/md";
import EventEditFormSummary from "./event-edit-form-summary";
import { FormDataContext } from "@/hooks/useFormDataContext";
import { deleteEvent } from "@/hooks/useGetEvent";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useCallback } from "react";


const EventForm = (
    { actor, onSuccess, onFailure, event }:
        {
            actor: AppUser;
            onSuccess: (data: Record<string, string>) => any;
            onFailure?: (error?: unknown) => void;
            event?: SingleEvent;
        }
) => {
    const [isFirstPage, setIsFirstPage] = React.useState<boolean>(true);
    const [isLastPage, setIsLastPage] = React.useState<boolean>(false);
    const [isCurrentPageCompleted, setIsCurrentPageCompleted] = React.useState<boolean>(false);
    const [pageNumber, setPageNumber] = React.useState(1);
    const pageBaseClass = styles.event_form_page;
    const pageActiveClass = styles.current;
    const currentPageSelector = `.${pageBaseClass}.${pageActiveClass}`;
    const dynamicCurrentPage = () => document.querySelector(currentPageSelector);
    const [pages, setPages] = React.useState<Array<Element>>([]);
    const [pageCount, setPageCount] = React.useState(1);
    const [eventTitle, setEventTitle] = React.useState(event ? event.title : '');
    const formId: string = 'event_form_' + generateRandomString(32, 'mixed_lower', false);
    const isNew: boolean = event ? false : true;
    const formAction = isNew
        ? Api.server + Api.endpoints.admin.events
        : Api.server + Api.endpoints.admin.event.replace(':id', event?._id as string);
    const [filesToUpload, addFilesToUpload] = React.useState<{ banner: File | null, posters: File[] }>({ banner: null, posters: [] });
    const [formData, setFormData] = React.useState<Record<string, any> | SingleEvent>(event || {});
    const uploadedImagesRef = useRef<{ banner: ImageInfo, posters: ImageInfo[] } | {}>({});

    let formDataRef = useRef<Partial<SingleEvent> | {}>({});
    const formRef = useRef<HTMLFormElement>(null);
    const bannerRef = useRef<HTMLDivElement>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccessful, setIsSuccessful] = useState(false);
    const router = useRouter();



    const updatePageStatus = useCallback(() => {
        const getInputsFromCurrentPage = () => {
            const fieldList: string = 'input:not([type="file"]), textarea, select';
            return (formRef.current?.querySelector(currentPageSelector)?.querySelectorAll(fieldList) as unknown) as HTMLFormControlsCollection;
        }
        const inputFields = getInputsFromCurrentPage();

        // Check to see if the user has filled all the required fields on a the active page
        // and activate/deactivate the forward button accordingly
        let totalUnfilled = 0;
        inputFields && Array.from(inputFields).forEach(field => {
            let elem = field as TypeOfFormControl;
            if (elem.required && !elem.value) {
                totalUnfilled += 1;
            }
        });

        if (totalUnfilled > 0) {
            setIsCurrentPageCompleted(false)
        } else {
            setIsCurrentPageCompleted(true)
        }
    }, [formRef.current, currentPageSelector]);
    updatePageStatus();

    React.useEffect(() => {
        const updatePages = () => {
            const pageElements = document.querySelectorAll(`.${pageBaseClass}`);
            setPages(Array.from(pageElements));
            setPageCount(pageElements.length);
        };

        updatePages();

        const observer = new MutationObserver(updatePages);
        const config = { childList: true, subtree: true };
        const targetNode = document.getElementById(formId) as Node;

        observer.observe(targetNode, config);

        return () => {
            observer.disconnect();
            // updatePageStatus();
            // Update the formData state on every call on updatePageStatus
            // This helps us currate all the form data as the user fills the form,
            // and then use to create a summary of the entire user inputs

            // else if ( formRef.current !== null ) {
            //     const enteredData = new FormData(formRef.current as HTMLFormElement);
            //     const objectifiedFormData = formDataToObjects(enteredData.entries())
            //     .filter(({name, value}) => value != '[object File]');

            //     const processedData = parseFormFields(
            //         objectifiedFormData,
            //     );
            //     // formDataRef.current = processedData as Partial<SingleEvent> | {};
            //     setFormData(processedData);
            //     console.log('Initial Values: ', processedData);
            // }
        };
    }, [formId, pageBaseClass]);



    const updateFormData: FormEventHandler = (ev) => {
        const target: (typeof ev.target) = ev.target;
        const { name, value } = target as TypeOfFormControl;

        const objectified = parseFormFields([{ name, value }]);
        setFormData(state => ({
            ...state,
            ...objectified
        }));
        updatePageStatus();
    }

    const gotoNextPage = (ev: any) => {
        ev.preventDefault();

        if (!isCurrentPageCompleted) {
            return;
        }
        const target = ev.target as HTMLButtonElement;
        if (target.type == 'submit') {
            document.getElementById('event-form')?.dispatchEvent(
                new Event('submit',)
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

    const backToPreviousPage = (ev: any) => {
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


    /**
     * Create a preview of the previously uploaded image, and pass its url to a hidden form field
     * with the name 'eventBanner';
     * @param data The response data returned from Cloudinary after a successful image upload
     */
    const previewBanner = (file: File) => {
        if (bannerRef.current == null) {
            return;
        }
        const bannerPreview = bannerRef.current;
        createSuspense(bannerPreview);
        bannerPreview.classList.remove('hidden');
        bannerPreview.style.display = 'flex';

        parseFileToDataUri(file)
            .then((dataUri) => {
                const img = new Image();
                img.src = dataUri;
                img.alt = file.name;

                img.onload = () => {
                    bannerPreview.replaceChild(img, bannerPreview.getElementsByClassName('suspense')[0]);
                    let btn = bannerPreview.getElementsByClassName(styles.edit_btn)[0] as HTMLElement;
                    btn.style.display = 'flex';
                }
                bannerPreview.style.backgroundImage = `url(${dataUri})`;

                // Replace any existing image with the new one
                if (bannerPreview.getElementsByTagName('img').length) {
                    bannerPreview.replaceChild(img, bannerPreview.getElementsByTagName('img')[0])
                } else {
                    bannerPreview.appendChild(img);
                }

                addFilesToUpload(files => ({
                    ...files,
                    banner: file
                }));

                setFormData(formData => ({ ...formData, eventBanner: { url: dataUri } }));
            })
            .catch((error) => {
                const msg = 'Unable to preview image';
                toast(msg)
                console.error(`${msg}: `, error.message());
            });

    }

    const previewPosters = (file: File) => {
        createPosterGroup('#posters');

        const posterPreview = document.querySelector('.poster-group.loading') as HTMLElement;
        const errorMsg: string = 'Unable to preview image';
        if (!posterPreview) {
            toast(errorMsg);
            console.error(errorMsg);
            return;
        };

        posterPreview.classList.remove('hidden');
        posterPreview.style.display = 'flex';

        parseFileToDataUri(file)
            .then(dataUri => {
                const img = new Image();
                img.src = dataUri;
                img.alt = file.name;
                img.onload = () => {
                    const suspense = posterPreview.getElementsByClassName('suspense')[0];
                    if (suspense) {
                        posterPreview.replaceChild(img, suspense);
                    }
                    updatePageStatus();
                    posterPreview.classList.remove('loading');
                }

                posterPreview.style.backgroundImage = `url(${dataUri})`;
                if (posterPreview.getElementsByTagName('img').length) {
                    posterPreview.replaceChild(img, posterPreview.getElementsByTagName('img')[0])
                } else {
                    posterPreview.appendChild(img);
                }
                addFilesToUpload(files => {
                    return {
                        ...files,
                        posters: [...files.posters, file]
                    }
                });

                setFormData(formData => ({
                    ...formData,
                    posters: [...formData.posters || [], { url: dataUri }]
                }))
            })
            .catch(error => {
                toast(errorMsg);
                console.error(errorMsg, error);
            });
    }

    const createPosterGroup = (containerId: string | HTMLElement) => {
        const container: Element =
            typeof containerId === 'string'
                ? document.querySelector(containerId) as HTMLElement
                : containerId;

        if (container == null) {
            console.error('Target container not found.');
            return;
        }

        const posterGroup = document.createElement('div');
        const existingPosters = document.querySelectorAll(`.${styles.media_frame}.${styles.poster}`);
        const posterId = existingPosters.length > 0
            ? existingPosters.length - 1
            : existingPosters.length;
        const groupId = 'poster_' + posterId;
        const uploadBtn = container.getElementsByClassName('upload-btn')[0];

        posterGroup.id = groupId;
        posterGroup.classList.add(styles.media_frame, styles.poster, styles.img_preview, 'poster-group', 'loading');


        container?.insertBefore(posterGroup, uploadBtn);

        createSuspense(`#${groupId}`, false);
    }

    const createSuspense = (containerId: string | HTMLElement, hideUploadBtn: boolean = true): void => {
        const container: HTMLElement =
            typeof containerId === 'string'
                ? document.querySelector(containerId) as HTMLElement
                : containerId;

        if (container == null) {
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
            uploadBtn.remove();
        }

        container.style.display = 'flex';
    };

    const uploadImages = async (): Promise<Record<string, any>> => {
        if (filesToUpload.banner === null) {
            throw new Error('No banner selected');
        }
        // let currentFormData = {...formDataRef.current};
        const results = {
            banner: {},
            posters: []
        }

        try {
            const bannerRes = await MediaUploader.uploadFile(filesToUpload.banner, 0, eventTitle);
            if (bannerRes.error) {
                throw bannerRes.error;
            }
            results.banner = bannerRes;

            for (const file of filesToUpload.posters) {
                const posterRes = await MediaUploader.uploadFile(file, 0, eventTitle);
                if (posterRes.error) {
                    throw posterRes.error;
                }
                results.posters.push((posterRes as unknown) as never);
            }
            return results;
        } catch (error) {
            throw error;
        }
    }

    /** Submit the event if everything is ok */
    const handleSubmit = async (ev: FormEvent) => {
        if (!ev.isDefaultPrevented()) {
            ev.preventDefault();
        }

        setIsLoading(true);
        try {
            const uploadResponse = await uploadImages();
            if (!Object.values(uploadResponse.banner).length) {
                throw new Error('Image upload failed');
            }
            const { banner, posters } = uploadResponse;

            const data = {
                ...formData,
                ...{
                    eventBanner: { url: banner.secure_url as string, public_id: banner.public_id as string },
                    posters: [...posters.map((poster: CloudinaryUploadResponseData) => ({ url: poster.secure_url as string, public_id: poster.public_id as string }))],
                }
            };
            setFormData(data);

            try {
                const requestHandler = isNew ? axios.post : axios.patch;
                const eventResponse = await requestHandler(formAction, data, {
                    headers: {
                        Authorization: `Bearer ${actor?.token}`
                    }
                });

                if (eventResponse.status === 200 || eventResponse.status === 201) {
                    if (!onSuccess) {
                        const msg = <span>Event {isNew ? 'created' : 'updated'}. {actor.isSuperOwner && 'Attach a user to this event'}</span>
                        toast(msg);
                        return router.push(`/events/${eventResponse.data.eventId}`);
                    }
                    if (!onSuccess(eventResponse.data)) {
                        deleteEvent(eventResponse.data.eventId, actor);
                        throw new Error("Event creation abortted. Couldn't assign event to user");
                    }
                }
            } catch (error) {
                const { eventBanner, posters = [] } = formData as SingleEvent;

                MediaUploader.deleteRecentlyUploadedImages([eventBanner, ...posters]);
                toast('Unable to create event. An internal server error has occured.');
                console.error(error);
            }
        } catch (error) {
            toast('Unable to create event. One of the selected images could not be uploaded');
            console.error(error);
            return;
        }

    }

    const createSummary = React.useCallback(() => {
        return <EventEditFormSummary data={formData as SingleEvent} />
    }, [formData])

    return (
        <FormDataContext.Provider value={{ formData, setFormData }}>
            <form id={formId}
                name={formId}
                action={formAction}
                method={isNew ? 'post' : 'patch'}
                ref={formRef}
                onSubmit={handleSubmit}>
                <div className='flex flex-col gap-4 py-4'>
                    <div>
                        <Text variant='p'>Step {pageNumber} of {pageCount}</Text>
                    </div>
                    <div id="event-form_page_a" className={`${pageBaseClass} ${pageActiveClass} flex-col gap-4 flex-1`}>
                        <Text variant='h3'>Basic Info</Text>
                        <div className='flex flex-col gap-2'>
                            <Label htmlFor='title'>Title:</Label>
                            <Input id='title' name="title"
                                onChange={(ev) => { setEventTitle(ev.target.value); updateFormData(ev); }}
                                type='text' className="input h-14 text-lg"
                                placeholder='The Big Friday Nights Party'
                                defaultValue={event ? event.title : ''}
                                required aria-required="true" />
                        </div>
                        <div className="flex flex-col gap-4">
                            <DateTimeControls datetime={event ? event.eventDate : ''} />
                            <div className="flex flex-col flex-1 gap-4">
                                <div className='flex flex-col gap-2'>
                                    <Label htmlFor='state'>State/Region:</Label>
                                    <Input id='state' name="state" placeholder="State/Region:"
                                        onChange={updateFormData} required aria-required='true'
                                        defaultValue={event ? event.state : ''} />
                                </div>
                                <div className='flex flex-col gap-2'>
                                    <Label htmlFor='city'>Town/City:</Label>
                                    <Input id='city' name="city" placeholder="Town/City:"
                                        onChange={updateFormData} required aria-required='true'
                                        defaultValue={event ? event.city : ''} />
                                </div>
                                <div className='flex flex-col gap-2'>
                                    <Label htmlFor='address'>Address:</Label>
                                    <Input id='address' name="address" placeholder="Street address:"
                                        onChange={updateFormData} required aria-required='true'
                                        defaultValue={event ? event.address : ''} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id="event-form_page_b" className={`${pageBaseClass} flex-col gap-4 flex-1`}>
                        <Text variant='h4'>Ticket Categories</Text>
                        <AddTicketCategory categories={event ? event.ticketCategories : []} />
                    </div>
                    <div id="event-form_page_c" className={`${pageBaseClass} flex-col gap-4 flex-1`}>
                        <Text variant='h4'>Event banner:</Text>
                        <div className='flex flex-col gap-2'>
                            <div id='banner-box' className={styles.banner_box}>
                                <div id='banner-preview' ref={bannerRef} style={(event && event.eventBanner.url) ? { backgroundImage: `url(${event.eventBanner.url})` } : {}}
                                    className={cn(styles.image_picker_facade, styles.banner, styles.img_preview, styles.banner_preview, event ? 'flex' : 'hidden')}>
                                    {(event && event.eventBanner.url) && <Image src={event.eventBanner.url}
                                        title={event.title}
                                        alt={event.eventBanner.public_id}
                                        width="280" height="200" />}
                                    <MediaUploader.editButton name="eventBanner" onFileSelection={e => readSelectedFiles(e, previewBanner)}
                                        className={cn((event && event.eventBanner.url) && 'block')} />
                                </div>
                                {(!event || !event.eventBanner.url) && <MediaUploader.uploadButton name="eventBanner"
                                    onFileSelection={e => readSelectedFiles(e, previewBanner)}
                                    isRequired={true}
                                    className={cn(styles.banner)} />}
                            </div>
                            {event && event.eventBanner.url && <input type="hidden" name="eventBanner[url]" defaultValue={event.eventBanner.url} />}
                            {event && event.eventBanner.public_id && <input type="hidden" name="eventBanner[public_id]" defaultValue={event.eventBanner.public_id || ''} />}
                        </div>
                    </div>
                    <div id="event-form_page_d" className={`${pageBaseClass} flex-col gap-4 flex-1`}>
                        <Text variant='h4'>Event posters:</Text>
                        <div className='flex flex-col gap-2'>
                            <div id="posters" className="poster-groups gap-3 grid grid-cols-3">
                                <MediaUploader.uploadButton name="posters" onFileSelection={e => readSelectedFiles(e, previewPosters)}
                                    className={styles.poster} />
                            </div>
                        </div>
                    </div>
                    <div id="event-form_page_e" className={`${pageBaseClass} flex-col gap-4 flex-1`}>
                        <div className='flex flex-col gap-2'>
                            <Text variant='h4'>Ticket Duration</Text>
                            <Label htmlFor='ticket-closing-date'>Ticket Sales Closes:</Label>
                            <Input type="date" name="ticketClosingDate"
                                defaultValue={event && event.ticketClosingDate ? formatDate(new Date(event.ticketClosingDate), 'YYYY-MM-DD') : ''}
                                onChange={updateFormData} />
                        </div>
                        <div className='flex flex-col gap-2'>
                            <Text variant='h4'>Event Featuring</Text>
                            <Label htmlFor='featured'>
                                <Checkbox id='featured' name="featured" value='true'
                                    defaultChecked={event && event.featured} onCheckedChange={(status) => setFormData(state => ({ ...state, featured: status }))} /> Feature this event</Label>
                            <p className="text-xs flex items-center gap-2">
                                <MdInfo size={16} className="text-muted-foreground" /> Featuring an event puts it in the spotlight and is a great way to make your event reach more people.
                            </p>
                        </div>
                    </div>
                    <div id="event-form_page_f" className={`${pageBaseClass} flex-col gap-4 flex-1`}>
                        <Text variant='h3'>Preview</Text>
                        <div id="preview-form-data">
                            {createSummary()}
                        </div>
                    </div>
                    <div className="flex flex-row justify-content-between pt-5">
                        {!isFirstPage && <Button type="button" onClick={(ev) => backToPreviousPage(ev)} className="max-w-max"><Icons.backward /> Back</Button>}
                        {isLastPage && <Button type='submit' disabled={!isCurrentPageCompleted} className="max-w-max ml-auto">Submit <Icons.forward /></Button>}
                        {!isLastPage && <Button type='button' disabled={!isCurrentPageCompleted} onClick={gotoNextPage} className="max-w-max ml-auto">Next <Icons.forward /></Button>}
                    </div>
                </div>
            </form>
        </FormDataContext.Provider>
    )
}

export default EventForm;

const readSelectedFiles = (ev: React.ChangeEvent<HTMLInputElement>, processor: Callback) => {
    const files = ev.target.files // Get the selected file

    if (!files?.length) {
        console.error('No file selected.');
        return;
    }

    for (let i = 0; i < files.length; i++) {
        const file: File = files[i];
        processor(file);
    }
}