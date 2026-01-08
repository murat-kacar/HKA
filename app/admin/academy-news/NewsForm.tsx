'use client';

import { useActionState, useState } from 'react';
import { createNewsAction, updateNewsAction } from './actions';
import Editor from '@/app/components/Editor';
import MediaUpload from '@/app/components/MediaUpload';
import Link from 'next/link';

interface NewsFormProps {
    initialData?: any;
}

export default function NewsForm({ initialData }: NewsFormProps) {
    const baseAction = initialData ? updateNewsAction.bind(null, initialData.id) : createNewsAction;
    const [state, action, isPending] = useActionState(baseAction as any, { error: '' } as any);

    // States
    const [content, setContent] = useState(initialData?.content || '');
    const [coverImage, setCoverImage] = useState(initialData?.coverImage || '');
    const [videoUrl, setVideoUrl] = useState(initialData?.videoUrl || '');
    const [isPublished, setIsPublished] = useState(initialData?.isPublished || false);

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
                <h1 className="text-2xl font-bold">{initialData ? 'Haberi Düzenle' : 'Yeni Haber'}</h1>
                <Link href="/admin/academy-news" className="text-sm text-zinc-400 hover:text-white">İptal</Link>
            </div>

            <form action={action} className="space-y-8 bg-zinc-900/30 p-8 rounded-2xl border border-zinc-800">
                {state?.error && (
                    <div className="p-4 bg-red-500/10 text-red-500 rounded-lg text-center">{state.error}</div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-300">Başlık</label>
                            <input
                                name="title"
                                value={title}
                                onChange={handleTitleChange}
                                required
                                className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-3 focus:ring-2 focus:ring-white/20 outline-none transition-all"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-300 flex items-center justify-between">
                                <span>URL Bağlantısı (Slug)</span>
                                <span className="text-xs text-zinc-500 font-mono">hakankarsakakademi.com/akademide-ne-var/</span>
                            </label>
                            <input
                                name="slug"
                                value={slug}
                                onChange={handleSlugChange}
                                required
                                className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-3 font-mono text-sm text-yellow-500 focus:ring-2 focus:ring-yellow-500/20 outline-none transition-all"
                                placeholder="yeni-sahne-projesi"
                            />
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
                                label="Video (Opsiyonel)"
                                onUploadComplete={setVideoUrl}
                                defaultValue={videoUrl}
                                accept="video/mp4, video/webm"
                            />
                            <p className="text-xs text-zinc-500">
                                Habere video ekleyebilirsiniz. Maksimum 100MB.
                            </p>
                        </div>

                        <div className="space-y-2 pt-6 border-t border-zinc-700">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="isPublished"
                                    value="true"
                                    checked={isPublished}
                                    onChange={(e) => setIsPublished(e.target.checked)}
                                    className="w-5 h-5 rounded border-zinc-700 bg-zinc-950"
                                />
                                <span className="text-sm font-medium text-zinc-300">Yayına Al</span>
                            </label>
                            <p className="text-xs text-zinc-500 ml-8">
                                Aktif olduğunda haber sitede görünür olacak
                            </p>
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-300">İçerik</label>
                    <input type="hidden" name="content" value={content} />
                    <Editor value={content} onChange={setContent} className="min-h-[400px]" />
                </div>

                <div className="pt-6 flex justify-end gap-4">
                    <button disabled={isPending} type="submit" className="bg-white text-black px-8 py-3 rounded-lg font-bold hover:bg-zinc-200 transition-colors disabled:opacity-50">
                        {isPending ? 'Kaydediliyor...' : (initialData ? 'Güncelle' : 'Oluştur')}
                    </button>
                </div>
            </form>
        </div>
    );
}
