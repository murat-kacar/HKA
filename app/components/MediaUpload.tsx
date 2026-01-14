'use client';

import { useState, useRef } from 'react';
import { uploadFileAction } from '@/app/actions/upload';
import ImageCropper from './ImageCropper';

interface MediaUploadProps {
    label: string;
    onUploadComplete: (url: string) => void;
    defaultValue?: string;
    accept?: string; // e.g. "image/*,video/*"
    aspectRatio?: number; // Added for cropping
}

export default function MediaUpload({
    label,
    onUploadComplete,
    defaultValue = '',
    accept = 'image/*',
    aspectRatio = 16 / 9
}: MediaUploadProps) {
    const [preview, setPreview] = useState(defaultValue);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    // Cropper State
    const [cropperSrc, setCropperSrc] = useState<string | null>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Reset
        setError('');

        // If Image -> Open Cropper
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.addEventListener('load', () => {
                setCropperSrc(reader.result?.toString() || null);
            });
            reader.readAsDataURL(file);
            // Reset input so same file can be selected again if cancelled
            e.target.value = '';
        }
        // If Video -> Upload Directly
        else {
            startUpload(file);
        }
    };

    const handleCropComplete = (croppedBlob: Blob) => {
        const file = new File([croppedBlob], "cropped-image.webp", { type: "image/webp" });
        setCropperSrc(null); // Close modal
        startUpload(file);
    };

    const startUpload = async (file: File) => {
        setIsUploading(true);

        // Immediate preview
        if (file.type.startsWith('image/')) {
            setPreview(URL.createObjectURL(file));
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const result = await uploadFileAction(formData);

            if (result.error) {
                setError(result.error);
                setPreview(defaultValue);
            } else if (result.url) {
                setPreview(result.url);
                onUploadComplete(result.url);
            }
        } catch (err) {
            console.error('Upload error:', err);
            setError('Upload failed unexpectedly.');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-zinc-400">{label}</label>

            <div
                className="relative group cursor-pointer border-2 border-dashed border-zinc-700 hover:border-zinc-500 rounded-lg overflow-hidden transition-colors bg-zinc-900 min-h-[200px] flex items-center justify-center"
                onClick={() => inputRef.current?.click()}
            >
                <input
                    type="file"
                    ref={inputRef}
                    onChange={handleFileChange}
                    accept={accept}
                    className="hidden"
                />

                {isUploading && (
                    <div className="absolute inset-0 bg-black/50 z-10 flex items-center justify-center">
                        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                    </div>
                )}

                {preview ? (
                    accept.includes('video') && preview.endsWith('.mp4') ? (
                        <video src={preview} controls className="max-h-[300px] w-auto" />
                    ) : (
                        <div className="relative w-full h-full min-h-[200px]">
                            <img
                                src={preview}
                                alt="Preview"
                                className="w-full h-full object-contain max-h-[300px]"
                            />
                        </div>
                    )
                ) : (
                    <div className="text-center p-6 text-zinc-500">
                        <p>Click to upload</p>
                        <p className="text-xs mt-1 opacity-70">JPG, PNG, MP4</p>
                    </div>
                )}

                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none" />
            </div>

            {error && (
                <p className="text-sm text-red-500">{error}</p>
            )}

            {/* CROPPER MODAL */}
            {cropperSrc && (
                <ImageCropper
                    imageSrc={cropperSrc}
                    aspect={aspectRatio}
                    onCancel={() => setCropperSrc(null)}
                    onCropComplete={handleCropComplete}
                />
            )}
        </div>
    );
}
