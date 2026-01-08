
import prisma from '@/app/lib/prisma';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Çerez Politikası | Hakan Karsak Akademi',
    description: 'Hakan Karsak Akademi çerez kullanımı ve KVKK aydınlatma metni.',
};

export default async function CookiePolicyPage() {
    let settings;
    try {
        settings = await prisma.siteSettings.findFirst();
    } catch (e) {
        console.error("DB Error:", e);
    }

    const defaultPolicy = `
        <p>Henüz bir çerez politikası metni eklenmemiş.</p>
        <p>Lütfen yönetici panelinden Ayarlar > Çerez Politikası alanını düzenleyiniz.</p>
    `;

    return (
        <div className="bg-white dark:bg-black min-h-screen text-black dark:text-white pt-20 transition-colors duration-300">
            {/* Header */}
            <div className="relative py-24 border-b border-gray-100 dark:border-zinc-900 overflow-hidden">
                <div className="absolute inset-0 bg-gray-100 dark:bg-zinc-800/30 blur-[120px] pointer-events-none"></div>
                <div className="container mx-auto px-6 relative z-10">
                    <span className="text-zinc-500 dark:text-zinc-400 font-bold tracking-widest text-sm uppercase mb-4 block">Yasal Bilgilendirme</span>
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-black dark:text-white mb-6">
                        Çerez Politikası
                    </h1>
                </div>
            </div>

            <div className="container mx-auto px-6 py-20">
                <div className="prose dark:prose-invert prose-lg max-w-4xl mx-auto prose-headings:text-black dark:prose-headings:text-white prose-p:text-zinc-600 dark:prose-p:text-zinc-300">
                    {/* Render HTML content from DB or Default */}
                    <div dangerouslySetInnerHTML={{ __html: settings?.cookiePolicy || defaultPolicy }} />
                </div>
            </div>
        </div>
    );
}
