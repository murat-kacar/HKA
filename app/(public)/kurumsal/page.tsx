
import prisma from '@/app/lib/prisma';
import JsonLd from '@/app/components/JsonLd';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Hakkımızda | Hakan Karsak Akademi',
    description: 'Hakan Karsak Akademi\'nin kuruluş hikayesi, vizyonu ve sanata bakış açısı.',
};

export default async function AboutPage() {
    const settings = await prisma.siteSettings.findUnique({ where: { id: 1 } });

    // Schema Markup for About Page
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "AboutPage",
        "mainEntity": {
            "@type": "PerformingGroup",
            "name": "Hakan Karsak Akademi",
            "description": settings?.seoDescription || "Oyunculuk Akademisi"
        }
    };

    return (
        <div className="bg-white dark:bg-black min-h-screen text-black dark:text-white pt-20 transition-colors duration-300">
            <JsonLd data={jsonLd} />

            {/* Header Section */}
            <div className="relative py-24 border-b border-gray-100 dark:border-zinc-900">
                <div className="absolute inset-0 bg-blue-600/5 dark:bg-blue-900/10 blur-[100px] pointer-events-none"></div>
                <div className="container mx-auto px-6 text-center relative z-10">
                    <span className="text-yellow-600 dark:text-yellow-500 font-bold tracking-widest text-sm uppercase mb-4 block">Kurumsal</span>
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tighter bg-gradient-to-b from-black to-zinc-500 dark:from-white dark:to-zinc-500 bg-clip-text text-transparent">
                        Hakan Karsak Akademi
                    </h1>
                </div>
            </div>

            {/* Content Section */}
            <section className="py-20">
                <div className="container mx-auto px-6">
                    <div className="max-w-3xl mx-auto">
                        {settings?.aboutText ? (
                            <article
                                className="prose dark:prose-invert prose-lg prose-headings:text-black dark:prose-headings:text-white prose-p:text-zinc-600 dark:prose-p:text-zinc-300 prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-strong:text-black dark:prose-strong:text-white leading-relaxed"
                                dangerouslySetInnerHTML={{ __html: settings.aboutText }}
                            />
                        ) : (
                            <div className="text-center py-20 text-zinc-500">
                                <p className="text-xl">İçerik hazırlanıyor...</p>
                                <p className="text-sm mt-2">Lütfen admin panelinden kurumsal yazı içeriğini giriniz.</p>
                            </div>
                        )}

                        {/* Signature / Quote Decoration */}
                        <div className="mt-16 pt-10 border-t border-gray-100 dark:border-zinc-900 text-center">
                            <blockquote className="text-2xl font-serif italic text-zinc-500 dark:text-zinc-400">
                                "Sanat, özgürleşmektir."
                            </blockquote>
                            <cite className="block mt-4 text-sm font-bold text-yellow-600 not-italic uppercase tracking-widest">
                                - Hakan Karsak
                            </cite>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
