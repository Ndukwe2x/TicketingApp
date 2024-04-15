import React, { MouseEvent, ReactHTMLElement } from "react"
import { Button } from "../ui/button"
import Modal from "../ui/modal";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Api } from "@/lib/api";
import { Text } from "../ui/text";
import { Textarea } from "../ui/textarea";
import { ButtonIcon } from "@radix-ui/react-icons";
import { Icons } from "../icons";
import styles from '../styles/styles.module.css';
import MediaUploader from "./media-uploader-2";
import axios from "axios";
import { User } from "@/lib/logged-user";
import { Checkbox } from "../ui/checkbox";
import Link from "next/link";
import { MdCalendarViewDay, MdCalendarViewMonth, MdCalendarViewWeek, MdEditCalendar, MdEvent, MdPermContactCalendar } from "react-icons/md";

const CreateEventButton = () => {
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);

    const initDialog = () => {
        setIsDialogOpen(true);
    }

    const handleClose = () => {
        setIsDialogOpen(false);
    }

    const handleSave = () => {
        setIsDialogOpen(false);
    }

    return (
        <>
            <Modal title="Create Event" 
                displayText={ <Link href={'#'} onClick={ () => initDialog() } className="bg-primary border border-primary flex flex-row gap-1.5 hover:bg-primary/90 items-end px-4 py-2 rounded-full text-white">
                    <MdEvent size={26} />
                    Create Event</Link> 
                } 
                content={ <ModalContent /> } 
                onSave={ handleSave } 
                onClose={ handleClose }
                style={ { width: '40rem' } } />
        </>
    )
}

const ModalContent = () => {
    const [isFirstPage, setIsFirstPage] = React.useState<boolean>(true);
    const [isLastPage, setIsLastPage] = React.useState<boolean>(false);
    const [isCurrentPageCompleted, setIsCurrentPageCompleted] = React.useState<boolean>(false);
    // const [eventTitle, setEventTitle] = React.useState<string>('');
    const [pageNumber, setPageNumber] = React.useState(1);
    const pageBaseClass = styles.event_form_page;
    const pageActiveClass = styles.current;
    const currentPageSelector = `.${pageBaseClass}.${pageActiveClass}`;
    const allPages = () => document.querySelectorAll(`.${pageBaseClass}`);
    const dynamicCurrentPage = () => document.querySelector(currentPageSelector);

    const getInputsFromCurrentPage = () => {
        const fieldList = 'input:not([type="file"]), textarea, select';
        return document.querySelector(currentPageSelector)?.querySelectorAll(fieldList);
    }

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

        const pagesArr = Array.from(allPages());
        if (pagesArr.pop()?.id == dynamicCurrentPage()?.id) {
            setIsLastPage(true)
        } else {
            setIsLastPage(false)
        }
        setPageNumber(state => {
            if (state >= allPages().length) {
                state = allPages().length;
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

        const pagesArr = Array.from(allPages());
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

    type CloudinaryResponse = {
        
    }
    const previewBanner = (data) => {
        
        // {
        //     "asset_id": "96265ccb9be3e9f6c0d3236ffe962646",
        //     "public_id": "dp8nbfwa0wysgaesfd3f",
        //     "version": 1712421188,
        //     "version_id": "9423ec5fc1eef53b7d7364799d4840f4",
        //     "signature": "d6ac76a3136c1ac82d852dc7f68f554bc39accc0",
        //     "width": 640,
        //     "height": 426,
        //     "format": "jpg",
        //     "resource_type": "image",
        //     "created_at": "2024-04-06T16:33:08Z",
        //     "tags": [],
        //     "bytes": 87139,
        //     "type": "upload",
        //     "etag": "d33cee3028a27bbb5b33b9b0dc165420",
        //     "placeholder": false,
        //     "url": "http://res.cloudinary.com/dtuznvywy/image/upload/v1712421188/dp8nbfwa0wysgaesfd3f.jpg",
        //     "secure_url": "https://res.cloudinary.com/dtuznvywy/image/upload/v1712421188/dp8nbfwa0wysgaesfd3f.jpg",
        //     "folder": "",
        //     "access_mode": "public",
        //     "original_filename": "models"
        // }

        
        const imageUrl = data.secure_url;
                    // Create a thumbnail of the uploaded image, with 150px width
                    // const tokens = url.split('/');
                    // tokens.splice(-3, 0, 'w_150,c_scale');
                    // console.log('File uploaded successfully:', response.data);
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
            bannerPreview.getElementsByClassName(styles.edit_btn)[0].style.display = 'flex';

            const bannerPermalink = document.getElementById('banner');
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

    

    const previewPoster = (data) => {
        const imagePreview = document.querySelectorAll('.poster-group.loading')[0];
        if ( !imagePreview ) {
            console.error('Unable to preview image');
            return;
        };

        const imageUrl = data.secure_url;
        const mediaBox = document.getElementById('media-box');

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

            const imagePermalink = imagePreview.querySelector('input.poster_permalink');
            if (imagePermalink) imagePermalink.value = imageUrl;
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
        const hiddenField = document.createElement('input');
        const existingPosters = document.querySelectorAll(`.${styles.media_frame}.${styles.poster}`);
        const posterId = existingPosters.length - 1;
        const groupId = 'poster_' + posterId;
        const uploadBtn = container.getElementsByClassName('upload-btn')[0];

        posterGroup.id = groupId;
        posterGroup.classList.add(styles.media_frame, styles.poster, styles.img_preview, 'poster-group', 'loading');
        hiddenField.setAttribute('name', `posters[]`);
        hiddenField.setAttribute('type', 'hidden');
        hiddenField.classList.add('poster_permalink');
        posterGroup.appendChild(hiddenField);

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

    const handleSubmit = (ev) => {
        if ( !ev.isDefaultPrevented() ) {
            ev.preventDefault();
        }

        const user = User();
        const formElements = ev.target.elements;
        const formData = new FormData();
        
        Array.from(formElements).forEach((input: Element, key) => {
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
            <form id="event-form" action={ Api.server + Api.endpoints.admin.events } method="post" onSubmit={ handleSubmit }>
                <div className='flex flex-col gap-4 py-4'>
                    <div>
                        <Text variant='p'>Step { pageNumber } of { allPages().length }</Text>
                    </div>
                    <div id="event-form_page_a" className={ `${pageBaseClass} ${pageActiveClass} flex flex-col gap-4 flex-1`}>
                        <Text variant='h3'>Basic Info</Text>
                        <div className='flex flex-col gap-2'>
                            <Label htmlFor='title'>Title:</Label>
                            <Input id='title' name="title" onInput={ (ev) => { setEventTitle(ev.target.value); updatePageStatus(); return }} type='text' className="input h-14 text-lg" placeholder='The Big Friday Nights Party' />
                        </div>
                        <div className='flex flex-col gap-2'>
                            <Label htmlFor='description'>Description:</Label>
                            <Textarea id="description" name="description" rows={ 6 } onInput={ () => updatePageStatus() } className="input text-md" placeholder="Event description..."></Textarea>
                            <Text variant='p' className="text-muted-foreground text-xs" style={ { marginTop: '0' }}>Describe this event so that people will understand what the event is all about</Text>
                        </div>
                        <div className='flex flex-row gap-6'>
                            <div className="flex flex-col flex-1 gap-2">
                                <Label>Category</Label>
                                <Select name="event_category" onValueChange={ () => updatePageStatus() }>
                                    <SelectTrigger>
                                        <SelectValue placeholder='Select' />
                                    </SelectTrigger>
                                    <SelectContent className="input">
                                        <SelectItem value='student'>Student</SelectItem>
                                        <SelectItem value='regular'>Regular</SelectItem>
                                        <SelectItem value='vip'>VIP</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Text variant='p' className="text-muted-foreground text-xs" style={ { marginTop: '0' }}>Categorize the event to make it easy for people to discover.</Text>
                            </div>
                            <div className="flex flex-col flex-1 gap-2">
                                <Label>Age bracket</Label>
                                <Select name="age_bracket" onValueChange={ () => updatePageStatus() }>
                                    <SelectTrigger>
                                        <SelectValue placeholder='Age bracket' />
                                    </SelectTrigger>
                                    <SelectContent className="input">
                                        <SelectItem value='children'>Children less than 13</SelectItem>
                                        <SelectItem value='teenagers'>13 - 19</SelectItem>
                                        <SelectItem value='16+'>16 and above</SelectItem>
                                        <SelectItem value='18+'>18 and above</SelectItem>
                                        <SelectItem value='25+'>25 and above</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Text variant='p' className="text-muted-foreground text-xs" style={ { marginTop: '0' }}>Categorize the event to make it easy for people to discover.</Text>
                            </div>
                        </div>
                    </div>
                    <div id="event-form_page_b" className={ `${pageBaseClass} flex flex-col gap-4 flex-1` }>
                        <Text variant='h4'>Date & Venue:</Text>
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-row flex-1 gap-4">
                                {/* <div className='flex flex-col gap-2 flex-1'>
                                    <Label htmlFor='date'>Date:</Label>
                                    <Input id='date' name="eventDate" type='date'  onInput={ () => updatePageStatus() } />
                                </div> */}
                                <div className='flex flex-col gap-2 flex-1'>
                                    <Label htmlFor='time'>Time:</Label>
                                    <Input id='time' name="time" type='time' onInput={ () => updatePageStatus() } />
                                </div>
                            </div>
                            <div className="flex flex-col flex-1 gap-4">
                                <div className='flex flex-col gap-2'>
                                    <Label htmlFor='state'>State/Region:</Label>
                                    <Input id='state' name="state" placeholder="State/Region:" onInput={ () => updatePageStatus() } />
                                </div>
                                <div className='flex flex-col gap-2'>
                                    <Label htmlFor='city'>Town/City:</Label>
                                    <Input id='city' name="city" placeholder="Town/City:" onInput={ () => updatePageStatus() } />
                                </div>
                                <div className='flex flex-col gap-2'>
                                    <Label htmlFor='address'>Address:</Label>
                                    <Input id='address' name="address" placeholder="Street address:" onInput={ () => updatePageStatus() } />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id="event-form_page_c" className={ `${pageBaseClass} flex flex-col gap-4 flex-1` }>
                        <Text variant='h4'>Event banner:</Text>
                        <div className='flex flex-col gap-2'>
                            <div id='banner-box' className={ styles.banner_box }>
                                <div id='banner-preview' className={`${styles.image_picker_facade} ${styles.banner} ${ styles.img_preview } ${ styles.banner_preview} hidden`} >
                                    <MediaUploader.editButton onSuccess={ previewBanner } onInit={ () => createSuspense('#banner-preview') } />
                                </div>
                                <MediaUploader.uploadButton onSuccess={ previewBanner } onInit={ () => createSuspense('#banner-preview') } className={styles.banner} />
                            </div>
                            <Input id='banner' name="eventBanner" type='hidden' onInput={ () => updatePageStatus() } /> 
                            {/* Accepts permalink to the banner image */}
                        </div>
                    </div>
                    <div id="event-form_page_d" className={ `${pageBaseClass} flex flex-col gap-4 flex-1` }>
                        <Text variant='h4'>Event posters:</Text>
                        <div className='flex flex-col gap-2'>
                            <div id="posters" className="poster-groups gap-3 grid grid-cols-3">
                                    <MediaUploader.uploadButton onSuccess={ previewPoster } onInit={ () => createPosterGroup('posters') } className={styles.poster} />
                               
                            </div>
                        </div>
                    </div>
                    <div id="event-form_page_e" className={ `${pageBaseClass} flex flex-col gap-4 flex-1` }>
                        <Text variant='h4'>Event Featuring</Text>
                        <div className='flex flex-col gap-2'>
                            <Label htmlFor='featured'><Checkbox id='featured' name="featured" value='true' /> Feature this event</Label>
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

// npm i @cloudinary/url-gen @cloudinary/react

// import {Cloudinary} from "@cloudinary/url-gen";

// const App = () => {
//   const cld = new Cloudinary({cloud: {cloudName: 'dtuznvywy'}});
// };

export default CreateEventButton;