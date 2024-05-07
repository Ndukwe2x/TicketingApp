import React, { FormEvent } from "react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Api } from "@/lib/api";
import { Text } from "../ui/text";
import { Icons } from "../icons";
import styles from '../styles/styles.module.css';
import MediaUploader from "../buttons/media-uploader-2";
import axios from "axios";
import { User } from "@/lib/logged-user";
import { Checkbox } from "../ui/checkbox";
import { v4 as uuidv4 } from 'uuid';
import AddTicketCategory from "./add-ticket-category";
import { pascalCase, trainCase } from "change-case";
import { parseInputName } from "@/lib/utils";

const CreateEventForm = () => {
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
    const formId = 'event-form_' + uuidv4();
    const [eventTitle, setEventTitle] = React.useState('');
    const [formData, setFormData] = React.useState({});

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
        };
    }, []);

    const getInputsFromCurrentPage = () => {
        const fieldList = 'input:not([type="file"]), textarea, select';
        return document.querySelector(currentPageSelector)?.querySelectorAll(fieldList);
    }

    const updatePageStatus = (): void => {
        const inputs = getInputsFromCurrentPage();

        // Update the formData state on every call on updatePageStatus
        // This helps us currate all the form data as the user fills the form,
        // and then use to create a summary of the entire user inputs
        const unemptyFields = Array.from(inputs).filter(input => input.value != '');
        unemptyFields.forEach(item => {
            const {key, readable} = parseInputName(item.name);
            setFormData({...formData, [key]: item.value});
        });

        // Check to see if the user has filled all the required fields on a the active page
        // and activate/deactivate the forward button accordingly
        let totalUnfilled = 0;

        inputs?.forEach(item => {
            let elem = item as HTMLInputElement;
            // let itemHasValue = elem.value ?? false;
            if ( elem.required && !elem.value ) {
                totalUnfilled += 1;
            }
        });

        if (totalUnfilled > 0) {
            setIsCurrentPageCompleted(false)
        } else {
            setIsCurrentPageCompleted(true)
        }
    };

    const gotoNextPage = (ev: MouseEvent) => {
        ev.preventDefault();

        if ( !isCurrentPageCompleted ) {
            return;
        }
        if ( ev.target?.type == 'submit') {
            document.getElementById('event-form')?.dispatchEvent(
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

    const previewBanner = (data: CloudinaryResponseData) => {
        const imageUrl = data.secure_url;
        const bannerPreview = document.getElementById('banner-preview') || document.createElement('div');
        const bannerBox = document.getElementById('banner-box');

        if ( !bannerPreview.id ) {
            bannerPreview.id = 'banner-preview';
            bannerBox?.prepend(bannerPreview);
            createSuspense('banner-preview');
        }
        
        bannerPreview.classList.remove('hidden');
        bannerPreview.style.display = 'flex';
        
        const img = new Image();
        img.src = imageUrl;
        img.alt = data.public_id;
        img.onload = () => {
            bannerPreview.replaceChild(img, bannerPreview.getElementsByClassName('suspense')[0]);
            let btn = bannerPreview.getElementsByClassName(styles.edit_btn)[0] as HTMLElement;
            btn.style.display = 'flex';
            const bannerPermalink = document.getElementById('banner') as HTMLInputElement;
            if (bannerPermalink) bannerPermalink.value = imageUrl;
            updatePageStatus();
        }
        bannerPreview.style.backgroundImage = `url(${imageUrl})`;
        if (bannerPreview.getElementsByTagName('img').length) {
            bannerPreview.replaceChild(img, bannerPreview.getElementsByTagName('img')[0])
        } else {
            bannerPreview.appendChild(img);
        }
        // bannerPermalink?.dispatchEvent(
        //     new Event('change')
        // )
    }

    

    const previewPoster = (data: any) => {
        const imagePreview = document.querySelector('.poster-group.loading') as HTMLElement;

        if ( !imagePreview ) {
            console.error('Unable to preview image');
            return;
        };
        const groupId = imagePreview.id;
        const groupIndex = groupId.slice(groupId.length - 1);
        const groupFieldName = `poseters[${groupIndex}]`;
        const imageUrl = data.secure_url;
        const imageId = data.public_id;
        // const mediaBox = document.getElementById('media-box');

        // if ( !imagePreview.id ) {
            // imagePreview.id = output;
            // mediaBox?.prepend(imagePreview);
            // createSuspense(output);
        // }
        
        imagePreview.classList.remove('hidden');
        imagePreview.style.display = 'flex';
        
        const img = new Image();
        img.src = imageUrl;
        img.alt = data.public_id;
        img.onload = () => {
            const suspense = imagePreview.getElementsByClassName('suspense')[0];
            if (suspense) {
                imagePreview.replaceChild(img, suspense);
            }
            // imagePreview.getElementsByClassName(styles.edit_btn)[0].style.display = 'flex';

            const hiddenField = document.createElement('input');
            hiddenField.name = groupFieldName;
            hiddenField.type = 'hidden';
            const permalink = hiddenField.cloneNode() as HTMLInputElement;
            const publicId = hiddenField.cloneNode() as HTMLInputElement;
            // permalink.classList.add('poster_permalink');
            permalink.name += '[url]';
            permalink.value = data.secure_url;
            publicId.name += '[public_id]';
            publicId.value = data.public_id;
            imagePreview.appendChild(permalink);
            imagePreview.appendChild(publicId);
            
            // const imagePermalink = imagePreview.querySelector('input.poster_permalink') as HTMLInputElement;
            // if (imagePermalink) imagePermalink.value = imageUrl;
            updatePageStatus();
            imagePreview.classList.remove('loading');
        }
        
        imagePreview.style.backgroundImage = `url(${imageUrl})`;
        if (imagePreview.getElementsByTagName('img').length) {
            imagePreview.replaceChild(img, imagePreview.getElementsByTagName('img')[0])
        } else {
            imagePreview.appendChild(img);
        }
    }

    const createPosterGroup = (containerId: string | HTMLElement) => {
        const container: HTMLElement | null =
            typeof containerId === 'string'
                ? document.getElementById(containerId)
                : containerId;

        if ( !container ) {
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

    const handleSubmit = (ev: FormEvent) => {
        if ( !ev.isDefaultPrevented() ) {
            ev.preventDefault();
        }

        const user = User;
        const form = ev.target as HTMLFormElement
        // const formElements = form.elements as HTMLFormControlsCollection;
        const formData = new FormData(form);
        console.log(formData.values());
        
        // Array.from(formElements).forEach((input, key) => {
        //     const inputElem = input as HTMLInputElement;
        //     formData.append(inputElem.name, inputElem.value);
        // });

        axios.post(form.action, formData, {
            headers: {
                Authorization: `Bearer ${user.token}`
            }
        })
        .then(
            response => {
                console.log(response.data);
            }
        )
        .catch(error => {
            console.log(error);
        })
    }

    const RenderSummary = React.useCallback(() => {
        return formData.entries(([name, value]) => {
            return (
                <>
                    <div className="border-b py-2">
                        <p className="grid grid-cols-[2fr_5fr]">
                            <label className="font-bold">{ pascalCase(name) }:</label> 
                            <span>{value}</span>
                        </p>
                    </div>
                </>
            )
        })
    }, [formData]);

    return (
        <>
            <form id={ formId } action={ Api.server + Api.endpoints.admin.events } method="post" onSubmit={ handleSubmit }>
                <div className='flex flex-col gap-4 py-4'>
                    <div>
                        <Text variant='p'>Step { pageNumber } of { pageCount }</Text>
                    </div>
                    <div id="event-form_page_a" className={ `${pageBaseClass} ${pageActiveClass} flex-col gap-4 flex-1`}>
                        <Text variant='h3'>Basic Info</Text>
                        <div className='flex flex-col gap-2'>
                            <Label htmlFor='title'>Title:</Label>
                            <Input id='title' name="title" 
                            onInput={ (ev) => { setEventTitle(ev.target.value); updatePageStatus(); return }} 
                            type='text' className="input h-14 text-lg" 
                            placeholder='The Big Friday Nights Party' required aria-required="true" />
                        </div>
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-row flex-1 gap-4">
                                <div className='flex flex-col gap-2 flex-1'>
                                    <Label htmlFor='date'>Date:</Label>
                                    <Input id='date' name="eventDate" type='date'  
                                    onInput={ () => updatePageStatus() } required aria-required='true' />
                                </div>
                                <div className='flex flex-col gap-2 flex-1'>
                                    <Label htmlFor='time'>Time:</Label>
                                    <Input id='time' name="time" type='time' 
                                    onChange={ () => updatePageStatus() } required aria-required='true' />
                                </div>
                            </div>
                            <div className="flex flex-col flex-1 gap-4">
                                <div className='flex flex-col gap-2'>
                                    <Label htmlFor='state'>State/Region:</Label>
                                    <Input id='state' name="state" placeholder="State/Region:" 
                                    onChange={ () => updatePageStatus() } required aria-required='true' />
                                </div>
                                <div className='flex flex-col gap-2'>
                                    <Label htmlFor='city'>Town/City:</Label>
                                    <Input id='city' name="city" placeholder="Town/City:" 
                                    onInput={ () => updatePageStatus() } required aria-required='true' />
                                </div>
                                <div className='flex flex-col gap-2'>
                                    <Label htmlFor='address'>Address:</Label>
                                    <Input id='address' name="address" placeholder="Street address:" 
                                    onInput={ () => updatePageStatus() } required aria-required='true' />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id="event-form_page_b" className={ `${pageBaseClass} flex-col gap-4 flex-1` }>
                    <Text variant='h4'>Ticket Categories</Text>
                        { AddTicketCategory() }
                        <Text variant='h4'>Event Featuring</Text>
                        <div className='flex flex-col gap-2'>
                            <Label htmlFor='featured'><Checkbox id='featured' name="featured" value='true' /> Feature this event</Label>
                        </div>
                    </div>
                    <div id="event-form_page_c" className={ `${pageBaseClass} flex-col gap-4 flex-1` }>
                        <Text variant='h4'>Event banner:</Text>
                        <div className='flex flex-col gap-2'>
                            <div id='banner-box' className={ styles.banner_box }>
                                <div id='banner-preview' className={`${styles.image_picker_facade} ${styles.banner} ${ styles.img_preview } ${ styles.banner_preview} hidden`} >
                                    <MediaUploader.editButton onSuccess={ previewBanner } onInit={ () => createSuspense('#banner-preview') } />
                                </div>
                                <MediaUploader.uploadButton 
                                    onSuccess={ previewBanner } 
                                    onInit={ () => createSuspense('#banner-preview') } 
                                    assetFolder={ trainCase(eventTitle).toLowerCase() }
                                    className={styles.banner} />
                            </div>
                            <Input id='banner' name="eventBanner" type='hidden' 
                            onInput={ updatePageStatus } required aria-required='true' />
                        </div>
                    </div>
                    {/* <div id="event-form_page_d" className={ `${pageBaseClass} flex-col gap-4 flex-1` }>
                        <Text variant='h4'>Event posters:</Text>
                        <div className='flex flex-col gap-2'>
                            <div id="posters" className="poster-groups gap-3 grid grid-cols-3">
                                    <MediaUploader.uploadButton onSuccess={ previewPoster } 
                                    onInit={ () => createPosterGroup('posters') } className={styles.poster} />
                               
                            </div>
                        </div>
                    </div> */}
                    <div id="event-form_page_e" className={ `${pageBaseClass} flex-col gap-4 flex-1` }>
                        <Text variant='h3'>Preview</Text>
                        <div id="preview-form-data">
                            { RenderSummary() }
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

export default CreateEventForm;