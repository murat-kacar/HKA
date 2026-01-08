
import prisma from '@/app/lib/prisma';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import JsonLd from '@/app/components/JsonLd';

interface CoursePageProps {
    params: {
        slug: string;
    };
}

// Generate Metadata
export async function generateMetadata({ params }: CoursePageProps): Promise<Metadata> {
    const course = await prisma.course.findUnique({
        where: { slug: params.slug }
    });

    if (!course) return { title: 'Eğitim Bulunamadı' };

    return {
        title: `${course.title} | Hakan Karsak Akademi`,
        description: course.summary,
        openGraph: {
            images: course.coverImage ? [course.coverImage] : [],
        }
    };
}

export default async function CourseDetailPage({ params }: CoursePageProps) {
    const course = await prisma.course.findUnique({
        where: { slug: params.slug },
        include: {
            instructors: true
        }
    });

    if (!course) {
        notFound();
    }

    // Schema Markup
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Course",
        "name": course.title,
        "description": course.summary,
        "provider": {
            "@type": "Organization",
            "name": "Hakan Karsak Akademi"
        },
        "image": course.coverImage
    };

    const curriculum = course.curriculum as any[] || [];

    return (
        <div className="workshop-detail-page bg-white min-h-screen pt-0">
            <JsonLd data={jsonLd} />

            {/* HERO SECTION */}
            <div className="workshop-hero relative flex items-center overflow-hidden" style={{ height: '60vh', minHeight: '400px', backgroundColor: '#000', color: '#fff' }}>
                {course.coverImage && (
                    <Image
                        src={course.coverImage}
                        alt={course.title}
                        fill
                        className="workshop-hero-bg object-cover"
                        style={{ opacity: 0.6, zIndex: 1 }}
                        priority
                    />
                )}
                <div className="workshop-hero-content relative z-[2] max-w-7xl mx-auto px-5">
                    <span className="workshop-category-badge inline-block px-3 py-1.5 rounded text-sm font-semibold uppercase mb-5" style={{ background: '#d4af37', color: '#000' }}>
                        Atölye
                    </span>
                    <h1 className="workshop-title font-serif mb-5" style={{ fontSize: '3.5rem', lineHeight: 1.2 }}>
                        {course.title}
                    </h1>
                </div>
            </div>

            {/* CONTENT GRID */}
            <div className="workshop-content-grid grid gap-15 max-w-7xl mx-auto px-5" style={{ gridTemplateColumns: '2fr 1fr', margin: '60px auto', padding: '0 20px' }}>

                {/* MAIN COLUMN */}
                <div className="workshop-main">
                    <h2 className="font-serif text-2xl mb-5" style={{ color: '#1a1a1a' }}>Eğitim Hakkında</h2>
                    <div
                        className="workshop-description text-lg leading-relaxed mb-10"
                        style={{ color: '#444' }}
                        dangerouslySetInnerHTML={{ __html: course.description }}
                    />

                    {curriculum.length > 0 && (
                        <>
                            <h2 className="font-serif text-2xl mb-5" style={{ color: '#1a1a1a' }}>Müfredat</h2>
                            <ul className="workshop-features list-none p-0 mb-10">
                                {curriculum.map((item, index) => (
                                    <li key={index} className="relative pl-8 mb-4 text-base" style={{ color: '#333' }}>
                                        {item.title}
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}
                </div>

                {/* SIDEBAR */}
                <div className="workshop-sidebar sticky self-start" style={{ top: '120px' }}>

                    {/* Instructor Card (Top) */}
                    {course.instructors.length > 0 && (
                        <div className="workshop-instructor-card mb-8 bg-white border rounded-xl p-8" style={{ borderColor: '#e0e0e0', boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)' }}>
                            <h3 className="text-xl mb-6 inline-block pb-1.5" style={{ color: '#1a1a1a', borderBottom: '2px solid #d4af37' }}>
                                Eğitmen
                            </h3>
                            {course.instructors.map((instructor: any) => (
                                <div key={instructor.id}>
                                    <div className="instructor-profile flex flex-col items-center text-center gap-4 mb-6">
                                        {instructor.avatarUrl ? (
                                            <Image
                                                src={instructor.avatarUrl}
                                                alt={instructor.name}
                                                width={120}
                                                height={120}
                                                className="rounded-full object-cover"
                                                style={{ border: '4px solid #d4af37', padding: '3px', background: '#fff' }}
                                            />
                                        ) : (
                                            <div className="w-30 h-30 rounded-full bg-gray-200 flex items-center justify-center">
                                                ?
                                            </div>
                                        )}
                                        <div>
                                            <h4 className="font-serif text-xl font-bold mb-1.5" style={{ color: '#1a1a1a' }}>
                                                {instructor.name}
                                            </h4>
                                            <p className="text-base" style={{ color: '#666' }}>{instructor.role}</p>
                                        </div>
                                    </div>
                                    <Link
                                        href={`/egitmenler/${instructor.slug}`}
                                        className="instructor-link block text-center font-semibold transition-all px-2.5 py-2.5 rounded-md"
                                        style={{ background: 'transparent', border: '1px solid #d4af37', color: '#000' }}
                                    >
                                        Profili İncele
                                    </Link>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Info Card */}
                    <div className="workshop-info-card rounded-xl p-8" style={{ background: '#f9f9f9', boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)' }}>
                        <div className="info-row flex items-start gap-4 mb-5 pb-5" style={{ borderBottom: '1px solid #eee' }}>
                            <div className="info-icon w-10 h-10 rounded-full flex items-center justify-center" style={{ background: '#fff', color: '#d4af37', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)' }}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10" />
                                    <polyline points="12 6 12 12 16 14" />
                                </svg>
                            </div>
                            <div className="info-detail">
                                <h4 className="text-sm mb-1" style={{ color: '#888' }}>Süre</h4>
                                <p className="text-base font-semibold" style={{ color: '#333' }}>{course.duration}</p>
                            </div>
                        </div>

                        <div className="info-row flex items-start gap-4 mb-5 pb-5" style={{ borderBottom: '1px solid #eee' }}>
                            <div className="info-icon w-10 h-10 rounded-full flex items-center justify-center" style={{ background: '#fff', color: '#d4af37', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)' }}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                    <circle cx="9" cy="7" r="4" />
                                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                </svg>
                            </div>
                            <div className="info-detail">
                                <h4 className="text-sm mb-1" style={{ color: '#888' }}>Kontenjan</h4>
                                <p className="text-base font-semibold" style={{ color: '#333' }}>Sınırlıdır</p>
                            </div>
                        </div>

                        <div className="info-row flex items-start gap-4" style={{ borderBottom: 'none', marginBottom: 0, paddingBottom: 0 }}>
                            <div className="info-icon w-10 h-10 rounded-full flex items-center justify-center" style={{ background: '#fff', color: '#d4af37', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)' }}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                            </div>
                            <div className="info-detail">
                                <h4 className="text-sm mb-1" style={{ color: '#888' }}>Sertifika</h4>
                                <p className="text-base font-semibold" style={{ color: '#333' }}>Katılım Belgesi</p>
                            </div>
                        </div>

                        <Link
                            href="/basvuru"
                            className="apply-btn block w-full text-center py-4 rounded-lg font-semibold no-underline mt-5 transition-all"
                            style={{ background: '#d4af37', color: '#000' }}
                        >
                            Başvuru Yap
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
