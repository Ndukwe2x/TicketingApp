import { Icons } from "../icons";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import styles from '../styles/styles.module.css';
import { APPCONFIG } from "@/lib/app-config";
import React, { HTMLAttributes, HtmlHTMLAttributes } from "react";
import axios, { AxiosError } from "axios";
import signUpload from "../../lib/cloudinary-signature";
import { snakeCase, trainCase } from "change-case";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";


interface UploaderProps extends HTMLAttributes<HTMLInputElement> {
    onFileSelection: (ev: React.ChangeEvent<HTMLInputElement>) => void;
    name?: string;
    required?: true | false;
};

const UploadButton: React.FC<UploaderProps> = ({ className, name, onFileSelection, ...props }) => {
    return (
        <Label className={cn(styles.upload_btn, ' image-picker upload-btn h-100 cursor-pointer')}>
            <div className={cn(styles.media_frame, 'image-picker-facade', className)}>
                <Icons.plus className="text-muted-foreground" height="50" width="50" />
            </div>
            <Input type="file" name={name} className="input hidden file_uploader"
                accept="image/jpg, image/jpeg, image/png"
                onChange={(e) => onFileSelection(e)} {...props} />
        </Label>
    )
};


const EditButton: React.FC<UploaderProps> = ({ children, className, name, onFileSelection, ...props }) => {
    // const props = { ...rest, className: `${styles.media_frame} ${rest.className} image-picker-facade`};

    return (
        <Label className={cn(styles.edit_btn, 'image-picker edit-btn h-100 cursor-pointer', className)}>
            <div className={styles.icon_box}>
                <Icons.edit />
            </div>
            <Input type="file" name={name} className="input hidden file_uploader edit-image"
                accept="image/jpg, image/jpeg, image/png"
                onChange={(e) => onFileSelection(e)} {...props} />
        </Label>
    )
};

const uploadFile = async (file: File, attempts = 0, folder?: string): Promise<null | CloudinaryUploadResponseData | AxiosError> => {
    const { api, uploadSettings } = APPCONFIG.cloudinaryConfig;
    let cloudinarySettings: any = { ...uploadSettings };
    const uploader = uploadFile;

    if (folder) {
        cloudinarySettings = {
            ...cloudinarySettings,
            folder: folder,
            // public_id: snakeCase(folder + '/' + file)
        };
    }

    const signables = {
        ...cloudinarySettings,
        // source: cloudName
    };

    const { sortedSignableParams, signature } = signUpload(signables, api.secret);

    const uploadData = {
        file: file,
        api_key: api.key,
        ...sortedSignableParams,
        signature
    }
    let response = null;
    try {
        const res = await axios.post(api.upload, uploadData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
        response = res.data;
    } catch (error) {
        if (attempts <= 3) {
            setTimeout(() => {
                attempts += 1;
                response = uploader(file, attempts, folder);
            }, 2000);
        } else {
            console.error('Error uploading file: ', error);
            // response = { status: false, error: error };
            response = error as AxiosError;
        }
    }

    return response;
};

const deleteRecentlyUploadedImages = async (images: ImageInfo[]) => {
    async function deleteImage({ publicId }: { publicId: string }) {
        const { cloudName, api } = APPCONFIG.cloudinaryConfig;

        const { sortedSignableParams, signature, timestamp } = signUpload({ public_id: publicId }, api.secret);

        try {
            const response = await axios
                .post(api.destroy, {
                    api_key: api.key,
                    public_id: publicId,
                    ...sortedSignableParams,
                    signature: signature,
                    timestamp: timestamp
                });

            return { status: true, data: response.data };
        } catch (error) {
            console.error(error);
            return { status: false, error: error }
        }
    };

    const result = await Promise.all(
        images.map(image => deleteImage({ publicId: image.public_id }))
    );

    return result;
};

const MediaUploader = {
    uploadButton: UploadButton,
    editButton: EditButton,
    uploadFile,
    deleteRecentlyUploadedImages
}

export default MediaUploader;

export {
    UploadButton,
    EditButton,
    uploadFile,
    deleteRecentlyUploadedImages
}