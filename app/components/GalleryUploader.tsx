'use client';

import { useState, useRef } from 'react';
import { uploadFileAction } from '@/app/actions/upload';

interface GalleryUploaderProps {
    initialUrls?: string[];
    onChange: (urls: string[]) => void;
}

export default function GalleryUploader({ initialUrls = [], onChange }: GalleryUploaderProps) {
    const [urls, setUrls] = useState<string[]>(initialUrls);
    const [isUploading, setIsUploading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return;

        setIsUploading(true);
        const files = Array.from(e.target.files);
        const newUrls: string[] = [];

        // Upload sequentially to avoid overwhelming server limits (or could use Promise.all for parallel)
        // Using simple loop for reliability
        for (const file of files) {
            if (!file.type.startsWith('image/')) continue;

            const formData = new FormData();
            formData.append('file', file);

            try {
                const result = await uploadFileAction(formData);
                if (result.url) {
                    newUrls.push(result.url);
                }
            } catch (err) {
                console.error('Gallery upload failed for file', file.name, err);
            }
        }

        const updatedUrls = [...urls, ...newUrls];
        setUrls(updatedUrls);
        onChange(updatedUrls);
        setIsUploading(false);

        // Reset input
        if (inputRef.current) inputRef.current.value = '';
    };

    const removeImage = (indexToRemove: number) => {
        const updatedUrls = urls.filter((_, index) => index !== indexToRemove);
        setUrls(updatedUrls);
        onChange(updatedUrls);
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap gap-4">
                {/* Upload Button Block */}
                <div
                    onClick={() => !isUploading && inputRef.current?.click()}
                    className={`
                w-32 h-32 rounded-lg border-2 border-dashed border-zinc-700 
                flex flex-col items-center justify-center cursor-pointer 
                hover:border-zinc-500 hover:bg-zinc-900 transition-all
                ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
            `}
                >
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        ref={inputRef}
                        onChange={handleFiles}
                        disabled={isUploading}
                    />
                    {isUploading ? (
                        <div className="animate-spin w-6 h-6 border-2 border-zinc-500 border-t-white rounded-full"></div>
                    ) : (
                        <>
                            <span className="text-2xl text-zinc-400">+</span>
                            <span className="text-xs text-zinc-500 mt-1">Add Photos</span>
                        </>
                    )}
                </div>

                {/* Image Grid */}
                {urls.map((url, index) => (
                    <div key={index} className="relative w-32 h-32 rounded-lg overflow-hidden group border border-zinc-800 bg-black">
                        {/* Simple img tag for simplicity within admin */}
                        <img src={url} alt="Gallery" className="w-full h-full object-cover" />

                        {/* Delete Overlay */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="p-1 px-3 bg-red-600 text-white rounded-full text-xs font-bold hover:bg-red-500"
                            >
                                Remove
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            <p className="text-xs text-zinc-500">
                Allowed formats: JPG, PNG, WebP. Multiple selection supported.
            </p>
        </div>
    );
}
