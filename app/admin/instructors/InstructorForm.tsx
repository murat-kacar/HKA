'use client';

import { useActionState, useState } from 'react';
import { createInstructorAction } from './actions';
import Editor from '@/app/components/Editor';
import MediaUpload from '@/app/components/MediaUpload';
import Link from 'next/link';

export default function InstructorForm() {
    const [state, action, isPending] = useActionState(createInstructorAction as any, { error: '' } as any);
    const [bio, setBio] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');
    const [videoUrl, setVideoUrl] = useState('');

    // Slug Management
    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');
    const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);

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
            .replace(/[^\w\s-]/g, '') // Remove non-word chars
            .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
            .replace(/^-+|-+$/g, ''); // Trim hyphens
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newName = e.target.value;
        setName(newName);
        if (!isSlugManuallyEdited) {
            setSlug(generateSlug(newName));
        }
    };

    const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSlug(e.target.value);
        setIsSlugManuallyEdited(true);
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold">Yeni Eğitmen</h1>
                <Link href="/admin/instructors" className="text-sm text-zinc-400 hover:text-white">
                    İptal
                </Link>
            </div>

            <form action={action} className="space-y-8 bg-zinc-900/30 p-8 rounded-2xl border border-zinc-800">
                {state?.error && (
                    <div className="p-4 bg-red-500/10 text-red-500 rounded-lg border border-red-500/20 text-center">
                        {state.error}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-300">Ad Soyad</label>
                            <input
                                name="name"
                                value={name}
                                onChange={handleNameChange}
                                required
                                className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-3 focus:ring-2 focus:ring-white/20 outline-none transition-all"
                                placeholder="Örn. Hakan Karsak"
                            />
                        </div>

                        {/* URL Slug Field */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-300 flex items-center justify-between">
                                <span>URL Bağlantısı (Slug)</span>
                                <span className="text-xs text-zinc-500 font-mono">hakankarsakakademi.com/egitmenler/</span>
                            </label>
                            <input
                                name="slug"
                                value={slug}
                                onChange={handleSlugChange}
                                required
                                className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-3 font-mono text-sm text-yellow-500 focus:ring-2 focus:ring-yellow-500/20 outline-none transition-all"
                                placeholder="hakan-karsak"
                            />
                            <p className="text-xs text-zinc-500">
                                Bu, eğitmenin sayfa URL'si olacaktır. Gerekirse manuel olarak düzenleyebilirsiniz.
                            </p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-300">Rol / Ünvan</label>
                            <input
                                name="role"
                                required
                                className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-3 focus:ring-2 focus:ring-white/20 outline-none transition-all"
                                placeholder="Örn. Oyunculuk Koçu"
                            />
                        </div>
                    </div>

                    <div>
                        <input type="hidden" name="avatarUrl" value={avatarUrl} />
                        <MediaUpload
                            label="Profil Fotoğrafı"
                            onUploadComplete={setAvatarUrl}
                            accept="image/jpeg, image/png, image/webp"
                            aspectRatio={3 / 4} // Vertical crop (Vesikalık)
                        // If you need folder prop: folder="instructors"
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <h2 className="text-xl font-bold">Tanıtım Videosu</h2>
                    <input type="hidden" name="videoUrl" value={videoUrl} />
                    <MediaUpload
                        label="Video Yükle (Opsiyonel)"
                        onUploadComplete={setVideoUrl}
                        accept="video/mp4, video/webm"
                        defaultValue=""
                    />
                    <p className="text-xs text-zinc-500">
                        Maksimum 100MB. Otomatik olarak optimize edilecektir (1280px genişlik).
                    </p>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-300">Biyografi</label>
                    <input type="hidden" name="bio" value={bio} />
                    <Editor value={bio} onChange={setBio} className="min-h-[300px]" />
                </div>

                <div className="pt-4 flex justify-end">
                    <button
                        type="submit"
                        disabled={isPending}
                        className="bg-white text-black px-8 py-3 rounded-lg font-bold hover:bg-zinc-200 transition-colors disabled:opacity-50"
                    >
                        {isPending ? 'Oluşturuluyor...' : 'Eğitmen Oluştur'}
                    </button>
                </div>
            </form>
        </div>
    );
}
