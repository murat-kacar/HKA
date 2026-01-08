import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import getCroppedImg from '@/app/lib/cropUtils';

interface ImageCropperProps {
    imageSrc: string;
    onCancel: () => void;
    onCropComplete: (croppedBlob: Blob) => void;
    aspect?: number; // Default 16/9
}

export default function ImageCropper({ imageSrc, onCancel, onCropComplete, aspect = 16 / 9 }: ImageCropperProps) {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const onCropChange = (crop: { x: number; y: number }) => {
        setCrop(crop);
    };

    const onZoomChange = (zoom: number) => {
        setZoom(zoom);
    };

    const onCropCompleteHandler = useCallback((croppedArea: any, croppedAreaPixels: any) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleSave = async () => {
        if (!croppedAreaPixels) return;
        setIsProcessing(true);
        try {
            const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
            if (croppedImage) {
                onCropComplete(croppedImage);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[9999] bg-black/90 flex flex-col items-center justify-center p-4">
            <div className="relative w-full max-w-4xl h-[60vh] bg-neutral-900 rounded-lg overflow-hidden border border-white/10 shadow-2xl">
                <Cropper
                    image={imageSrc}
                    crop={crop}
                    zoom={zoom}
                    aspect={aspect}
                    onCropChange={onCropChange}
                    onCropComplete={onCropCompleteHandler}
                    onZoomChange={onZoomChange}
                    objectFit="vertical-cover" // Ensures image covers the crop area vertically initially
                />
            </div>

            <div className="w-full max-w-md mt-6 flex flex-col gap-4">
                <div className="flex items-center gap-4">
                    <span className="text-white text-sm font-medium">Zoom</span>
                    <input
                        type="range"
                        value={zoom}
                        min={1}
                        max={3}
                        step={0.1}
                        aria-labelledby="Zoom"
                        onChange={(e) => setZoom(Number(e.target.value))}
                        className="w-full h-2 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-gold-500"
                    />
                </div>

                <div className="flex gap-4 justify-end mt-2">
                    <button
                        onClick={onCancel}
                        disabled={isProcessing}
                        className="px-6 py-2 rounded-lg bg-neutral-800 text-white hover:bg-neutral-700 transition-colors border border-white/10"
                    >
                        İptal
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isProcessing}
                        className="px-6 py-2 rounded-lg bg-gold-500 text-black font-bold hover:bg-gold-400 transition-colors shadow-[0_0_15px_rgba(234,179,8,0.3)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {isProcessing ? (
                            <>
                                <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                                Kırpılıyor...
                            </>
                        ) : (
                            'Kırp ve Kullan'
                        )}
                    </button>
                </div>
            </div>

            <div className="absolute top-4 right-4 text-white/50 text-xs text-center pointer-events-none">
                Fare tekerleği veya dokunarak yakınlaştırabilirsiniz.
            </div>
        </div>
    );
}
