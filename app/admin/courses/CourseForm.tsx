'use client';

import { useActionState, useState } from 'react';
import { createCourseAction, updateCourseAction } from './actions';
import Editor from '@/app/components/Editor';
import MediaUpload from '@/app/components/MediaUpload';
import InstructorSelector from '@/app/components/InstructorSelector';
import CurriculumBuilder from '@/app/components/CurriculumBuilder';
import Link from 'next/link';

interface CourseFormProps {
    allInstructors: any[];
    initialData?: any;
}

export default function CourseForm({ allInstructors, initialData }: CourseFormProps) {
    const baseAction = initialData ? updateCourseAction.bind(null, initialData.id) : createCourseAction;
    const [state, action, isPending] = useActionState(baseAction as any, { error: '' } as any);

    // States
    const [description, setDescription] = useState(initialData?.description || '');
    const [coverImage, setCoverImage] = useState(initialData?.coverImage || '');
    const [videoUrl, setVideoUrl] = useState(initialData?.videoUrl || '');
    const [selectedInstructorIds, setSelectedInstructorIds] = useState<string[]>(
        initialData?.instructors?.map((i: any) => i.id) || []
    );
    const [curriculum, setCurriculum] = useState<any[]>(
        Array.isArray(initialData?.curriculum) ? initialData.curriculum : []
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
                <h1 className="text-2xl font-bold">{initialData ? 'Eğitimi Düzenle' : 'Yeni Eğitim'}</h1>
                <Link href="/admin/courses" className="text-sm text-zinc-400 hover:text-white">İptal</Link>
            </div>

            <form action={action} className="space-y-8 bg-zinc-900/30 p-8 rounded-2xl border border-zinc-800">
                {state?.error && (
                    <div className="p-4 bg-red-500/10 text-red-500 rounded-lg text-center">{state.error}</div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-300">Eğitim Başlığı</label>
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
                                <span className="text-xs text-zinc-500 font-mono">hakankarsakakademi.com/egitimler/</span>
                            </label>
                            <input
                                name="slug"
                                value={slug}
                                onChange={handleSlugChange}
                                required
                                className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-3 font-mono text-sm text-yellow-500 focus:ring-2 focus:ring-yellow-500/20 outline-none transition-all"
                                placeholder="temel-oyunculuk-egitimi"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-300">Kısa Özet</label>
                            <textarea
                                name="summary"
                                required
                                defaultValue={initialData?.summary}
                                className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-3 outline-none min-h-[80px]"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-300">Süre (Görünen Metin)</label>
                            <input
                                name="duration"
                                required
                                defaultValue={initialData?.duration}
                                placeholder="Örn. 12 Hafta, 3 Ay"
                                className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-3 outline-none"
                            />
                            <p className="text-xs text-zinc-500">
                                Bu alan kullanıcılara gösterilir. İstediğiniz formatı kullanabilirsiniz (örn. "8 Hafta", "2 Ay", "10 Hafta Sonu").
                            </p>
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
                                label="Tanıtım Videosu (Opsiyonel)"
                                onUploadComplete={setVideoUrl}
                                defaultValue={videoUrl}
                                accept="video/mp4, video/webm"
                            />
                            <p className="text-xs text-zinc-500">
                                Eğitimi tanıtır. Maksimum 100MB.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-300">Açıklama / Genel Bakış</label>
                    <input type="hidden" name="description" value={description} />
                    <Editor value={description} onChange={setDescription} className="min-h-[300px]" />
                </div>

                <div className="space-y-2">
                    <label className="text-lg font-medium text-zinc-300 block mb-4">Müfredat</label>
                    <input type="hidden" name="curriculum" value={JSON.stringify(curriculum)} />
                    <CurriculumBuilder value={curriculum} onChange={setCurriculum} />
                </div>

                <div className="space-y-2 pt-4 border-t border-zinc-800">
                    <label className="text-lg font-medium text-zinc-300 block mb-4">Atanmış Eğitmenler</label>
                    <input type="hidden" name="instructorIds" value={JSON.stringify(selectedInstructorIds)} />
                    <InstructorSelector
                        instructors={allInstructors}
                        selectedIds={selectedInstructorIds}
                        onChange={setSelectedInstructorIds}
                    />
                </div>

                <div className="pt-6 flex justify-end gap-4">
                    <button disabled={isPending} type="submit" className="bg-white text-black px-8 py-3 rounded-lg font-bold hover:bg-zinc-200 transition-colors disabled:opacity-50">
                        {isPending ? 'Kaydediliyor...' : (initialData ? 'Eğitimi Güncelle' : 'Eğitim Oluştur')}
                    </button>
                </div>
            </form>
        </div>
    );
}
