
import prisma from '@/app/lib/prisma';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import JsonLd from '@/app/components/JsonLd';
import { Calendar, Tag, ArrowLeft, Image as ImageIcon } from 'lucide-react';

interface EventPageProps {
    params: {
        slug: string;
    };
}

// Generate Metadata
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const event = await prisma.event.findUnique({
        where: { slug }
    });

    if (!event) return { title: 'Etkinlik Bulunamadı' };

    return {
        title: `${event.title} | Hakan Karsak Akademi`,
        description: `Hakan Karsak Akademi etkinliği: ${event.title}. Tarih: ${new Date(event.date).toLocaleDateString('tr-TR')}`,
        openGraph: {
            images: event.coverImage ? [event.coverImage] : [],
        }
    };
}

export default async function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const event = await prisma.event.findUnique({
        where: { slug },
        include: {
            gallery: true
        }
    });

    if (!event) {
        notFound();
    }

    const eventDate = new Date(event.date);
    const dateStr = eventDate.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
    const timeStr = eventDate.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });

    // Schema Markup (Event)
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": event.type === 'THEATER' ? 'TheaterEvent' : 'Event',
        "name": event.title,
        "startDate": event.date.toISOString(),
        "description": `Hakan Karsak Akademi sunar: ${event.title}`,
        "image": event.coverImage,
        "location": {
            "@type": "Place",
            "name": "Hakan Karsak Akademi Sahnesi",
            "address": {
                "@type": "PostalAddress",
                "addressLocality": "Istanbul",
                "addressCountry": "TR"
            }
        },
        "organizer": {
            "@type": "Organization",
            "name": "Hakan Karsak Akademi",
            "url": "https://hakankarsakakademi.com"
        }
    };

    return (
        <div className="bg-white dark:bg-black min-h-screen text-black dark:text-white pt-20 transition-colors duration-300">
            <JsonLd data={jsonLd} />

            {/* HERO SECTION */}
            <div className="relative h-[60vh] min-h-[500px] flex items-end pb-20 overflow-hidden">
                <div className="absolute inset-0 bg-gray-100 dark:bg-zinc-950">
                    {event.coverImage ? (
                        <Image
                            src={event.coverImage}
                            alt={event.title}
                            fill
                            className="object-cover opacity-80 dark:opacity-60"
                            priority
                            unoptimized
                        />
                    ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-white dark:from-zinc-800 dark:to-black"></div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-white via-white/50 to-transparent dark:from-black dark:via-black/50 dark:to-transparent"></div>
                </div>

                <div className="container mx-auto px-6 relative z-10">
                    <Link href="/etkinlikler" className="inline-flex items-center text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white mb-8 transition-colors text-sm">
                        <ArrowLeft size={16} className="mr-2" /> Takvime Dön
                    </Link>

                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 max-w-4xl tracking-tight leading-tight text-black dark:text-white">
                        {event.title}
                    </h1>

                    <div className="flex flex-wrap gap-6 text-sm font-medium text-zinc-600 dark:text-zinc-300">
                        <div className="flex items-center gap-2 bg-red-600 px-4 py-2 rounded-full text-white shadow-lg shadow-red-900/20">
                            <Calendar size={16} /> {dateStr}
                        </div>
                        <div className="flex items-center gap-2 bg-black/5 dark:bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm border border-black/5 dark:border-white/5">
                            <Tag size={16} className="text-red-600 dark:text-red-500" /> {event.type}
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 py-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">

                    {/* LEFT CONTENT */}
                    <div className="lg:col-span-2 space-y-16">

                        {/* Video Section */}
                        {event.videoUrl && (
                            <section>
                                <div className="relative aspect-video rounded-2xl overflow-hidden bg-gray-100 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 shadow-xl dark:shadow-2xl">
                                    <video
                                        src={event.videoUrl}
                                        controls
                                        className="w-full h-full object-cover"
                                        poster={event.coverImage || undefined}
                                        playsInline
                                    >
                                        Tarayıcınız video etiketini desteklemiyor.
                                    </video>
                                </div>
                            </section>
                        )}

                        {/* Description */}
                        <section>
                            <article
                                className="prose dark:prose-invert prose-lg max-w-none prose-p:text-zinc-600 dark:prose-p:text-zinc-300 prose-headings:text-black dark:prose-headings:text-white prose-strong:text-black dark:prose-strong:text-white prose-li:text-zinc-600 dark:prose-li:text-zinc-300"
                                dangerouslySetInnerHTML={{ __html: event.description }}
                            />
                        </section>

                        {/* Gallery */}
                        {event.gallery.length > 0 && (
                            <section className="pt-8 border-t border-gray-100 dark:border-zinc-900">
                                <h2 className="text-2xl font-bold mb-8 flex items-center gap-3 text-black dark:text-white">
                                    <ImageIcon className="text-red-600 dark:text-red-500" /> Etkinlik Galerisi
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {event.gallery.map((img: any) => (
                                        <div key={img.id} className="relative aspect-video rounded-xl overflow-hidden bg-gray-100 dark:bg-zinc-900 group border border-gray-100 dark:border-zinc-800 shadow-sm dark:shadow-none">
                                            <Image
                                                src={img.url}
                                                alt={`${event.title} gallery`}
                                                fill
                                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                                unoptimized
                                            />
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* RIGHT SIDEBAR (STICKY) */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 space-y-6">

                            {/* Actions Card */}
                            <div className="bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-900 rounded-2xl p-8 shadow-sm dark:shadow-none">
                                <h3 className="text-xl font-bold mb-6 text-black dark:text-white">Detaylar</h3>

                                <div className="space-y-6">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-full bg-white dark:bg-black flex items-center justify-center border border-gray-200 dark:border-zinc-800 text-red-600 dark:text-red-500">
                                            <Calendar size={18} />
                                        </div>
                                        <div>
                                            <div className="text-xs text-zinc-500 dark:text-zinc-400 uppercase font-bold mb-1">Tarih</div>
                                            <div className="text-lg font-bold text-black dark:text-white">{dateStr}</div>
                                            <div className="text-zinc-600 dark:text-zinc-400">{timeStr}</div>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-full bg-white dark:bg-black flex items-center justify-center border border-gray-200 dark:border-zinc-800 text-red-600 dark:text-red-500">
                                            <Tag size={18} />
                                        </div>
                                        <div>
                                            <div className="text-xs text-zinc-500 dark:text-zinc-400 uppercase font-bold mb-1">Tür</div>
                                            <div className="text-lg font-bold text-black dark:text-white">{event.type}</div>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-full bg-white dark:bg-black flex items-center justify-center border border-gray-200 dark:border-zinc-800 text-red-600 dark:text-red-500">
                                            <ArrowLeft size={18} className="rotate-180" /> {/* Location Icon placeholder */}
                                        </div>
                                        <div>
                                            <div className="text-xs text-zinc-500 dark:text-zinc-400 uppercase font-bold mb-1">Konum</div>
                                            <div className="text-lg font-bold text-black dark:text-white">Hakan Karsak Akademi</div>
                                            <Link href="/iletisim" className="text-red-600 dark:text-red-500 text-sm hover:underline">Haritada Gör</Link>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 pt-8 border-t border-gray-200 dark:border-zinc-800">
                                    <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-4">
                                        Bu etkinlik hakkında daha fazla bilgi almak veya bilet sormak için bizimle iletişime geçin.
                                    </p>
                                    <Link href="/iletisim" className="block w-full text-center py-3 bg-black dark:bg-white text-white dark:text-black font-bold rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors">
                                        Bize Ulaşın
                                    </Link>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
