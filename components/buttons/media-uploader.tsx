import { Icons } from "../icons";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import styles from '../styles/styles.module.css';
import { APPCONFIG } from "@/lib/app-config";
import React, { ChangeEvent } from "react";
import axios from "axios";
import signUpload from "../../lib/cloudinary-signature";
import { snakeCase, trainCase } from "change-case";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";


interface UploaderProps extends React.HTMLAttributes<HTMLInputElement> {
    onFileSelection: (ev: React.ChangeEvent<HTMLInputElement>) => void;
    isRequired?: boolean;
    allowMultiple?: boolean;
    name?: string;
    children?: ReactNode;
    className?: string;
}

const MediaUploader = {
    uploadButton: ({ children, className, onFileSelection, isRequired = false, allowMultiple = false, ...props }: UploaderProps) => {

        return (
            <Label className={styles.upload_btn + ' image-picker upload-btn h-100 cursor-pointer'}>
                <div className={cn(styles.media_frame, 'image-picker-facade', className)}>
                    <Icons.plus className="text-muted-foreground" height="50" width="50" />
                </div>
                <Input type="file" className="input hidden file_uploader" multiple={allowMultiple}
                    accept="image/jpg, image/jpeg, image/png"
                    required={isRequired} onChange={(e) => onFileSelection(e)} {...props} />
            </Label>
        )
    },
    editButton: ({ children, className, onFileSelection, isRequired = false, allowMultiple = false, ...props }: UploaderProps) => {
        // const props = { ...rest, className: `${styles.media_frame} ${rest.className} image-picker-facade`};

        return (
            <Label className={cn(styles.edit_btn, 'image-picker edit-btn h-100 cursor-pointer', className)}>
                <div className={styles.icon_box}>
                    <Icons.edit />
                </div>
                <Input type="file" className="input hidden file_uploader edit-image" multiple={allowMultiple}
                    required={isRequired} accept="image/jpg, image/jpeg, image/png"
                    onChange={(e) => onFileSelection(e)} {...props} />
            </Label>
        )
    },
    uploadFile: async (file: File, attempts = 0, folder?: string) => {
        const { api, uploadSettings } = APPCONFIG.cloudinaryConfig;
        let cloudinarySettings: any = { ...uploadSettings };
        const uploader = MediaUploader.uploadFile;

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
                response = { status: false, error: error };
            }
        }

        return response;
    },
    deleteRecentlyUploadedImages: async (images: ImageInfo[]) => {
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
    }
}

export default MediaUploader;