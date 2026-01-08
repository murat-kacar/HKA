'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';

export default function CookieBanner() {
    const [isVisible, setIsVisible] = useState(false);
    const [settingsOpen, setSettingsOpen] = useState(false);

    // Consent State
    const [consent, setConsent] = useState({
        necessary: true, // Always true
        analytics: true,
        marketing: true,
    });

    useEffect(() => {
        const storedConsent = localStorage.getItem('hka-cookie-consent');
        if (!storedConsent) {
            setIsVisible(true);
        } else {
            // Apply existing consent to tracking scripts (if implemented dynamically)
            const parsed = JSON.parse(storedConsent);
            setConsent(parsed);
        }
    }, []);

    const saveConsent = (preferences: typeof consent) => {
        localStorage.setItem('hka-cookie-consent', JSON.stringify(preferences));
        setConsent(preferences);
        setIsVisible(false);
        // Reload to apply scripts or trigger GTM events here
        window.location.reload();
    };

    const acceptAll = () => {
        saveConsent({ necessary: true, analytics: true, marketing: true });
    };

    const rejectAll = () => {
        saveConsent({ necessary: true, analytics: false, marketing: false });
    };

    if (!isVisible) return null;

    if (settingsOpen) {
        return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-white">Çerez Tercihleri</h3>
                        <button onClick={() => setSettingsOpen(false)} className="text-zinc-400 hover:text-white">
                            <X size={24} />
                        </button>
                    </div>

                    <div className="space-y-4 mb-8">
                        <div className="flex items-center justify-between p-4 bg-zinc-950 rounded-lg">
                            <div>
                                <p className="font-bold text-white">Zorunlu Çerezler</p>
                                <p className="text-xs text-zinc-500">Site güvenliği ve temel fonksiyonlar için şarttır.</p>
                            </div>
                            <input type="checkbox" checked disabled className="accent-zinc-500" />
                        </div>

                        <div className="flex items-center justify-between p-4 bg-zinc-950 rounded-lg">
                            <div>
                                <p className="font-bold text-white">Analiz Çerezleri</p>
                                <p className="text-xs text-zinc-500">Ziyaretçi sayılarını ve site trafiğini ölçmemizi sağlar.</p>
                            </div>
                            <input
                                type="checkbox"
                                checked={consent.analytics}
                                onChange={(e) => setConsent({ ...consent, analytics: e.target.checked })}
                                className="accent-blue-500 h-5 w-5"
                            />
                        </div>

                        <div className="flex items-center justify-between p-4 bg-zinc-950 rounded-lg">
                            <div>
                                <p className="font-bold text-white">Pazarlama (Pixel) Çerezleri</p>
                                <p className="text-xs text-zinc-500">İlgi alanlarınıza göre size özel içerikler sunmamızı sağlar.</p>
                            </div>
                            <input
                                type="checkbox"
                                checked={consent.marketing}
                                onChange={(e) => setConsent({ ...consent, marketing: e.target.checked })}
                                className="accent-blue-500 h-5 w-5"
                            />
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button onClick={() => saveConsent(consent)} className="flex-1 bg-white text-black font-bold py-3 rounded-xl hover:bg-zinc-200 transition-colors">
                            Tercihleri Kaydet
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed bottom-0 left-0 right-0 z-[90] bg-zinc-950/90 backdrop-blur-md border-t border-zinc-800 p-4 md:p-6 shadow-2xl safe-area-bottom">
            <div className="container mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="text-center md:text-left space-y-2">
                    <p className="text-sm md:text-base text-zinc-300 font-medium">
                        🍪 Deneyiminizi iyileştirmek için çerezleri kullanıyoruz.
                    </p>
                    <p className="text-xs text-zinc-500 max-w-2xl">
                        Sitemizi kullanmaya devam ederek, KVKK ve Gizlilik Politikamıza uygun olarak çerez kullanımını kabul etmiş sayılırsınız.
                        Detaylı bilgi için <Link href="/cerez-politikasi" className="text-white underline hover:no-underline">Çerez Politikası</Link>'nı inceleyebilirsiniz.
                    </p>
                </div>

                <div className="flex flex-wrap justify-center gap-3 min-w-fit">
                    <button
                        onClick={() => setSettingsOpen(true)}
                        className="px-4 py-2 text-sm font-medium text-zinc-400 bg-zinc-900 hover:bg-zinc-800 hover:text-white rounded-lg transition-colors border border-zinc-800"
                    >
                        Ayarlar
                    </button>
                    <button
                        onClick={rejectAll}
                        className="px-4 py-2 text-sm font-medium text-zinc-300 bg-zinc-900 hover:bg-zinc-800 hover:text-white rounded-lg transition-colors border border-zinc-800"
                    >
                        Reddet
                    </button>
                    <button
                        onClick={acceptAll}
                        className="px-6 py-2 text-sm font-bold text-black bg-white hover:bg-zinc-200 rounded-lg transition-colors shadow-lg shadow-white/10"
                    >
                        Kabul Et
                    </button>
                </div>
            </div>
        </div>
    );
}
