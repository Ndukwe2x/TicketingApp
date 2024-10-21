// import { useForm, SubmitHandler } from 'react-hook-form';
import { useEventFormData } from "@/hooks/useCustomContexts";
import { Api } from '@/lib/api';
import generateRandomString from '@/lib/random-string-generator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Text } from '@/components/ui/text';
import DateTimeControls from '../../event-form-datetime-control';
import { DataPasserProvider } from '@/app/providers/data-passer-provider';
import styles from '../../../styles/styles.module.css';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import React, { useState, useRef, useEffect, FormEventHandler, HTMLAttributes } from 'react';
import { cn, getEmptyFormFields, parseFileToDataUri } from '@/lib/utils';
import AddTicketCategory from '../../add-ticket-category';
import { MdClose } from 'react-icons/md';
import * as NextImage from "next/image";
import { EditButton, UploadButton } from "@/components/buttons/media-uploader";
import { toast } from "@/components/ui/sonner";
import { useCallback } from "react";


const Step3: React.FC<MultistepFormWizardStepProps & { event?: SingleEvent }> = ({ prevStep, nextStep, event }) => {
    // const { register, formState: { errors } } = useForm<TicketCategories>();
    const {
        formData,
        updateFormData,
        tempImages,
        updateTempImages,
        filesToUpload,
        updateFilesToUpload
    } = useEventFormData();
    const formId: string = 'event_form_' + generateRandomString(32, 'mixed_lower', false);
    // const isNew: boolean = event ? false : true;
    // const formAction = isNew
    //     ? Api.server + Api.endpoints.admin.events
    //     : Api.server + Api.endpoints.admin.event.replace(':id', event?._id as string);
    const pageBaseClass = styles.event_form_page;
    const pageActiveClass = styles.current;
    const form = useRef<HTMLFormElement>(null);
    const forwardButton = useRef<HTMLButtonElement>(null);
    const bannerRef = useRef<HTMLDivElement>(null);
    // const [tempImages, setTempImages] = React.useState<Partial<TempImagesProps>>({});
    // const [filesToUpload, addFilesToUpload] = React.useState<SelectedUploadFilesProps>({});

    useEffect(() => {
        if (!(form.current && forwardButton.current)) {
            return;
        }

        const frm = form.current;
        const btn = forwardButton.current;
        let emptyFields = getEmptyFormFields(frm, true);
        if (emptyFields.length) {
            btn.disabled = true;
        } else {
            btn.disabled = false;
        }
        const formElements = Array.from(frm.elements);
        formElements.forEach((element) => {
            element.addEventListener('change', (ev) => {
                emptyFields = getEmptyFormFields(frm, true);
                if (emptyFields.length) {
                    btn.disabled = true;
                } else {
                    btn.disabled = false;
                }
            });
        });
        return () => {

        }
    }, []);

    const handleSubmit: FormEventHandler<HTMLFormElement> = (ev) => {
        const data = Array.from(
            new FormData(ev.target as HTMLFormElement).entries()
        );
        for (const [name, value] of data) {
            updateFormData && updateFormData({ [name]: value.toString() });
        }
        nextStep();
        ev.preventDefault();
    };

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

    /**
     * Create a preview of the previously uploaded image, and pass its url to a hidden form field
     * with the name 'eventBanner';
     * @param data The response data returned from Cloudinary after a successful image upload
     */
    const previewBanner = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (bannerRef.current == null) {
            return;
        }
        const files = e.target.files || [];
        if (!files.length) {
            return;
        }
        const file = files[0];

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

                updateFilesToUpload && updateFilesToUpload({
                    banner: file
                });

                updateTempImages && updateTempImages({ eventBanner: { url: dataUri } });
            })
            .catch((error) => {
                const msg = 'Unable to preview image';
                toast(msg)
                console.error(`${msg}: `, error.message());
            });

    }

    const sampleBanner = useRef<ImageInfo | null>(tempImages?.eventBanner ?? formData.eventBanner ?? null);

    return (
        <form id={formId}
            ref={form}
            onSubmit={handleSubmit}
            className={`${pageBaseClass} ${pageActiveClass} flex-col gap-4 flex-1`}>
            <Text variant='h4'>Event banner:</Text>
            <div className='flex flex-col gap-2'>
                <div id='banner-box' className={styles.banner_box}>
                    <div id='banner-preview' ref={bannerRef} style={sampleBanner.current?.url ? { backgroundImage: `url(${sampleBanner.current?.url})` } : {}}
                        className={cn(styles.image_picker_facade, styles.banner, styles.img_preview, styles.banner_preview, sampleBanner.current?.url ? 'flex' : 'hidden')}>
                        {(sampleBanner.current?.url) && <NextImage.default src={sampleBanner.current?.url}
                            title={formData.title ?? ''}
                            alt={sampleBanner.current?.public_id ?? formData.title ?? 'New Banner Image'}
                            width="280" height="200" />}
                        <EditButton name="eventBanner" onFileSelection={previewBanner}
                            className={cn(sampleBanner.current?.url && 'block')} />
                    </div>
                    {!sampleBanner.current?.url && <UploadButton name="eventBanner"
                        onFileSelection={previewBanner}
                        required={true}
                        className={cn(styles.banner)} />}
                </div>
                {formData.eventBanner?.url && <input type="hidden" name="eventBanner[url]" defaultValue={formData.eventBanner?.url} />}
                {formData.eventBanner?.public_id && <input type="hidden" name="eventBanner[public_id]" defaultValue={formData.eventBanner?.public_id || ''} />}
            </div>
            <div className="flex flex-row justify-content-between pt-5">
                <Button type="button" onClick={() => prevStep && prevStep()} className="max-w-max"><Icons.backward /> Back</Button>
                <Button ref={forwardButton} type='submit' disabled={true} className="max-w-max ml-auto">Next <Icons.forward /></Button>
            </div>
        </form>
    );
};

export default Step3;