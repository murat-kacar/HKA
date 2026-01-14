
import Link from 'next/link';
import Image from 'next/image';
import prisma from '@/app/lib/prisma';
import { Instagram, Twitter, Linkedin, Youtube, MapPin } from 'lucide-react';

export default async function Footer() {
    // Fetch data directly in Server Component
    const settings = await prisma.siteSettings.findUnique({ where: { id: 1 } });
    const social = settings?.socialLinks as any || {};

    return (
        <footer className="bg-white dark:bg-black border-t border-gray-200 dark:border-zinc-900 pt-20 pb-10 transition-colors duration-300">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">

                    {/* Brand Column with Logo */}
                    <div className="space-y-6">
                        {/* Logo - Dark mode: white logo, Light mode: black logo */}
                        <div className="relative w-48 h-24">
                            <Image
                                src="/logo-dark.png"
                                alt="Hakan Karsak Akademi"
                                fill
                                className="object-contain object-left dark:hidden"
                                priority
                            />
                            <Image
                                src="/logo-light.png"
                                alt="Hakan Karsak Akademi"
                                fill
                                className="object-contain object-left hidden dark:block"
                                priority
                            />
                        </div>
                        <p className="text-zinc-600 dark:text-zinc-500 text-sm leading-relaxed">
                            Sahne sanatları ve oyunculuk eğitiminde profesyonel yaklaşım, modern teknikler ve usta eğitmenler.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-black dark:text-white font-semibold mb-6">Kurumsal</h4>
                        <ul className="space-y-4 text-sm text-zinc-600 dark:text-zinc-400">
                            <li><Link href="/kurumsal" className="hover:text-black dark:hover:text-white transition-colors">Hakkımızda</Link></li>
                            <li><Link href="/egitmenler" className="hover:text-black dark:hover:text-white transition-colors">Eğitmen Kadrosu</Link></li>
                            <li><Link href="/egitimler" className="hover:text-black dark:hover:text-white transition-colors">Eğitim & Atölyeler</Link></li>
                            <li><Link href="/iletisim" className="hover:text-black dark:hover:text-white transition-colors">İletişim</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-black dark:text-white font-semibold mb-6">İletişim</h4>
                        <ul className="space-y-4 text-sm text-zinc-600 dark:text-zinc-400">
                            <li className="flex items-start gap-3">
                                <MapPin size={18} className="mt-1 shrink-0" />
                                <span className="whitespace-pre-line">{settings?.contactInfo || 'Adres bilgisi girilmedi.'}</span>
                            </li>
                            {/* We could parse phone/email separately if structred, but for now assuming text block or simple layout */}
                        </ul>
                    </div>

                    {/* Maps & Social */}
                    <div>
                        <h4 className="text-black dark:text-white font-semibold mb-6">Bizi Takip Edin</h4>
                        <div className="flex items-center gap-4 mb-8">
                            {social.instagram && (
                                <a href={social.instagram} target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-100 dark:bg-zinc-900 rounded-full text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:bg-gray-200 dark:hover:bg-zinc-800 transition-colors">
                                    <Instagram size={20} />
                                </a>
                            )}
                            {social.twitter && (
                                <a href={social.twitter} target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-100 dark:bg-zinc-900 rounded-full text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:bg-gray-200 dark:hover:bg-zinc-800 transition-colors">
                                    <Twitter size={20} />
                                </a>
                            )}
                            {social.linkedin && (
                                <a href={social.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-100 dark:bg-zinc-900 rounded-full text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:bg-gray-200 dark:hover:bg-zinc-800 transition-colors">
                                    <Linkedin size={20} />
                                </a>
                            )}
                            {social.youtube && (
                                <a href={social.youtube} target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-100 dark:bg-zinc-900 rounded-full text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:bg-gray-200 dark:hover:bg-zinc-800 transition-colors">
                                    <Youtube size={20} />
                                </a>
                            )}
                        </div>

                        {/* Navigation Links */}
                        {(settings?.mapsGoogleUrl || settings?.mapsAppleUrl) && (
                            <div className="space-y-2">
                                <h5 className="text-xs font-bold text-zinc-500 dark:text-zinc-600 uppercase tracking-wider mb-2">Yol Tarifi Al</h5>
                                <div className="flex gap-2">
                                    {settings.mapsGoogleUrl && (
                                        <a href={settings.mapsGoogleUrl} target="_blank" className="text-xs bg-gray-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 px-3 py-2 rounded hover:bg-gray-300 dark:hover:bg-zinc-700 transition">Google</a>
                                    )}
                                    {settings.mapsAppleUrl && (
                                        <a href={settings.mapsAppleUrl} target="_blank" className="text-xs bg-gray-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 px-3 py-2 rounded hover:bg-gray-300 dark:hover:bg-zinc-700 transition">Apple</a>
                                    )}
                                    {settings.mapsYandexUrl && (
                                        <a href={settings.mapsYandexUrl} target="_blank" className="text-xs bg-gray-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 px-3 py-2 rounded hover:bg-gray-300 dark:hover:bg-zinc-700 transition">Yandex</a>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="border-t border-gray-200 dark:border-zinc-900 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-zinc-500 dark:text-zinc-600">
                    <p>&copy; {new Date().getFullYear()} Hakan Karsak Akademi. Tüm hakları saklıdır.</p>
                    <div className="flex gap-6 mt-4 md:mt-0">
                        <Link href="/privacy" className="hover:text-zinc-700 dark:hover:text-zinc-400">Gizlilik Politikası</Link>
                        <Link href="/terms" className="hover:text-zinc-700 dark:hover:text-zinc-400">Kullanım Şartları</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
