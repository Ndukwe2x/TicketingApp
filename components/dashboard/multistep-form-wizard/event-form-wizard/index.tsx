import React, { FormEvent, FormEventHandler, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Api } from "@/lib/api";
import { Text } from "@/components/ui/text";
import { Icons } from "@/components/icons";
import styles from '../../../styles/styles.module.css';
import MediaUploader, { EditButton, UploadButton } from "../../../buttons/media-uploader";
import axios, { AxiosResponse, isAxiosError } from "axios";
import { Checkbox } from "@/components/ui/checkbox";
import AddTicketCategory from "../../add-ticket-category";
import { cn, formatDate, parseFileToDataUri, parseFormFields } from "@/lib/utils";
import { toast } from "@/components/ui/sonner";
import DateTimeControls from "../../event-form-datetime-control";
import generateRandomString from "@/lib/random-string-generator";
import { MdClose, MdDeleteOutline, MdInfo } from "react-icons/md";
import EventEditFormSummary from "../../event-edit-form-summary";
import { deleteEvent } from "@/hooks/useGetEvent";
import { useRouter } from "next/navigation";
import * as NextImage from "next/image";
import { HTMLAttributes } from "react";
import { FormProvider } from "@/app/providers/form-context-provider";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Step1 from "./step1";
import { ReactElement } from "react";
import { useCallback } from "react";
import Step2 from "./step2";
import { useEventFormData } from "@/hooks/useCustomContexts";
import { EventFormDataProvider } from "@/app/providers/event-form-data-provider";
import Step3 from "./step3";
import Step4 from "./step4";
import Step5 from "./step5";
import Summary from "./summary";
import { DataPasserProvider } from "@/app/providers/data-passer-provider";
// import { useCallback } from "react";s

const RenderPage: React.FC<MultistepFormWizardStepProps & {
    // setPage: (pid: number) => void;
    pageId: number;
    event?: SingleEvent;
}> = ({ prevStep, nextStep, pageId, event }) => {
    // const [pageId, setPageId] = useState<number>(1);

    // const prevStep = () => setPageId(pageId - 1);
    // const nextStep = () => setPageId(pageId + 1);

    // useEffect(() => {
    //     setPage(pageId);
    // }, [pageId]);

    switch (pageId) {
        case 1:
            return <Step1 nextStep={() => nextStep()} />
        case 2:
            return <Step2 prevStep={prevStep} nextStep={nextStep} />
        case 3:
            return <Step3 prevStep={prevStep} nextStep={nextStep} />
        case 4:
            return <Step4 prevStep={prevStep} nextStep={nextStep} />
        case 5:
            return <Step5 prevStep={prevStep} nextStep={nextStep} />
        case 6:
            return <Summary prevStep={prevStep} />

        default:
            return <Step1 nextStep={() => nextStep()} />
    }
}

interface TempImagesProps {
    eventBanner?: Partial<ImageInfo>;
    posters?: Partial<ImageInfo>[];
};

interface SelectedUploadFilesProps {
    banner?: File,
    posters?: File[]
}

interface UploadResponseDataProps {
    banner?: Partial<CloudinaryUploadResponseData>;
    posters?: Partial<CloudinaryUploadResponseData>[];
}

const EventForm = (
    { actor, onSuccess, onFailure, event }:
        {
            actor: AppUser;
            onSuccess: (data: Record<string, any>) => any;
            onFailure?: (error?: any) => void;
            event?: SingleEvent;
        }
) => {
    // const [isFirstPage, setIsFirstPage] = React.useState<boolean>(true);
    // const [isLastPage, setIsLastPage] = React.useState<boolean>(false);
    // const [isCurrentPageCompleted, setIsCurrentPageCompleted] = React.useState<boolean>(false);
    // const [pageNumber, setPageNumber] = React.useState(1);
    // const pageBaseClass = styles.event_form_page;
    // const pageActiveClass = styles.current;
    // const currentPageSelector = `.${pageBaseClass}.${pageActiveClass}`;
    // const dynamicCurrentPage = () => document.querySelector(currentPageSelector);
    // const [pages, setPages] = React.useState<Array<Element>>([]);
    // const [pageCount, setPageCount] = React.useState(1);
    // const [eventTitle, setEventTitle] = React.useState(event ? event.title : '');
    // const formId: string = 'event_form_' + generateRandomString(32, 'mixed_lower', false);
    const isNew: boolean = event ? false : true;
    const formAction = isNew
        ? Api.server + Api.endpoints.admin.events
        : Api.server + Api.endpoints.admin.event.replace(':id', event?._id as string);

    // const {
    //     formData = event || {},
    //     updateFormData,
    //     posterPreviewList = event && event.posters || [],
    //     updatePosterPreviewList,
    //     tempImages,
    //     updateTempImages
    // } = useEventFormData();
    // const [isSuccessful, setIsSuccessful] = useState(false);
    // const [isLoading, setIsLoading] = useState(false);
    const [pageNumber, setPageNumber] = useState<number>(1);

    // const formRef = useRef<HTMLFormElement>(null);
    // const isCurrentPageCompleted = useRef<boolean>(false);
    // const uploadedImagesRef = useRef<{ banner: ImageInfo, posters: ImageInfo[] } | {}>({});
    // const bannerRef = useRef<HTMLDivElement>(null);
    // const router = useRouter();

    // const getInputsFromCurrentPage = () => {
    //     const fieldList: string = 'input:required, textarea:required, select:required';
    //     return (formRef.current?.querySelector(currentPageSelector)?.querySelectorAll(fieldList) as unknown) as HTMLFormControlsCollection;
    // };

    // const updatePageStatus = () => {
    //     const inputFields = getInputsFromCurrentPage();

    //     // Check to see if the user has filled all the required fields on a the active page
    //     // and activate/deactivate the forward button accordingly
    //     let totalUnfilled = 0;
    //     inputFields && Array.from(inputFields).forEach(field => {
    //         let elem = field as TypeOfFormControl;
    //         if (!elem.value) {
    //             totalUnfilled += 1;
    //         }
    //     });

    //     if (totalUnfilled > 0) {
    //         // setIsCurrentPageCompleted(false)
    //         isCurrentPageCompleted.current = false;
    //     } else {
    //         // setIsCurrentPageCompleted(true)
    //         isCurrentPageCompleted.current = true;
    //     }
    // };

    // useEffect(() => {
    //     if (formRef.current === null) {
    //         return;
    //     }
    //     const elements = Array.from(formRef.current.elements);
    //     elements.forEach((element) => {
    //         element.addEventListener('change', (ev) => {
    //             updatePageStatus();
    //         })
    //     });
    //     updatePageStatus();

    //     return () => {

    //     }
    // }, [formRef, updatePageStatus]);

    // useEffect(() => {
    //     const updatePages = () => {
    //         const pageElements = document.querySelectorAll(`.${pageBaseClass}`);
    //         setPages(Array.from(pageElements));
    //         setPageCount(pageElements.length);
    //     };

    //     updatePages();

    //     // const observer = new MutationObserver(updatePages);
    //     // const config = { childList: true, subtree: true };
    //     // // const targetNode = document.getElementById(formId) as Node;

    //     // observer.observe(formRef.current as Node, config);

    //     return () => {
    //         // observer.disconnect();
    //         // updatePageStatus();
    //         // Update the formData state on every call on updatePageStatus
    //         // This helps us currate all the form data as the user fills the form,
    //         // and then use to create a summary of the entire user inputs

    //         // if ( formRef.current !== null ) {
    //         //     const enteredData = new FormData(formRef.current as HTMLFormElement);
    //         //     const objectifiedFormData = formDataToObjects(enteredData.entries())
    //         //     .filter(({name, value}) => value != '[object File]');

    //         //     const processedData = parseFormFields(
    //         //         objectifiedFormData,
    //         //     );
    //         //     // formDataRef.current = processedData as Partial<SingleEvent> | {};
    //         //     setFormData(processedData);
    //         //     console.log('Initial Values: ', processedData);
    //         // }
    //     };
    // }, [pageBaseClass]);



    // const handleFormDataUpdate: FormEventHandler = (ev) => {
    //     const target: (typeof ev.target) = ev.target;
    //     const { name, value } = target as TypeOfFormControl;

    //     const objectified = parseFormFields([{ name, value }]);
    //     updateFormData(objectified);
    //     updatePageStatus();
    // }

    // const gotoNextPage = (ev: any) => {
    //     ev.preventDefault();

    //     if (!isCurrentPageCompleted) {
    //         return;
    //     }
    //     const target = ev.target as HTMLButtonElement;
    //     if (target.type == 'submit') {
    //         document.getElementById('event-form')?.dispatchEvent(
    //             new Event('submit')
    //         );
    //         return;
    //     }
    //     const staticCurrentPage = document.querySelector(currentPageSelector);
    //     staticCurrentPage?.classList.remove(pageActiveClass);
    //     staticCurrentPage?.nextElementSibling?.classList.add(pageActiveClass);
    //     updatePageStatus();
    //     setIsFirstPage(false);

    //     const pagesArr = Array.from(pages);
    //     if (pagesArr.pop()?.id == dynamicCurrentPage()?.id) {
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

    // const backToPreviousPage = (ev: any) => {
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


    /**
     * Create a preview of the previously uploaded image, and pass its url to a hidden form field
     * with the name 'eventBanner';
     * @param data The response data returned from Cloudinary after a successful image upload
     */
    // const previewBanner = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     if (bannerRef.current == null) {
    //         return;
    //     }
    //     const files = e.target.files || [];
    //     if (!files.length) {
    //         return;
    //     }
    //     const file = files[0];

    //     const bannerPreview = bannerRef.current;
    //     createSuspense(bannerPreview);
    //     bannerPreview.classList.remove('hidden');
    //     bannerPreview.style.display = 'flex';

    //     parseFileToDataUri(file)
    //         .then((dataUri) => {
    //             const img = new Image();
    //             img.src = dataUri;
    //             img.alt = file.name;

    //             img.onload = () => {
    //                 bannerPreview.replaceChild(img, bannerPreview.getElementsByClassName('suspense')[0]);
    //                 let btn = bannerPreview.getElementsByClassName(styles.edit_btn)[0] as HTMLElement;
    //                 btn.style.display = 'flex';
    //             }
    //             bannerPreview.style.backgroundImage = `url(${dataUri})`;

    //             // Replace any existing image with the new one
    //             if (bannerPreview.getElementsByTagName('img').length) {
    //                 bannerPreview.replaceChild(img, bannerPreview.getElementsByTagName('img')[0])
    //             } else {
    //                 bannerPreview.appendChild(img);
    //             }

    //             addFilesToUpload(files => ({
    //                 ...files,
    //                 banner: file
    //             }));

    //             updateTempImages && updateTempImages({ eventBanner: { url: dataUri } });
    //         })
    //         .catch((error) => {
    //             const msg = 'Unable to preview image';
    //             toast(msg)
    //             console.error(`${msg}: `, error.message());
    //         });

    // }

    // const previewPoster = async (e: React.ChangeEvent<HTMLInputElement>) => {
    //     const files = e.target.files || [];
    //     if (!files.length) {
    //         toast('No file selected');
    //         console.log('No file selected');
    //         return;
    //     }

    //     try {
    //         for (const file of files) {
    //             const dataUri = await parseFileToDataUri(file, { minSize: '5KB', maxSize: '5MB' });
    //             const imageData: ImageInfo = {
    //                 url: dataUri,
    //                 public_id: generateRandomString(32, 'mixed_lower')
    //             };
    //             updatePosterPreviewList && updatePosterPreviewList(imageData);

    //             addFilesToUpload(files => {
    //                 return {
    //                     ...files,
    //                     posters: [...(files.posters || []), file]
    //                 }
    //             });

    //             updateTempImages && updateTempImages({
    //                 posters: [{ url: dataUri }]
    //             })
    //         }
    //     } catch (err) {
    //         const errorMsg: string = 'Image preview error';
    //         toast(errorMsg);
    //         console.error(errorMsg, err);
    //     }
    // }

    // const createSuspense = (containerId: string | HTMLElement, hideUploadBtn: boolean = true): void => {
    //     const container: HTMLElement =
    //         typeof containerId === 'string'
    //             ? document.querySelector(containerId) as HTMLElement
    //             : containerId;

    //     if (container == null) {
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
    //         uploadBtn.remove();
    //     }

    //     container.style.display = 'flex';
    // };

    // const uploadImages = async () => {
    //     // if (filesToUpload.banner) {
    //     //     throw new Error('No banner selected');
    //     // }
    //     // let currentFormData = {...formDataRef.current};
    //     const results: UploadResponseDataProps = {};

    //     try {
    //         if (filesToUpload.banner) {
    //             const bannerRes = await MediaUploader.uploadFile(filesToUpload.banner, 0, eventTitle);
    //             if (isAxiosError(bannerRes)) {
    //                 throw bannerRes;
    //             }
    //             if (null === bannerRes) {
    //                 throw new Error('Unable to upload banner. An internal error has occurred')
    //             }
    //             // if (!results.banner) {
    //             //     results.banner = {};
    //             // }
    //             results.banner = bannerRes;
    //         }

    //         if (filesToUpload.posters?.length) {
    //             for (const file of filesToUpload.posters) {
    //                 const posterRes = await MediaUploader.uploadFile(file, 0, eventTitle);
    //                 if (isAxiosError(posterRes)) {
    //                     throw posterRes;
    //                 }
    //                 if (null === posterRes) {
    //                     throw new Error('Unable to upload one or more posters. An unknown error has occorred');
    //                 }
    //                 if (!results.posters) {
    //                     results.posters = [];
    //                 }
    //                 results.posters.push((posterRes as unknown) as never);
    //             }
    //         }

    //         return results;
    //     } catch (error) {
    //         throw error;
    //     }
    // }

    // /** Submit the event if everything is ok */
    // const handleSubmit = async (ev: FormEvent) => {
    //     if (!ev.isDefaultPrevented()) {
    //         ev.preventDefault();
    //     }

    //     try {
    //         setIsLoading(true);
    //         let data = formData;

    //         if (filesToUpload.banner || filesToUpload.posters) {
    //             const uploadResponse = await uploadImages();
    //             if (isNew && !uploadResponse.banner) {
    //                 throw new Error('Image upload failed');
    //             }
    //             const { banner = {}, posters = [] }: UploadResponseDataProps = uploadResponse;

    //             if (banner?.public_id) {
    //                 data = {
    //                     ...data,
    //                     ...{
    //                         eventBanner: { url: banner.secure_url as string, public_id: banner.public_id as string }
    //                     }
    //                 };
    //             }
    //             if (posters) {
    //                 data = {
    //                     ...data,
    //                     ...{
    //                         posters: [
    //                             ...data.posters || [],
    //                             ...posters.map(
    //                                 poster => ({
    //                                     url: poster.secure_url as string,
    //                                     public_id: poster.public_id as string
    //                                 })
    //                             )
    //                         ],
    //                     }
    //                 };
    //             }
    //             updateFormData(data);
    //         }


    //         try {
    //             const requestHandler = isNew ? axios.post : axios.patch;
    //             const eventResponse = await requestHandler(formAction, data, {
    //                 headers: {
    //                     Authorization: `Bearer ${actor?.token}`
    //                 }
    //             });

    //             if (eventResponse.status === 200 || eventResponse.status === 201) {
    //                 if (!isNew) {
    //                     // Delete the previous banner
    //                     MediaUploader.deleteRecentlyUploadedImages([event?.eventBanner as ImageInfo]);
    //                 }
    //                 if (!onSuccess) {
    //                     const msg = <span>Event {isNew ? 'created' : 'updated'}. {actor.isSuperOwner && 'Attach a user to this event'}</span>
    //                     toast(msg);
    //                     return router.push(`/events/${eventResponse.data.eventId}`);
    //                 }
    //                 onSuccess(eventResponse.data);
    //             }
    //         } catch (error) {
    //             const { eventBanner, posters = [] } = data as SingleEvent;

    //             MediaUploader.deleteRecentlyUploadedImages([eventBanner, ...posters]);
    //             toast('Unable to create event. An unexpected error has occured.');
    //             console.error(error);
    //             setIsLoading(false);
    //         }
    //     } catch (error) {
    //         toast('Unable to create event. One or more of the selected image(s) could not be uploaded');
    //         console.error(error);
    //         setIsLoading(false);
    //     }
    // }

    // const createSummary = React.useCallback(() => {
    //     return <EventEditFormSummary data={{ ...formData, ...tempImages } as SingleEvent} />
    // }, [formData, tempImages]);

    const minSteps = 1;
    const maxSteps = 6;
    const prevStep = () => {
        const targetPage = pageNumber <= minSteps ? minSteps : pageNumber - 1;
        if (targetPage < minSteps) {
            return;
        }
        setPageNumber(targetPage);
    }
    const nextStep = () => {
        let targetPage = pageNumber >= maxSteps ? maxSteps : pageNumber + 1;
        if (targetPage > maxSteps) {
            return;
        }
        setPageNumber(targetPage);
    }

    return (
        <EventFormDataProvider defaultData={event}>
            <DataPasserProvider data={{ onFailure, onSuccess }}>
                <RenderPage
                    pageId={pageNumber}
                    event={event}
                    prevStep={() => prevStep()}
                    nextStep={() => nextStep()} />
            </DataPasserProvider>
        </EventFormDataProvider>
    )
}

export default EventForm;


// interface PosterPreviewerProps extends HTMLAttributes<HTMLDivElement> {
//     poster: ImageInfo;
//     index: number;
// }


// function CreatePosterPreview({ children, className, poster, index, ...props }: PosterPreviewerProps) {
//     const Image = NextImage.default;
//     const { formData, updateFormData, posterPreviewList, updatePosterPreviewList } = useEventFormData();

//     const removePoster = (poster: ImageInfo) => {
//         const existingPosters = formData?.posters as ImageInfo[];
//         if (existingPosters?.length) {
//             const newPosters = existingPosters.filter(p => p.public_id !== poster.public_id);
//             updateFormData && updateFormData({ posters: newPosters });
//         }
//         if (posterPreviewList?.length) {
//             const modifiedPosters = posterPreviewList.filter(p => p.public_id !== poster.public_id);
//             updatePosterPreviewList && updatePosterPreviewList(modifiedPosters, true);
//         }
//     }

//     return (
//         <React.Fragment>
//             <div id={`poster-group-${index}`} className={cn(className, styles.poster_group, "poster-group border relative rounded-lg")} {...props}>
//                 <div className="image-wrapper rounded-lg overflow-hidden invisible">
//                     <Image src={poster.url} alt={poster.public_id} width={200} height={300} />
//                 </div>
//                 <div className={cn(styles.image_facade, "image-facade absolute left-0 top-0 right-0 bottom-0 rounded-lg")} style={{ backgroundImage: `url(${poster.url})` }}></div>
//                 {children}
//                 <Button onClick={(e) => removePoster(poster)}
//                     type="button" role="button" variant={null}
//                     className="remove-poster rounded-full absolute right-2 top-2 px-1.5 py-1 bg-black/60 text-white">
//                     <MdClose size={24} />
//                 </Button>
//             </div>
//         </React.Fragment>
//     )
// }