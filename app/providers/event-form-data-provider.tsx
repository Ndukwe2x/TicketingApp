import { EventFormDataContext } from "@/hooks/useCustomContexts";
import React, { useState, ReactNode } from "react";

interface FormProviderProps {
    children: ReactNode;
    defaultData?: SingleEvent | Record<string, any>;
    onPending?: Callback;
    onSuccess?: Callback;
    onFailure?: Callback;
}

export const EventFormDataProvider: React.FC<FormProviderProps> = ({ children, defaultData = {}, onPending, onSuccess, onFailure }) => {
    const [formData, setFormData] = useState<SingleEvent | Record<string, any>>(defaultData);
    const [posterPreviewList, setPosterPreviewList] = useState<ImageInfo[]>([]);
    const [tempImages, setTempImages] = useState<TempImagesProps>({});
    const [filesToUpload, addFilesToUpload] = useState<SelectedUploadFilesProps>({});

    const updateFormData = (newData: Record<string, any> | Callback) => {
        setFormData((prevData) => {
            let data;
            if (typeof newData === 'function') {
                data = newData(prevData)
            } else {
                data = newData;
            }
            return { ...prevData, ...data }
        })
    };

    const updatePosterPreviewList = (data: ImageInfo | ImageInfo[], overwrite: boolean = false) => {
        const newPosters = data instanceof Array ? data : [data];
        setPosterPreviewList(existingPosters => {
            if (overwrite) {
                return newPosters;
            }
            return [...existingPosters, ...newPosters]
        })
    }

    const updateTempImages = (newData: TempImagesProps) => {
        if (newData.eventBanner) {
            setTempImages((prevImgs) => ({
                ...prevImgs,
                eventBanner: newData.eventBanner
            }))
        }
        if (newData.posters) {
            setTempImages((prevImgs) => ({
                ...prevImgs,
                posters: [...(prevImgs.posters || []), ...(newData?.posters || [])]
            }))
        }
    }

    const updateFilesToUpload = (newData: SelectedUploadFilesProps) => {
        if (newData.banner) {
            addFilesToUpload((prevImgs) => ({
                ...prevImgs,
                banner: newData.banner
            }))
        }
        if (newData.posters) {
            addFilesToUpload((prevImgs) => ({
                ...prevImgs,
                posters: [...(prevImgs.posters || []), ...(newData?.posters || [])]
            }))
        }
    }

    return (
        <EventFormDataContext.Provider value={{
            formData,
            updateFormData,
            posterPreviewList,
            updatePosterPreviewList,
            tempImages,
            updateTempImages,
            filesToUpload,
            updateFilesToUpload,
            onPending,
            onSuccess,
            onFailure
        }}>
            {children}
        </EventFormDataContext.Provider>
    );
};