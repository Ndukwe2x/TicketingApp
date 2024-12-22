import { useAppData, useEventFormData } from "@/hooks/useCustomContexts";
import { Api } from '@/lib/api';
import generateRandomString from '@/lib/random-string-generator';
import { Text } from '@/components/ui/text';
import styles from '../../../styles/styles.module.css';
import { Button } from '@/components/ui/button';
import React, { useState, useRef, FormEvent } from 'react';
import { cn } from '@/lib/utils';
import * as NextImage from "next/image";
import MediaUploader from "@/components/buttons/media-uploader";
import { toast } from "@/components/ui/sonner";
import EventEditFormSummary from "../../event-edit-form-summary";
import axios, { isAxiosError } from "axios";
import useAuthenticatedUser from "@/hooks/useAuthenticatedUser";
import { useRouter } from "next/navigation";
import { BiCheck, BiCheckDouble, BiEdit } from "react-icons/bi";
import { Icons } from "@/components/icons";

const Summary: React.FC<Omit<MultistepFormWizardStepProps, 'nextStep'>> = ({ prevStep }) => {
    const {
        formData,
        updateFormData,
        tempImages,
        updateTempImages,
        filesToUpload,
        updateFilesToUpload,
        updatePosterPreviewList
    } = useEventFormData();
    const { pageDataBag } = useAppData();
    const { onFailure, onSuccess } = pageDataBag.create_event as { onFailure?: Callback, onSuccess?: Callback } || {};
    const [existingImages] = useState<{ eventBanner: ImageInfo, posters: ImageInfo[] }>(
        { ...formData as SingleEvent }
    );

    const formId: string = 'event_form_' + generateRandomString(32, 'mixed_lower', false);
    const isNew: boolean = formData._id ? false : true;
    const formAction = isNew
        ? Api.server + Api.endpoints.admin.events
        : Api.server + Api.endpoints.admin.event.replace(':id', formData._id);
    const pageBaseClass = styles.event_form_page;
    const pageActiveClass = styles.current;
    const forwardButton = useRef<HTMLButtonElement>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccessful, setIsSuccessful] = useState(false);
    const actor = useAuthenticatedUser();
    const router = useRouter();

    const uploadImages = async (filesToUpload: SelectedUploadFilesProps) => {
        const results: UploadResponseDataProps = {};

        try {
            if (filesToUpload?.banner) {
                const bannerRes = await MediaUploader.uploadFile(filesToUpload.banner, 0, formData.title);
                if (isAxiosError(bannerRes)) {
                    throw bannerRes;
                }
                if (null === bannerRes) {
                    throw new Error('Unable to upload banner. An internal error has occurred')
                }
                results.banner = bannerRes;
            }

            if (filesToUpload?.posters?.length) {
                for (const file of filesToUpload.posters) {
                    const posterRes = await MediaUploader.uploadFile(file, 0, formData.title);
                    if (isAxiosError(posterRes)) {
                        throw posterRes;
                    }
                    if (null === posterRes) {
                        throw new Error('Unable to upload one or more posters. An unknown error has occorred');
                    }
                    if (!results.posters) {
                        results.posters = [];
                    }
                    results.posters.push((posterRes as unknown) as never);
                }
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
        if (!navigator.onLine) {
            toast("It appears you're offline. Please check your connection and try again.");
            return;
        }

        try {
            setIsLoading(true);
            let data = formData;

            if (filesToUpload?.banner || filesToUpload?.posters) {
                const uploadResponse = await uploadImages(filesToUpload);
                if (isNew && !uploadResponse.banner) {
                    throw new Error('Image upload failed');
                }
                const { banner = {}, posters = [] }: UploadResponseDataProps = uploadResponse;
                if (banner?.public_id) {
                    data = {
                        ...data,
                        eventBanner: { url: banner.secure_url as string, public_id: banner.public_id as string }
                    };
                }
                if (posters) {
                    data = {
                        ...data,
                        posters: [
                            ...data.posters || [],
                            ...posters.map(
                                poster => ({
                                    url: poster.secure_url as string,
                                    public_id: poster.public_id as string
                                })
                            )
                        ],
                    };
                }

                updateFormData && updateFormData(data);
            }
            try {
                const requestHandler = isNew ? axios.post : axios.patch;
                const eventResponse = await requestHandler(formAction, data, {
                    headers: {
                        Authorization: `Bearer ${actor?.token}`
                    }
                });

                if (eventResponse.status === 200 || eventResponse.status === 201) {
                    if (!isNew) {
                        // Delete the previous banner
                        MediaUploader.deleteRecentlyUploadedImages([existingImages.eventBanner]);
                    }
                    setIsLoading(false);
                    setIsSuccessful(true);
                    if (onSuccess) {
                        onSuccess(eventResponse.data);
                    } else {
                        const msg = <span className="text-green-800">
                            Event {isNew ? 'created' : 'updated'}.
                            {actor?.isSuperOwner && 'Attach a user to this event'}
                        </span>
                        toast(msg);
                    }
                    updateFormData && updateFormData({});
                    updateTempImages && updateTempImages({});
                    updateFilesToUpload && updateFilesToUpload({});
                    updatePosterPreviewList && updatePosterPreviewList([]);
                    return router.push(`/events/${eventResponse.data.eventId}`);
                }
            } catch (error) {
                const { eventBanner, posters = [] } = data as SingleEvent;
                MediaUploader.deleteRecentlyUploadedImages([eventBanner, ...posters]);

                toast(<div className="text-destructive">Unable to create event. An unexpected error has occured.</div>);
                console.error(error);
                setIsLoading(false);
            }
        } catch (error) {
            console.error(error);
            setIsLoading(false);
            toast(<div className="text-destructive">Unable to create event. One or more of the selected image(s) could not be uploaded</div>);
            onFailure && onFailure(error);
        }
    }

    return (
        <div className={cn(pageBaseClass, pageActiveClass, 'flex-col gap-4 flex-1')}>
            <Text variant='h3'>Preview</Text>
            <div id="preview-form-data">
                <EventEditFormSummary data={{ ...formData, ...tempImages } as SingleEvent} />
            </div>
            <div className="flex flex-row justify-content-between pt-5">
                <Button type="button" onClick={() => prevStep && prevStep()} className="max-w-max"><BiEdit size={20} />&nbsp; Modify</Button>
                <Button ref={forwardButton} onClick={handleSubmit} type='button' className="max-w-max ml-auto">
                    {isLoading && <React.Fragment>Loading... &nbsp;<Icons.spinner className='h-4 w-4 animate-spin' /></React.Fragment>}
                    {isSuccessful && <React.Fragment>Saved &nbsp;<BiCheckDouble size={20} /></React.Fragment>}
                    {!(isLoading || isSuccessful) && <React.Fragment>Save &nbsp;<BiCheck size={20} /></React.Fragment>}
                </Button>
            </div>
        </div>
    );
};

export default Summary;
