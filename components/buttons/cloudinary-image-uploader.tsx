import React from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;
type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const CloudinaryImageUploader = (buttonProps: ButtonProps, inputProps: InputProps) => {
    const cloudName = 'dtuznvywy';
    const unsignedUploadPreset = 'doc_codepen_example';

    const fileSelect = document.getElementById("fileSelect");
    const fileElem = document.getElementById("fileElem");
    const urlSelect = document.getElementById("urlSelect");
    const dropbox = document.getElementById("dropbox");

    fileSelect?.addEventListener("click", function (e) {
        if (fileElem) {
            fileElem.click();
        }
        e.preventDefault(); // prevent navigation to "#"
    }, false);

    urlSelect?.addEventListener("click", function (e) {
        uploadFile('https://res.cloudinary.com/hzxyensd5/image/upload/sample.jpg');
        e.preventDefault(); // prevent navigation to "#"
    }, false);

    // ************************ Drag and drop ***************** //
    function dragenter(e: DragEvent) {
        e.stopPropagation();
        e.preventDefault();
    }

    function dragover(e: DragEvent) {
        e.stopPropagation();
        e.preventDefault();
    }

    dropbox?.addEventListener("dragenter", dragenter, false);
    dropbox?.addEventListener("dragover", dragover, false);
    dropbox?.addEventListener("drop", drop, false);

    function drop(e: DragEvent) {
        e.stopPropagation();
        e.preventDefault();

        const dt = e.dataTransfer;
        const files = dt?.files;

        handleFiles(files);
    }

    // *********** Upload file to Cloudinary ******************** //
    function uploadFile(file: File) {
        const url = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;
        const fd = new FormData();
        fd.append('upload_preset', unsignedUploadPreset);
        fd.append('tags', 'browser_upload'); // Optional - add tags for image admin in Cloudinary
        fd.append('file', file);

        fetch(url, {
            method: 'POST',
            body: fd,
        })
            .then((response) => response.json())
            .then((data) => {
                // File uploaded successfully
                const url = data.secure_url;
                // Create a thumbnail of the uploaded image, with 150px width
                const tokens = url.split('/');
                tokens.splice(-3, 0, 'w_150,c_scale');
                const img = new Image();
                img.src = tokens.join('/');
                img.alt = data.public_id;
                document.getElementById('gallery')?.appendChild(img);
            })
            .catch((error) => {
                console.error('Error uploading the file:', error);
            });
    }

    // *********** Handle selected files ******************** //
    const handleFiles = function (files: FileList) {
        for (let i = 0; i < files.length; i++) {
            uploadFile(files[i]); // call the function to upload the file
        }
    };

    return (
        <>
            
        </>
    )
}