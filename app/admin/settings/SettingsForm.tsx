'use client';

import { useActionState, useState } from 'react';
import { updateSettingsAction } from './actions';
import Editor from '@/app/components/Editor';
import MediaUpload from '@/app/components/MediaUpload';

interface SettingsFormProps {
    initialData: any;
}

export default function SettingsForm({ initialData }: SettingsFormProps) {
    const [state, action, isPending] = useActionState(updateSettingsAction as any, { message: '', error: '' } as any);
    const [activeTab, setActiveTab] = useState<'general' | 'homepage' | 'seo' | 'integrations' | 'compliance' | 'social'>('general');

    // Local state for editors
    const [aboutText, setAboutText] = useState(initialData?.aboutText || '');
    const [privacyPolicy, setPrivacyPolicy] = useState(initialData?.privacyPolicy || '');
    const [cookiePolicy, setCookiePolicy] = useState(initialData?.cookiePolicy || '');

    // Local state for Hero Media (to sync with hidden input)
    const [heroMediaUrl, setHeroMediaUrl] = useState(initialData?.heroMediaUrl || '');

    const tabs = [
        { id: 'general', label: 'General Content' },
        { id: 'homepage', label: 'Homepage Hero' },
        { id: 'seo', label: 'SEO Settings' },
        { id: 'integrations', label: 'Tracking & Ads' },
        { id: 'compliance', label: 'Compliance (KVKK)' },
        { id: 'social', label: 'Social Media' },
    ];

    return (
        <form action={action} className="max-w-5xl mx-auto">

            {/* Tabs Header */}
            <div className="flex items-center gap-1 bg-zinc-900 p-1 rounded-xl mb-8 border border-zinc-800 overflow-x-auto">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`
                            flex-1 py-2.5 px-4 text-sm font-medium rounded-lg transition-all whitespace-nowrap
                            ${activeTab === tab.id
                                ? 'bg-zinc-800 text-white shadow-sm'
                                : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50'}
                        `}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Status Messages */}
            {state?.message && (
                <div className="p-4 mb-6 bg-green-500/10 text-green-500 rounded-lg border border-green-500/20 text-center font-medium">
                    {state.message}
                </div>
            )}
            {state?.error && (
                <div className="p-4 mb-6 bg-red-500/10 text-red-500 rounded-lg border border-red-500/20 text-center font-medium">
                    {state.error}
                </div>
            )}

            {/* Content Sections */}
            <div className="bg-zinc-900/30 border border-zinc-800 rounded-2xl p-8">

                {/* 1. GENERAL CONTENT */}
                <div className={activeTab === 'general' ? 'block' : 'hidden'}>
                    <div className="space-y-8">
                        <section className="space-y-4">
                            <h3 className="text-xl font-semibold text-zinc-100">About Us Content</h3>
                            <input type="hidden" name="aboutText" value={aboutText} />
                            <Editor value={aboutText} onChange={setAboutText} />
                        </section>

                        <section className="space-y-4">
                            <h3 className="text-xl font-semibold text-zinc-100">Contact Information</h3>
                            <textarea
                                name="contactInfo"
                                defaultValue={initialData?.contactInfo || ''}
                                className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-4 min-h-[120px] focus:outline-none focus:ring-1 focus:ring-zinc-500"
                                placeholder="Address, Phone, Email (supports plain text)"
                            />
                        </section>

                        <section className="space-y-4 pt-6 border-t border-zinc-800">
                            <h3 className="text-xl font-semibold text-zinc-100">Location & Maps</h3>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-zinc-400">Google Maps Embed Code (Iframe src)</label>
                                    <input
                                        name="mapsEmbedUrl"
                                        defaultValue={initialData?.mapsEmbedUrl || ''}
                                        className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-3 font-mono text-sm"
                                        placeholder="https://www.google.com/maps/embed?pb=..."
                                    />
                                    <p className="text-xs text-zinc-600">Paste only the 'src' attribute from the Google Maps embed code.</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-zinc-400">Google Maps Link</label>
                                        <input
                                            name="mapsGoogleUrl"
                                            defaultValue={initialData?.mapsGoogleUrl || ''}
                                            className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-3 text-sm"
                                            placeholder="https://goo.gl/maps/..."
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-zinc-400">Apple Maps Link</label>
                                        <input
                                            name="mapsAppleUrl"
                                            defaultValue={initialData?.mapsAppleUrl || ''}
                                            className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-3 text-sm"
                                            placeholder="http://maps.apple.com/..."
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-zinc-400">Yandex Maps Link</label>
                                        <input
                                            name="mapsYandexUrl"
                                            defaultValue={initialData?.mapsYandexUrl || ''}
                                            className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-3 text-sm"
                                            placeholder="https://yandex.com/maps/..."
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-zinc-400">Bing Maps Link</label>
                                        <input
                                            name="mapsBingUrl"
                                            defaultValue={initialData?.mapsBingUrl || ''}
                                            className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-3 text-sm"
                                            placeholder="https://bing.com/maps/..."
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className="space-y-4">
                            <h3 className="text-xl font-semibold text-zinc-100">Privacy Policy (KVKK)</h3>
                            <input type="hidden" name="privacyPolicy" value={privacyPolicy} />
                            <Editor value={privacyPolicy} onChange={setPrivacyPolicy} />
                        </section>
                    </div>
                </div>

                {/* 2. HOMEPAGE HERO */}
                <div className={activeTab === 'homepage' ? 'block' : 'hidden'}>
                    <div className="space-y-8 max-w-3xl">
                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold text-zinc-100">Hero Content</h3>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-400">Main Headline</label>
                                <input
                                    name="heroTitle"
                                    defaultValue={initialData?.heroTitle || 'SAHNE SENİN.'}
                                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-3 text-xl font-bold"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-400">Subtitle</label>
                                <textarea
                                    name="heroSubtitle"
                                    defaultValue={initialData?.heroSubtitle || 'Hakan Karsak Akademi ile oyunculuk yeteneğinizi keşfedin.'}
                                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-3 min-h-[80px]"
                                />
                            </div>
                        </div>

                        <div className="space-y-4 pt-6 border-t border-zinc-800">
                            <h3 className="text-xl font-semibold text-zinc-100">Background Media</h3>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-zinc-400">Media Type</label>
                                    <select
                                        name="heroMediaType"
                                        defaultValue={initialData?.heroMediaType || 'image'}
                                        className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-3"
                                    >
                                        <option value="image">Background Image</option>
                                        <option value="video">Background Video (MP4)</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-zinc-400">Upload Media</label>
                                    <input type="hidden" name="heroMediaUrl" value={heroMediaUrl} />
                                    <MediaUpload
                                        label="Upload Hero Media"
                                        onUploadComplete={setHeroMediaUrl}
                                        accept="image/jpeg, image/png, image/webp, video/mp4"
                                    />
                                    {heroMediaUrl && (
                                        <div className="mt-4 p-4 bg-zinc-950 rounded-lg border border-zinc-800">
                                            <p className="text-xs text-green-500 mb-2">Media Selected:</p>
                                            <p className="text-xs font-mono text-zinc-400 break-all">{heroMediaUrl}</p>

                                            {/* Preview if image */}
                                            {(!initialData?.heroMediaType || initialData?.heroMediaType === 'image') && (
                                                <img src={heroMediaUrl} alt="Hero Preview" className="mt-2 h-32 w-auto rounded object-cover" />
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. SEO SETTINGS */}
                <div className={activeTab === 'seo' ? 'block' : 'hidden'}>
                    <div className="space-y-6 max-w-3xl">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-400">Default SEO Title</label>
                            <input
                                name="seoTitle"
                                defaultValue={initialData?.seoTitle || 'Hakan Karsak Akademi'}
                                className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-3 focus:outline-none focus:border-zinc-500"
                                placeholder="e.g. Hakan Karsak Akademi | Oyunculuk Eğitimi"
                            />
                            <p className="text-xs text-zinc-600">The main title that appears on Google results.</p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-400">SEO Meta Description</label>
                            <textarea
                                name="seoDescription"
                                defaultValue={initialData?.seoDescription || ''}
                                className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-3 min-h-[100px] focus:outline-none focus:border-zinc-500"
                                placeholder="A brief summary of the site content for search engines..."
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-400">Meta Keywords</label>
                            <input
                                name="seoKeywords"
                                defaultValue={initialData?.seoKeywords || ''}
                                className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-3 focus:outline-none focus:border-zinc-500"
                                placeholder="Acting, Theater, Workshop, Education (comma separated)"
                            />
                        </div>

                        <div className="space-y-2 pt-4 border-t border-zinc-800">
                            <h4 className="text-sm font-bold text-zinc-300">Site Verification Tags</h4>
                            <div className="grid grid-cols-1 gap-4 mt-2">
                                <input
                                    name="googleSiteVerification"
                                    defaultValue={initialData?.googleSiteVerification || ''}
                                    placeholder="Google Search Console verification (content value)"
                                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-3 text-sm"
                                />
                                <input
                                    name="yandexSiteVerification"
                                    defaultValue={initialData?.yandexSiteVerification || ''}
                                    placeholder="Yandex Webmaster verification"
                                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-3 text-sm"
                                />
                                <input
                                    name="metaSiteVerification"
                                    defaultValue={initialData?.metaSiteVerification || ''}
                                    placeholder="Facebook Domain Verification"
                                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-3 text-sm"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* 4. INTEGRATIONS */}
                <div className={activeTab === 'integrations' ? 'block' : 'hidden'}>
                    <div className="space-y-8">
                        <div>
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <span className="w-2 h-6 bg-blue-500 rounded-full"></span>
                                Google Services
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm text-zinc-400">Google Analytics 4 (Measurement ID)</label>
                                    <input
                                        name="googleAnalyticsId"
                                        defaultValue={initialData?.googleAnalyticsId || ''}
                                        placeholder="G-XXXXXXXXXX"
                                        className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-3 font-mono text-sm"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-zinc-400">Google Tag Manager (Container ID)</label>
                                    <input
                                        name="googleTagManagerId"
                                        defaultValue={initialData?.googleTagManagerId || ''}
                                        placeholder="GTM-XXXXXXX"
                                        className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-3 font-mono text-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <span className="w-2 h-6 bg-blue-700 rounded-full"></span>
                                Meta (Facebook/Instagram)
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm text-zinc-400">Meta Pixel ID</label>
                                    <input
                                        name="metaPixelId"
                                        defaultValue={initialData?.metaPixelId || ''}
                                        placeholder="123456789012345"
                                        className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-3 font-mono text-sm"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-zinc-400">Domain Doğrulama (Verification)</label>
                                    <input
                                        name="metaSiteVerification"
                                        defaultValue={initialData?.metaSiteVerification || ''}
                                        placeholder="facebook-domain-verification"
                                        className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-3 font-mono text-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <span className="w-2 h-6 bg-sky-500 rounded-full"></span>
                                Microsoft (Bing)
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm text-zinc-400">Microsoft Clarity ID</label>
                                    <input
                                        name="microsoftClarityId"
                                        defaultValue={initialData?.microsoftClarityId || ''}
                                        placeholder="XXXXXXXX"
                                        className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-3 font-mono text-sm"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-zinc-400">Bing Webmaster Tools (Doğrulama)</label>
                                    <input
                                        name="bingSiteVerification"
                                        defaultValue={initialData?.bingSiteVerification || ''}
                                        placeholder="Meta etiketi içeriği"
                                        className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-3 font-mono text-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <span className="w-2 h-6 bg-red-600 rounded-full"></span>
                                Yandex
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm text-zinc-400">Yandex Metrica ID</label>
                                    <input
                                        name="yandexMetricaId"
                                        defaultValue={initialData?.yandexMetricaId || ''}
                                        placeholder="XXXXXXXX"
                                        className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-3 font-mono text-sm"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 5. COMPLIANCE (KVKK) */}
                <div className={activeTab === 'compliance' ? 'block' : 'hidden'}>
                    <div className="space-y-8">
                        <div className="bg-blue-500/10 border border-blue-500/20 p-6 rounded-xl">
                            <h4 className="text-lg font-bold text-blue-400 mb-2">Bilgilendirme</h4>
                            <p className="text-sm text-zinc-400">
                                Bu içerik <strong>/cerez-politikasi</strong> sayfasında görünecektir.
                                Web sitesindeki çerez uyarı banner'ı bu sayfaya yönlendirecektir.
                            </p>
                        </div>
                        <section className="space-y-4">
                            <h3 className="text-xl font-semibold text-zinc-100">Çerez Politikası ve Aydınlatma Metni</h3>
                            <input type="hidden" name="cookiePolicy" value={cookiePolicy} />
                            <Editor value={cookiePolicy} onChange={setCookiePolicy} />
                        </section>
                    </div>
                </div>

                {/* 6. SOCIAL MEDIA */}
                <div className={activeTab === 'social' ? 'block' : 'hidden'}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                            { name: 'instagram', label: 'Instagram URL' },
                            { name: 'twitter', label: 'X (Twitter) URL' },
                            { name: 'facebook', label: 'Facebook URL' },
                            { name: 'linkedin', label: 'LinkedIn URL' },
                            { name: 'youtube', label: 'YouTube URL' },
                        ].map(social => (
                            <div key={social.name} className="space-y-2">
                                <label className="text-sm text-zinc-400">{social.label}</label>
                                <input
                                    name={social.name}
                                    defaultValue={initialData?.socialLinks?.[social.name] || ''}
                                    placeholder={`https://${social.name}.com/...`}
                                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-3 text-sm"
                                />
                            </div>
                        ))}
                    </div>
                </div>

            </div>

            <div className="mt-8 flex justify-end sticky bottom-8">
                <button
                    type="submit"
                    disabled={isPending}
                    className="bg-white text-black px-10 py-4 rounded-xl font-bold hover:bg-zinc-200 transition-colors disabled:opacity-50 shadow-lg shadow-white/10"
                >
                    {isPending ? 'Değişiklikler Uygulanıyor...' : 'Tüm Ayarları Kaydet'}
                </button>
            </div>
        </form>
    );
}
