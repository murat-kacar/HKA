
import prisma from '@/app/lib/prisma';
import { Metadata } from 'next';
import { Mail, Phone, MapPin, Navigation } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'İletişim | Hakan Karsak Akademi',
    description: 'Bizimle iletişime geçin. Adres, telefon ve konum bilgileri.',
};

export default async function ContactPage() {
    const settings = await prisma.siteSettings.findFirst();

    return (
        <div className="bg-white dark:bg-black min-h-screen text-black dark:text-white pt-20 transition-colors duration-300">

            {/* Header */}
            <div className="relative py-24 border-b border-gray-100 dark:border-zinc-900 overflow-hidden">
                <div className="absolute inset-0 bg-gray-100/50 dark:bg-zinc-800/30 blur-[120px] pointer-events-none"></div>
                <div className="container mx-auto px-6 relative z-10">
                    <span className="text-zinc-500 dark:text-zinc-400 font-bold tracking-widest text-sm uppercase mb-4 block">Bize Ulaşın</span>
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-black dark:text-white mb-6">
                        İletişim
                    </h1>
                    <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl font-light">
                        Sorularınız, başvurularınız veya işbirlikleri için buradayız.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-6 py-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

                    {/* Contact Info */}
                    <div>
                        <h2 className="text-2xl font-bold mb-8 text-black dark:text-white">Adres ve İletişim Bilgileri</h2>

                        <div className="space-y-8">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-zinc-900 flex items-center justify-center text-black dark:text-white border border-gray-200 dark:border-zinc-800 flex-shrink-0">
                                    <MapPin size={20} />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-lg mb-2">Adres</h3>
                                    {settings?.contactInfo ? (
                                        <div className="text-zinc-600 dark:text-zinc-400 prose dark:prose-invert prose-sm" dangerouslySetInnerHTML={{ __html: settings.contactInfo }} />
                                    ) : (
                                        <p className="text-zinc-500">Adres bilgisi eklenmemiş.</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-zinc-900 flex items-center justify-center text-black dark:text-white border border-gray-200 dark:border-zinc-800 flex-shrink-0">
                                    <Phone size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg mb-2">Telefon</h3>
                                    <p className="text-zinc-600 dark:text-zinc-400">+90 (555) 123 45 67</p>
                                    <p className="text-zinc-500 text-sm mt-1">Hafta içi 09:00 - 18:00</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-zinc-900 flex items-center justify-center text-black dark:text-white border border-gray-200 dark:border-zinc-800 flex-shrink-0">
                                    <Mail size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg mb-2">E-posta</h3>
                                    <a href="mailto:iletisim@hakankarsakakademi.com" className="text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors">
                                        iletisim@hakankarsakakademi.com
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Social Media */}
                        <div className="mt-12 pt-12 border-t border-gray-100 dark:border-zinc-900">
                            <h3 className="font-bold text-lg mb-6">Sosyal Medya</h3>
                            <div className="flex gap-4">
                                {/* Placeholder icons - In real app, check settings.socialLinks */}
                                <Link href="#" className="w-10 h-10 rounded bg-gray-100 dark:bg-zinc-900 flex items-center justify-center hover:bg-black dark:hover:bg-white hover:text-white transition-colors">Instagram</Link>
                                <Link href="#" className="w-10 h-10 rounded bg-gray-100 dark:bg-zinc-900 flex items-center justify-center hover:bg-black dark:hover:bg-white hover:text-white transition-colors">Twitter</Link>
                            </div>
                        </div>
                    </div>

                    {/* Maps Column */}
                    <div>
                        {/* Map Links */}
                        <div className="bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 mb-8">
                            <h3 className="text-sm font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                <Navigation size={16} /> Yol Tarifi Al
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                                {settings?.mapsGoogleUrl && (
                                    <a href={settings.mapsGoogleUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 py-3 px-4 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors text-sm font-medium">
                                        Google Maps
                                    </a>
                                )}
                                {settings?.mapsAppleUrl && (
                                    <a href={settings.mapsAppleUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 py-3 px-4 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors text-sm font-medium">
                                        Apple Maps
                                    </a>
                                )}
                                {settings?.mapsYandexUrl && (
                                    <a href={settings.mapsYandexUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 py-3 px-4 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors text-sm font-medium">
                                        Yandex Maps
                                    </a>
                                )}
                                {settings?.mapsBingUrl && (
                                    <a href={settings.mapsBingUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 py-3 px-4 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors text-sm font-medium">
                                        Bing Maps
                                    </a>
                                )}
                            </div>
                        </div>

                        {/* Embed Map */}
                        <div className="aspect-square w-full rounded-2xl overflow-hidden grayscale dark:invert hover:grayscale-0 dark:hover:invert-0 transition-all duration-700 border border-gray-200 dark:border-zinc-800">
                            {settings?.mapsEmbedUrl ? (
                                <iframe
                                    src={settings.mapsEmbedUrl}
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                ></iframe>
                            ) : (
                                <div className="w-full h-full bg-gray-50 dark:bg-zinc-900 flex items-center justify-center text-zinc-400 dark:text-zinc-700">
                                    Harita Yüklenemedi
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
