
import prisma from '@/app/lib/prisma';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import { Calendar, MapPin, ArrowUpRight } from 'lucide-react';
import PageHeroGrid from '@/app/components/PageHeroGrid';

export const metadata: Metadata = {
    title: 'Gösterimler & Etkinlikler | Hakan Karsak Akademi',
    description: 'Tiyatro oyunları, seminerler ve özel etkinliklerimizi takip edin.',
};

export default async function EventsPage() {
    const events = await prisma.event.findMany({
        orderBy: { date: 'asc' }, // Upcoming events first
        where: {
            date: {
                gte: new Date(new Date().setHours(0, 0, 0, 0)) // Only future or today's events? Maybe show all for portfolio sake. Let's show all but highlight future.
                // Actually, for a portfolio site, showing past events is good. Let's just sort Descending (Newest first).
            }
        }
    });

    // Actually, usually users want to see simple upcoming first.
    // Let's do: Future Events (Ascending), then Past Events (Descending). 
    // For MVP/Simplicity, let's just show 'Upcoming' roughly or just all sorted by date Descending looks best for "What are we doing lately".
    // Reverting to Descending sort for visual consistency.

    const allEvents = await prisma.event.findMany({
        orderBy: { date: 'desc' }
    });

    return (
        <div className="bg-white dark:bg-black min-h-screen text-black dark:text-white pt-20 transition-colors duration-300">

            {/* Header */}
            <div style={{ marginTop: 'var(--nav-height, 0px)' }}>
                <PageHeroGrid
                    title="Gösterimler & Etkinlikler"
                    subtitle="Akademimizden tiyatro oyunları, söyleşiler ve performanslar."
                    items={allEvents.map((e: any) => ({
                        id: e.id,
                        title: e.title,
                        slug: e.slug,
                        coverImage: e.coverImage,
                        category: e.type,
                        description: new Date(e.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })
                    }))}
                    baseUrl="/etkinlikler"
                    accentColor="#dc2626" // red-600
                    overlayColor="rgba(220, 38, 38, 0.15)"
                />
            </div>

            {/* Event List */}
            <section className="py-20">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {allEvents.length > 0 ? allEvents.map((event: any) => {
                            const eventDate = new Date(event.date);
                            const month = eventDate.toLocaleDateString('tr-TR', { month: 'short' }).toUpperCase();
                            const day = eventDate.getDate();
                            const year = eventDate.getFullYear();

                            return (
                                <Link key={event.id} href={`/etkinlikler/${event.slug}`} className="group block bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm dark:shadow-none hover:border-red-500/50 transition-all hover:-translate-y-1">
                                    <div className="relative aspect-video">
                                        {event.coverImage ? (
                                            <Image
                                                src={event.coverImage}
                                                alt={event.title}
                                                fill
                                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                                unoptimized
                                            />
                                        ) : (
                                            <div className="absolute inset-0 bg-gray-200 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 dark:text-zinc-600">Görsel Yok</div>
                                        )}

                                        {/* Date Badge */}
                                        <div className="absolute top-4 left-4 bg-black/80 backdrop-blur text-white rounded-lg p-2 text-center min-w-[60px] border border-white/10">
                                            <span className="block text-xs font-bold text-red-500 uppercase tracking-wider">{month}</span>
                                            <span className="block text-2xl font-bold">{day}</span>
                                        </div>
                                    </div>
                                    <div className="p-6 relative">
                                        <div className="text-xs font-bold text-red-600 dark:text-red-500 mb-2 uppercase tracking-wide flex items-center gap-2">
                                            {event.type} <span className="w-1 h-1 rounded-full bg-zinc-400 dark:bg-zinc-500"></span> {year}
                                        </div>
                                        <h3 className="text-2xl font-bold mb-4 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors line-clamp-2 text-black dark:text-white">{event.title}</h3>

                                        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 text-sm">
                                            <span>Detayları İncele</span>
                                            <ArrowUpRight size={18} className="group-hover:text-black dark:group-hover:text-white transition-colors" />
                                        </div>
                                    </div>
                                </Link>
                            );
                        }) : (
                            <div className="col-span-full text-center py-20 text-zinc-500">
                                <p>Henüz planlanmış bir etkinlik bulunmamaktadır.</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

        </div>
    );
}
