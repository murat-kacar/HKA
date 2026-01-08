'use client';

import { useActionState, useState } from 'react';
import { createEventAction, updateEventAction } from './actions';
import Editor from '@/app/components/Editor';
import MediaUpload from '@/app/components/MediaUpload';
import GalleryUploader from '@/app/components/GalleryUploader';
import Link from 'next/link';

interface EventFormProps {
    initialData?: any;
}

export default function EventForm({ initialData }: EventFormProps) {
    // Bind ID to update action if initialData exists
    const baseAction = initialData ? updateEventAction.bind(null, initialData.id) : createEventAction;
    const [state, action, isPending] = useActionState(baseAction as any, { error: '' } as any);

    const [description, setDescription] = useState(initialData?.description || '');
    const [coverImage, setCoverImage] = useState(initialData?.coverImage || '');
    const [videoUrl, setVideoUrl] = useState(initialData?.videoUrl || ''); // Video State
    const [galleryUrls, setGalleryUrls] = useState<string[]>(
        initialData?.gallery?.map((g: any) => g.url) || []
    );

    // Slug Management
    const [title, setTitle] = useState(initialData?.title || '');
    const [slug, setSlug] = useState(initialData?.slug || '');
    const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(!!initialData?.slug);

    const generateSlug = (text: string) => {
        const trMap: Record<string, string> = {
            'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u',
            'Ç': 'C', 'Ğ': 'G', 'İ': 'I', 'Ö': 'O', 'Ş': 'S', 'Ü': 'U'
        };

        return text
            .split('')
            .map(char => trMap[char] || char)
            .join('')
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTitle = e.target.value;
        setTitle(newTitle);
        if (!isSlugManuallyEdited) {
            setSlug(generateSlug(newTitle));
        }
    };

    const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSlug(e.target.value);
        setIsSlugManuallyEdited(true);
    };

    return (
        <div className="max-w-5xl mx-auto pb-12">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold">{initialData ? 'Etkinliği Düzenle' : 'Yeni Etkinlik'}</h1>
                <Link href="/admin/events" className="text-sm text-zinc-400 hover:text-white">İptal</Link>
            </div>

            <form action={action} className="space-y-8 bg-zinc-900/30 p-8 rounded-2xl border border-zinc-800">
                {state?.error && (
                    <div className="p-4 bg-red-500/10 text-red-500 rounded-lg text-center">{state.error}</div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-300">Etkinlik Başlığı</label>
                            <input
                                name="title"
                                value={title}
                                onChange={handleTitleChange}
                                required
                                className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-3 focus:ring-2 focus:ring-white/20 outline-none transition-all"
                            />
                        </div>

                        {/* URL Slug Field */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-300 flex items-center justify-between">
                                <span>URL Bağlantısı (Slug)</span>
                                <span className="text-xs text-zinc-500 font-mono">hakankarsakakademi.com/etkinlikler/</span>
                            </label>
                            <input
                                name="slug"
                                value={slug}
                                onChange={handleSlugChange}
                                required
                                className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-3 font-mono text-sm text-yellow-500 focus:ring-2 focus:ring-yellow-500/20 outline-none transition-all"
                                placeholder="romeo-ve-juliet"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-300">Tarih</label>
                                <input
                                    type="date"
                                    name="date"
                                    required
                                    defaultValue={initialData?.date ? new Date(initialData.date).toISOString().split('T')[0] : ''}
                                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-3 outline-none text-zinc-300"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-300">Tür</label>
                                <select
                                    name="type"
                                    defaultValue={initialData?.type}
                                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-3 outline-none text-zinc-300"
                                >
                                    <option value="THEATER">Tiyatro</option>
                                    <option value="CINEMA">Sinema</option>
                                    <option value="OTHER">Diğer</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3 p-4 bg-zinc-950 border border-zinc-800 rounded-lg">
                            <input
                                type="checkbox"
                                name="isFeatured"
                                defaultChecked={initialData?.isFeatured}
                                className="w-5 h-5 accent-white"
                            />
                            <span className="text-sm text-zinc-300">Bu etkinliği ana sayfada öne çıkar</span>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <input type="hidden" name="coverImage" value={coverImage} />
                            <MediaUpload
                                label="Kapak Resmi"
                                onUploadComplete={setCoverImage}
                                defaultValue={coverImage}
                                accept="image/jpeg, image/png, image/webp"
                            />
                        </div>

                        <div className="space-y-2 pt-6 border-t border-zinc-700">
                            <input type="hidden" name="videoUrl" value={videoUrl} />
                            <MediaUpload
                                label="Etkinlik Videosu (Opsiyonel)"
                                onUploadComplete={setVideoUrl}
                                defaultValue={videoUrl}
                                accept="video/mp4, video/webm"
                            />
                            <p className="text-xs text-zinc-500">
                                Etkinliği tanıtır. Maksimum 100MB.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-300">Açıklama / Detaylar</label>
                    <input type="hidden" name="description" value={description} />
                    <Editor value={description} onChange={setDescription} className="min-h-[300px]" />
                </div>

                <div className="space-y-2 pt-4 border-t border-zinc-800">
                    <label className="text-lg font-medium text-zinc-300 block mb-4">Etkinlik Galerisi</label>
                    <input type="hidden" name="galleryUrls" value={JSON.stringify(galleryUrls)} />
                    <GalleryUploader initialUrls={galleryUrls} onChange={setGalleryUrls} />
                </div>

                <div className="pt-6 flex justify-end gap-4">
                    <button disabled={isPending} type="submit" className="bg-white text-black px-8 py-3 rounded-lg font-bold hover:bg-zinc-200 transition-colors disabled:opacity-50">
                        {isPending ? 'Kaydediliyor...' : (initialData ? 'Etkinliği Güncelle' : 'Etkinlik Oluştur')}
                    </button>
                </div>
            </form>
        </div >
    );
}
