import { Icons } from "../icons";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import styles from '../styles/styles.module.css';
import { APPCONFIG } from "@/lib/app-config";
import React, { AllHTMLAttributes, ChangeEvent, HTMLAttributes, ReactEventHandler } from "react";
import axios from "axios";

// interface ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;
// interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
//   asChild?: boolean
// }
// type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const uploadFile = async (file: File, onSuccess: (data: object) => void, attempts = 0, assetFolder?: string) => {
    const cloudName = APPCONFIG.cloudinary.cloudName;
    const cloudinary = APPCONFIG.cloudinary.apiEndpoint.replace('{cloudName}', cloudName);
    
    let uploadSettings: object = APPCONFIG.cloudinary.uploadSettings;
    if ( assetFolder ) {
        uploadSettings = {...uploadSettings, asset_folder: assetFolder};
    }
    const formData = new FormData();
    formData.append('file', file);

    // Applying the cloudinary upload settings for the asset
    for (const [key, value] of Object.entries(uploadSettings)) {
        formData.append(key, value);
    }
    
    try {
        await axios
            .post(cloudinary, formData, {
                headers: {
                'Content-Type': 'multipart/form-data',
                },
            })
            .then((response) => {
                onSuccess(response.data);
            })
            .catch((error) => {
                if (attempts <= 3) {
                    setTimeout(() => {
                        attempts += 1;
                        uploadFile(file, onSuccess, attempts, assetFolder);
                    }, 2000);
                } else {
                    console.error('Error uploading file: ', error);
                }
            });
    } catch (error) {
        
    }
};

// interface UploadProcessorProps {
//     ev: ChangeEvent<HTMLInputElement>; 
//     onSuccess: (data: object) => void, 
//     onInit?: () => void;
//     assetFoler?: string
// }
const uploadSelectedFiles = async (
    ev: ChangeEvent<HTMLInputElement>, 
    onSuccess: (data: object) => void, 
    onInit?: () => void,
    assetFoler?: string
) => {

    const files = ev.target.files; // Get the selected file

    if (!files?.length) {
        console.error('No file selected.');
        return;
    }
    if (onInit) onInit();

    // formData.append('tags', 'browser_upload');
    for (let i = 0; i < files.length; i++) {
        uploadFile(files[i], onSuccess, 0, assetFoler);
    }
};

interface UploaderProps extends React.AllHTMLAttributes<HTMLElement> {
    onSuccess: (data: object) => void;
    onInit?: () => void;
    assetFolder?: string;
}
const MediaUploader = {
    uploadButton: ({ onSuccess, onInit, assetFolder, ...rest}: UploaderProps) => {
        
        // const fileSelector = document.querySelector('input[type="file"].file_uploader');
        // fileSelector?.addEventListener('change', (evt) => uploadSelectedFiles(evt), false);
        // const className = rest.className;
        const props = { ...rest, className: `${styles.media_frame} ${rest.className} image-picker-facade`};
        return (
            <Label className={styles.upload_btn + ' image-picker upload-btn h-100'}>
                <div {...props} >
                    <Icons.plus className="text-muted-foreground" height="50" width="50" />
                </div>
                <Input type="file" className="input hidden file_uploader" multiple onChange={ (ev) => uploadSelectedFiles(ev, onSuccess, onInit, assetFolder) } />
            </Label>
        )
    },
    editButton: ({ onSuccess, onInit, assetFolder, ...rest}: UploaderProps) => {
        const props = { ...rest, className: `${styles.media_frame} ${rest.className} image-picker-facade`};

        return (
            <Label className={`${styles.edit_btn} image-picker h-100`}>
                <div className={ styles.icon_box }>
                    <Icons.edit />
                </div>
                <Input type="file" className="input hidden file_uploader" multiple onChange={ (ev) => uploadSelectedFiles(ev, onSuccess, onInit, assetFolder) } />
            </Label>
        )
    }
}

export default MediaUploader;