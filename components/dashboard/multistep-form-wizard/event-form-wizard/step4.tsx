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


const Step4: React.FC<MultistepFormWizardStepProps> = ({ prevStep, nextStep }) => {
    // const { register, formState: { errors } } = useForm<TicketCategories>();
    const {
        updateFormData,
        posterPreviewList = [],
        updatePosterPreviewList,
        tempImages,
        updateTempImages,
        updateFilesToUpload
    } = useEventFormData();
    const formId: string = 'event_form_' + generateRandomString(32, 'mixed_lower', false);
    // const isNew: boolean = event ? false : true;
    // const formAction = isNew
    //     ? Api.server + Api.endpoints.admin.events
    //     : Api.server + Api.endpoints.admin.event.replace(':id', event?._id as string);
    const pageBaseClass = styles.event_form_page;
    const pageActiveClass = styles.current;
    // const [isFormCompleted, setIsFormCompleted] = useState<boolean>(false);
    const form = useRef<HTMLFormElement>(null);
    const forwardButton = useRef<HTMLButtonElement>(null);
    // const [filesToUpload, addFilesToUpload] = React.useState<SelectedUploadFilesProps>({});

    // useEffect(() => {
    //     if (!(form.current && forwardButton.current)) {
    //         return;
    //     }

    //     const frm = form.current;
    //     const btn = forwardButton.current;
    //     let emptyFields = getEmptyFormFields(frm, true);
    //     if (emptyFields.length) {
    //         btn.disabled = true;
    //     } else {
    //         btn.disabled = false;
    //     }
    //     const formElements = Array.from(frm.elements);
    //     formElements.forEach((element) => {
    //         element.addEventListener('change', (ev) => {
    //             emptyFields = getEmptyFormFields(frm, true);
    //             if (emptyFields.length) {
    //                 btn.disabled = true;
    //             } else {
    //                 btn.disabled = false;
    //             }
    //         });
    //     });
    //     return () => {

    //     }
    // }, [form.current, forwardButton.current]);

    const handleSubmit: FormEventHandler<HTMLFormElement> = (ev) => {
        // const data = Array.from(
        //     new FormData(ev.target as HTMLFormElement).entries()
        // );
        // for (const [name, value] of data) {
        //     updateFormData && updateFormData({ [name]: value.toString() });
        // }
        nextStep();
        ev.preventDefault();
    };

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

    const previewPoster = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files || [];
        if (!files.length) {
            toast('No file selected');
            console.log('No file selected');
            return;
        }

        try {
            for (const file of files) {
                const dataUri = await parseFileToDataUri(file, { minSize: '5KB', maxSize: '5MB' });
                const imageData: ImageInfo = {
                    url: dataUri,
                    public_id: generateRandomString(32, 'mixed_lower')
                };
                updatePosterPreviewList && updatePosterPreviewList(imageData);

                // updateFilesToUpload(files => {
                //     return {
                //         ...files,
                //         posters: [...(files.posters || []), file]
                //     }
                // });
                updateFilesToUpload && updateFilesToUpload({
                    posters: [file]
                })

                updateTempImages && updateTempImages({
                    posters: [{ url: dataUri }]
                })
            }
        } catch (err) {
            const errorMsg: string = 'Image preview error';
            toast(errorMsg);
            console.error(errorMsg, err);
        }
    }

    return (
        <form id={formId}
            ref={form}
            onSubmit={handleSubmit}
            className={`${pageBaseClass} ${pageActiveClass} flex-col gap-4 flex-1`}>
            <Text variant='h4'>Event posters:</Text>
            <div className='flex flex-col gap-2'>
                <div id="posters" className="poster-groups gap-3 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
                    {
                        posterPreviewList && posterPreviewList.map((poster, index) => (
                            <React.Fragment key={index}>
                                <CreatePosterPreview poster={poster} index={index}>
                                    <input type="hidden" name={`posters[${index}][url]`} defaultValue={poster.url} />
                                    <input type="hidden" name={`posters[${index}][public_id]`}
                                        defaultValue={poster.public_id || ''} />
                                </CreatePosterPreview>
                            </React.Fragment>
                        ))
                    }
                    <UploadButton name="posters" onFileSelection={previewPoster}
                        required={false}
                        aria-required={false}
                        className={styles.poster} />
                </div>
            </div>
            <div className="flex flex-row justify-content-between pt-5">
                <Button type="button" onClick={() => prevStep && prevStep()} className="max-w-max"><Icons.backward /> Back</Button>
                <Button ref={forwardButton} type='submit' className="max-w-max ml-auto">Next <Icons.forward /></Button>
            </div>
        </form>
    );
};

export default Step4;

interface PosterPreviewerProps extends HTMLAttributes<HTMLDivElement> {
    poster: ImageInfo;
    index: number;
}


function CreatePosterPreview({ children, className, poster, index, ...props }: PosterPreviewerProps) {
    const Image = NextImage.default;
    const { formData, updateFormData, posterPreviewList, updatePosterPreviewList } = useEventFormData()

    const removePoster = (poster: ImageInfo) => {
        const existingPosters = formData?.posters as ImageInfo[];
        if (existingPosters?.length) {
            const newPosters = existingPosters.filter(p => p.public_id !== poster.public_id);
            updateFormData && updateFormData({ posters: newPosters });
        }
        if (posterPreviewList?.length) {
            const modifiedPosters = posterPreviewList.filter(p => p.public_id !== poster.public_id);
            updatePosterPreviewList && updatePosterPreviewList(modifiedPosters, true);
        }
    }

    return (
        <React.Fragment>
            <div id={`poster-group-${index}`}
                className={cn(className, styles.poster_group, "poster-group border relative rounded-lg")} {...props}>
                <div className="image-wrapper rounded-lg overflow-hidden invisible">
                    <Image src={poster.url} alt={poster.public_id} width={200} height={300} />
                </div>
                <div className={cn(styles.image_facade, "image-facade absolute left-0 top-0 right-0 bottom-0 rounded-lg")}
                    style={{ backgroundImage: `url(${poster.url})` }}></div>
                {children}
                <Button onClick={(e) => removePoster(poster)}
                    type="button" role="button" variant={null}
                    className="remove-poster rounded-full absolute right-2 top-2 px-1.5 py-1 bg-black/60 text-white">
                    <MdClose size={24} />
                </Button>
            </div>
        </React.Fragment>
    )
}