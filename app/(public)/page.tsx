
import prisma from '@/app/lib/prisma';
import Hero from '@/app/components/Hero';
import HorizontalSlider from '@/app/components/HorizontalSlider';
import PageHeroGrid from '@/app/components/PageHeroGrid';

export default async function HomePage() {
    // Fetch Academy News (Akademide Ne Var)
    const academyNews = await prisma.academyNews.findMany({
        where: { isPublished: true },
        take: 6,
        orderBy: { createdAt: 'desc' }
    });

    // Fetch Workshops (Atölyeler) - Courses with type WORKSHOP
    const workshops = await prisma.course.findMany({
        where: { type: 'WORKSHOP' },
        take: 10,
        orderBy: { createdAt: 'desc' }
    });

    // Fetch Events (Etkinlikler/Workshops) 
    const events = await prisma.event.findMany({
        where: { type: { not: 'THEATER' } },
        take: 10,
        orderBy: { date: 'desc' }
    });

    // Fetch Theater Events (Tiyatro Oyunları)
    const theaterEvents = await prisma.event.findMany({
        where: { type: 'THEATER' },
        take: 10,
        orderBy: { date: 'desc' }
    });

    return (
        <div className="bg-white dark:bg-black min-h-screen">
            {/* HERO SECTION with Swiper */}
            <Hero />

            {/* AKADEMIDE NE VAR SECTION */}
            {academyNews.length > 0 && (
                <PageHeroGrid
                    title="Akademide Ne Var?"
                    subtitle="Akademimizden Son Gelişmeler"
                    items={academyNews.map((item: any) => ({
                        id: item.id,
                        title: item.title,
                        slug: item.slug,
                        coverImage: item.coverImage,
                        content: item.content.replace(/<[^>]*>?/gm, ''), // Strip HTML for description
                        category: 'HABER'
                    }))}
                    baseUrl="/akademide-ne-var"
                    accentColor="#9d0919"
                    overlayColor="rgba(157, 9, 25, 0.08)"
                />
            )}

            {/* MAIN CONTENT - Curtain Container */}
            <main id="curtain-container" className="relative z-[5] overflow-visible pb-0 bg-[#ebebeb] dark:bg-zinc-900">
                {/* Panel 1 */}
                <section className="curtain-panel panel-1 relative z-10 overflow-visible bg-[#ebebeb] dark:bg-zinc-900" style={{
                    padding: '80px 5%',
                    boxShadow: '0 -10px 30px rgba(0, 0, 0, 0.05)'
                }}>
                    <div className="panel-content max-w-full mx-auto overflow-visible">

                        {/* Atölyeler Section */}
                        {workshops.length > 0 && (
                            <div className="content-section workshops-section-white section-workshop mb-15 overflow-visible bg-white dark:bg-zinc-800" style={{
                                padding: '40px 5% 60px 5%',
                                margin: '0 0 40px 0',
                                width: '100%',
                                borderRadius: '12px',
                                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                            }}>
                                <HorizontalSlider
                                    items={workshops.map((w: any) => ({
                                        id: w.id,
                                        title: w.title,
                                        slug: w.slug,
                                        coverImage: w.coverImage,
                                    }))}
                                    title="Atölyeler"
                                    accentColor="yellow"
                                    baseUrl="/egitimler"
                                    aspectRatio="square"
                                />
                            </div>
                        )}

                        {/* Etkinlikler/Workshops Section */}
                        {events.length > 0 && (
                            <div className="content-section workshops-section-white section-workshops mb-15 overflow-visible bg-white dark:bg-zinc-800" style={{
                                padding: '40px 5% 60px 5%',
                                margin: '40px 0',
                                width: '100%',
                                borderRadius: '12px',
                                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                            }}>
                                <HorizontalSlider
                                    items={events.map((e: any) => ({
                                        id: e.id,
                                        title: e.title,
                                        slug: e.slug,
                                        coverImage: e.coverImage,
                                        date: e.date,
                                        type: e.type,
                                    }))}
                                    title="Etkinlikler/Workshops"
                                    accentColor="blue"
                                    baseUrl="/etkinlikler"
                                    aspectRatio="square"
                                />
                            </div>
                        )}

                        {/* Tiyatro Oyunları Section */}
                        {theaterEvents.length > 0 && (
                            <div className="content-section workshops-section-white section-theater overflow-visible bg-white dark:bg-zinc-800" style={{
                                padding: '40px 5% 60px 5%',
                                margin: '40px 0 0 0',
                                width: '100%',
                                borderRadius: '12px',
                                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                            }}>
                                <HorizontalSlider
                                    items={theaterEvents.map((e: any) => ({
                                        id: e.id,
                                        title: e.title,
                                        slug: e.slug,
                                        coverImage: e.coverImage,
                                        date: e.date,
                                    }))}
                                    title="Tiyatro Oyunları"
                                    accentColor="red"
                                    baseUrl="/etkinlikler"
                                    aspectRatio="portrait"
                                />
                            </div>
                        )}

                    </div>
                </section>
            </main>
        </div>
    );
}
