
'use client';

import { useActionState, useState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { createApplicationAction } from './actions';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Turnstile from 'react-turnstile';
import { useTheme } from '@/app/providers/ThemeProvider';

const initialState = {
    message: '',
    errors: {} as Record<string, string[]>,
    success: false
};

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <button
            type="submit"
            disabled={pending}
            className="w-full bg-black dark:bg-white text-white dark:text-black font-bold text-lg py-4 rounded-xl hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
            {pending ? <Loader2 className="animate-spin" /> : 'Başvuruyu Tamamla'}
        </button>
    );
}

export default function ApplicationForm() {
    const [state, formAction] = useActionState(createApplicationAction, initialState);
    const searchParams = useSearchParams();
    const { theme } = useTheme();

    // Auto-fill interest from URL
    const courseSlug = searchParams.get('course');
    const workshopSlug = searchParams.get('workshop');

    // Tracking Params
    const utmSource = searchParams.get('utm_source') || '';
    const utmMedium = searchParams.get('utm_medium') || '';
    const utmCampaign = searchParams.get('utm_campaign') || '';

    // Referrer (Client-side only)
    const [referrer, setReferrer] = useState('');

    useEffect(() => {
        if (typeof document !== 'undefined') {
            // eslint-disable-next-line
            setReferrer(document.referrer);
        }
    }, []);

    let defaultInterest = '';
    if (courseSlug) defaultInterest = `Kurs: ${courseSlug}`;
    if (workshopSlug) defaultInterest = `Atölye: ${workshopSlug}`;

    if (state?.success) {
        return (
            <div className="bg-green-500/10 border border-green-500/50 rounded-2xl p-8 text-center max-w-lg mx-auto">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white dark:text-black mx-auto mb-6">
                    <CheckCircle size={32} />
                </div>
                <h2 className="text-2xl font-bold text-green-600 dark:text-green-500 mb-4">Başvurunuz Alındı!</h2>
                <p className="text-zinc-600 dark:text-zinc-300 mb-8">
                    Gösterdiğiniz ilgi için teşekkür ederiz. Başvurunuz başarıyla tarafımıza ulaşmıştır. Ekibimiz en kısa sürede sizinle iletişime geçecektir.
                </p>
                <button
                    onClick={() => window.location.href = '/'}
                    className="text-black dark:text-white hover:underline text-sm font-medium"
                >
                    Anasayfaya Dön
                </button>
            </div>
        );
    }

    return (
        <form action={formAction} className="space-y-6 max-w-lg mx-auto">

            {state?.message && !state.success && (
                <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 flex items-start gap-3">
                    <AlertCircle className="text-red-600 dark:text-red-500 flex-shrink-0 mt-0.5" size={20} />
                    <div className="text-sm text-red-800 dark:text-red-200">{state.message}</div>
                </div>
            )}

            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label htmlFor="firstName" className="block text-sm font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">Ad</label>
                    <input
                        type="text"
                        name="firstName"
                        id="firstName"
                        required
                        className="w-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg px-4 py-3 text-black dark:text-white focus:outline-none focus:border-black dark:focus:border-white transition-colors"
                        placeholder="Adınız"
                    />
                    {state?.errors?.firstName && <p className="text-red-500 text-xs">{state.errors.firstName[0]}</p>}
                </div>
                <div className="space-y-2">
                    <label htmlFor="lastName" className="block text-sm font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">Soyad</label>
                    <input
                        type="text"
                        name="lastName"
                        id="lastName"
                        required
                        className="w-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg px-4 py-3 text-black dark:text-white focus:outline-none focus:border-black dark:focus:border-white transition-colors"
                        placeholder="Soyadınız"
                    />
                    {state?.errors?.lastName && <p className="text-red-500 text-xs">{state.errors.lastName[0]}</p>}
                </div>
            </div>

            <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">E-posta</label>
                <input
                    type="email"
                    name="email"
                    id="email"
                    required
                    className="w-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg px-4 py-3 text-black dark:text-white focus:outline-none focus:border-black dark:focus:border-white transition-colors"
                    placeholder="ornek@email.com"
                />
                {state?.errors?.email && <p className="text-red-500 text-xs">{state.errors.email[0]}</p>}
            </div>

            <div className="space-y-2">
                <label htmlFor="phone" className="block text-sm font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">Telefon</label>
                <input
                    type="tel"
                    name="phone"
                    id="phone"
                    required
                    className="w-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg px-4 py-3 text-black dark:text-white focus:outline-none focus:border-black dark:focus:border-white transition-colors"
                    placeholder="0555 123 45 67"
                />
                {state?.errors?.phone && <p className="text-red-500 text-xs">{state.errors.phone[0]}</p>}
            </div>

            {/* Interest - Hidden/Readonly */}
            <div className="space-y-2">
                <label htmlFor="interest" className="block text-sm font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">İlgilenilen Konu</label>
                <input
                    type="text"
                    name="interest"
                    id="interest"
                    defaultValue={defaultInterest}
                    className="w-full bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg px-4 py-3 text-zinc-400 dark:text-zinc-500 focus:outline-none cursor-not-allowed"
                    readOnly
                    placeholder="Genel Başvuru"
                />
            </div>

            {/* Consent */}
            <div className="pt-4">
                <label className="flex items-start gap-3 cursor-pointer group">
                    <input type="checkbox" name="isConsentGiven" className="mt-1 w-4 h-4 rounded border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-black dark:text-white focus:ring-0 checked:bg-green-600 dark:checked:bg-green-500" />
                    <span className="text-sm text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-700 dark:group-hover:text-zinc-300 transition-colors">
                        <Link href="/gizlilik" className="underline hover:text-black dark:hover:text-white">KVKK Aydınlatma Metni</Link>'ni okudum ve kişisel verilerimin işlenmesine onay veriyorum.
                    </span>
                </label>
                {state?.errors?.isConsentGiven && <p className="text-red-500 text-xs mt-2">{state.errors.isConsentGiven[0]}</p>}
            </div>

            <div className="flex justify-center">
                <Turnstile
                    sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ''}
                    theme={theme}
                    language="tr"
                />
            </div>

            {/* Hidden Tracking Fields */}
            <input type="hidden" name="utmSource" value={utmSource} />
            <input type="hidden" name="utmMedium" value={utmMedium} />
            <input type="hidden" name="utmCampaign" value={utmCampaign} />
            <input type="hidden" name="referrer" value={referrer} />

            <SubmitButton />
        </form >
    );
}
