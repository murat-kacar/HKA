
import prisma from '@/app/lib/prisma';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import PageHeroGrid from '@/app/components/PageHeroGrid';

export const metadata: Metadata = {
    title: 'Eğitimler | Hakan Karsak Akademi',
    description: 'Profesyonel oyunculuk eğitimleri ve atölye çalışmaları.',
};

export default async function EducationPage() {
    const courses = await prisma.course.findMany({
        where: { type: 'WORKSHOP' },
        include: { instructors: true },
        orderBy: { createdAt: 'desc' }
    });

    return (
        <div className="atolyeler-page bg-white dark:bg-black min-h-screen">

            {/* PAGE HERO */}
            {/* PAGE HERO */}
            <div style={{ marginTop: 'var(--nav-height, 0px)' }}> {/* Spacer for fixed nav */}
                <PageHeroGrid
                    title="Eğitimler"
                    subtitle="Profesyonel eğitim programları"
                    items={courses.map((c: any) => ({
                        id: c.id,
                        title: c.title,
                        slug: c.slug,
                        coverImage: c.coverImage,
                        description: c.summary,
                        category: c.type === 'WORKSHOP' ? 'ATÖLYE' : 'EĞİTİM'
                    }))}
                    baseUrl="/egitimler"
                    accentColor="#d4af37"
                    overlayColor="rgba(212, 175, 55, 0.15)"
                />
            </div>

            {/* PAGE CONTENT */}
            <main className="page-content py-15 bg-[#ebebeb] dark:bg-zinc-900" style={{ minHeight: '60vh' }}>
                <div className="container max-w-7xl mx-auto px-5 w-full">
                    <div className="detail-cards-grid grid gap-8 mt-10 w-full" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                        {courses.map((course: any) => (
                            <Link key={course.id} href={`/egitimler/${course.slug}`} className="detail-card-link no-underline text-inherit block">
                                <div className="detail-card bg-white dark:bg-zinc-800 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1.5" style={{ boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)' }}>
                                    <div className="detail-card-image relative w-full h-64 overflow-hidden">
                                        {course.coverImage ? (
                                            <Image
                                                src={course.coverImage}
                                                alt={course.title}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gray-200 dark:bg-zinc-700 flex items-center justify-center text-gray-400 dark:text-zinc-500">
                                                Görsel Yok
                                            </div>
                                        )}
                                        <div className="detail-card-category absolute top-4 left-4 px-4 py-1 rounded-full text-xs font-semibold" style={{ background: '#d4af37', color: '#1a1a1a' }}>
                                            ATÖLYE
                                        </div>
                                    </div>
                                    <div className="detail-card-content p-6">
                                        <h3 className="detail-card-title font-serif text-2xl mb-2.5 text-black dark:text-white">
                                            {course.title}
                                        </h3>
                                        <p className="detail-card-description text-base leading-relaxed mb-5 line-clamp-3 text-zinc-600 dark:text-zinc-400">
                                            {course.summary}
                                        </p>

                                        {course.duration && (
                                            <div className="detail-card-meta flex gap-5 mb-5 text-sm text-zinc-500 dark:text-zinc-400">
                                                <span className="flex items-center gap-1.5">
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="2">
                                                        <circle cx="12" cy="12" r="10" />
                                                        <polyline points="12 6 12 12 16 14" />
                                                    </svg>
                                                    {course.duration}
                                                </span>
                                            </div>
                                        )}

                                        <div className="detail-card-footer flex justify-between items-center pt-5 border-t border-gray-200 dark:border-zinc-700">
                                            <div className="detail-card-btn inline-block px-8 py-3 rounded-full no-underline font-semibold transition-all" style={{ background: '#d4af37', color: '#1a1a1a' }}>
                                                Detayları Gör
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
