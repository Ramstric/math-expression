import { useState, useEffect, useRef } from 'react';

import Button from './components/Button';

import { ToastContainer, toast, Slide } from 'react-toastify';

import './Upload.css';

export interface PreprocessingData {
  preprocessImage: string;
  contourImage: string;
  segmentsImages: string[];
  latex: string;
  python: string;
}

const VALID_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'] as const;
const MAX_FILE_SIZE_MB = 5 * 1024 * 1024; // 5MB in bytes

const validateImageFile = (file: File): string | null => {
  if (!VALID_IMAGE_TYPES.includes(file.type as any)) {
    return 'Please select a valid image file (JPEG, PNG, GIF, WEBP)';
  }
  if (file.size > MAX_FILE_SIZE_MB) {
    return `File size must be less than 5 MB`;
  }
  return null;
};

export function Upload({ status, showComponentsHandler }: { status: boolean, showComponentsHandler: (data: PreprocessingData | null) => void }) {
    const [uploadState, setUploadState] = useState<'input' | 'unavailable' | 'wait' | 'ready'>('input');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | undefined>(undefined);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState<boolean>(false);

    let description = <p><span id='highlight-first__sentence'><span id='highlight-first__word'>Choose</span> a file</span> or <span id='highlight-second__sentence'><span id='highlight-second__word'>drag</span> it here</span>.</p>;

    useEffect(() => {
        setUploadState(status ? 'input' : 'unavailable');
    }, [status]);


    const handleFileInput = (e: React.MouseEvent<HTMLDivElement>) => {
        if (uploadState === 'unavailable') {
            return;
        }

        showComponentsHandler(null);
        e.preventDefault();

        const fileInput = fileInputRef.current as HTMLInputElement;
        fileInput.click();
        fileInput.onchange = (event) => {
            const files = (event.target as HTMLInputElement).files;
            if (files && files.length > 0) {
                const validationError = validateImageFile(files[0]);
                
                if (validationError) {
                    toast.error(validationError);
                    return;
                }

                setImageFile(files[0]);
                setImagePreview(URL.createObjectURL(files[0]));
                setUploadState('ready');
            }
        }
    }

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    }

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
    }

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        if (uploadState === 'unavailable') {
            return;
        }

        showComponentsHandler(null); // Reset the components when a new file is dropped

        e.preventDefault();
        setIsDragging(false);
        setUploadState('wait');

        const files = e.dataTransfer.files;

        const validationError = validateImageFile(files[0]);
        
        if (validationError) {
            toast.error(validationError);
            setUploadState('input');
            return;
        }

        setImageFile(files[0]);
        setImagePreview(URL.createObjectURL(files[0]));

        setUploadState('ready');
    }

    const handleTranslationRequest = async () => {
        const formData = new FormData();
        formData.append('image', imageFile as File);
        
        try {
            setUploadState('wait');
            const response = await fetch("/api/math/translate", { method: 'POST', body: formData });
            const data = await response.json();

            showComponentsHandler({
                preprocessImage: `/api/${data.processed_image}?t=${Date.now()}`, // Add timestamp to prevent caching
                contourImage: `/api/${data.contours_image}?t=${Date.now()}`,
                segmentsImages: data.segments.map((segment: string) => `/api/${segment}?t=${Date.now()}`),
                latex: data.latex,
                python: data.python
            });

            setUploadState('ready');

        } catch (error) {
            setUploadState('input');
            setImageFile(null);
            console.error('Error uploading image:', error);
            toast.error('There was an error processing your image. Please try a different image.');
            return;
        }
        
    }

    if (uploadState === 'wait') {
        description = <p>Processing your image...</p>;
    }

    if (uploadState === 'ready') {
        description = <p><span id='highlight-first__sentence'><span id='highlight-first__word'>Choose another</span> file</span> or <span id='highlight-second__sentence'><span id='highlight-second__word'>drag</span> it here</span>.</p>;
    }

    if (uploadState === 'unavailable') {
        description = <p>The <span id='highlight-first__sentence'>API</span> is currently <span id='highlight-second__sentence'>unavailable</span></p>;
    }

    return (
        <div id="upload" className="center-div">
            <input ref={fileInputRef} type="file" style={{display: 'none'}} />
            <h2>First, <b>upload</b> an image or picture of the math expression!</h2>
            <div className={`upload__container ${isDragging ? 'file-hover' : ''} center-div`} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop} onClick={handleFileInput}>
                <div className={`upload__foreground ${uploadState} center-div`}>
                    <svg
                        id="upload__icon"
                        width="76" height="76" viewBox="0 0 76 76"
                        fill="#FFECE7" xmlns="http://www.w3.org/2000/svg"
                    >
                        <path opacity="0.5" d="M69.25 50.4994V47.3744C69.25 38.5356 69.2494 34.1175 66.5034 31.3716C63.7575 28.6257 59.3381 28.6257 50.4994 28.6257H25.4993C16.6605 28.6257 12.241 28.6257 9.49516 31.3716C6.75 34.1169 6.75 38.5331 6.75 47.3675V47.3744V50.4994C6.75 59.3381 6.75 63.7575 9.49587 66.5034C12.2417 69.2494 16.6612 69.2494 25.5 69.2494H50.5C59.3387 69.2494 63.7581 69.2494 66.5041 66.5034C69.25 63.7575 69.25 59.3381 69.25 50.4994Z"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M38 49.7188C39.2944 49.7188 40.3438 48.6694 40.3438 47.375V13.0858L45.5956 19.2128C46.4378 20.1956 47.9175 20.3094 48.9003 19.467C49.8831 18.6246 49.9969 17.145 49.1547 16.1622L39.7797 5.22472C39.3344 4.70522 38.6844 4.40625 38 4.40625C37.3159 4.40625 36.6659 4.70522 36.2206 5.22472L26.8455 16.1622C26.0031 17.145 26.117 18.6246 27.0998 19.467C28.0825 20.3094 29.5622 20.1956 30.4046 19.2128L35.6563 13.0858V47.375C35.6563 48.6694 36.7056 49.7188 38 49.7188Z"/>
                    </svg>
                    {imageFile && <img id="upload__image" src={imagePreview} alt="Uploaded file preview" />}
                    {description}
                </div>
            </div>
            {uploadState === 'ready' && <Button id="upload__button" text="Upload and process image" active onClick={handleTranslationRequest} />}
            <ToastContainer
                position="bottom-center"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
                transition={Slide}
            />
        </div>
    );
}

export default Upload;
