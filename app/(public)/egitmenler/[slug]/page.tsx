
import prisma from '@/app/lib/prisma';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import JsonLd from '@/app/components/JsonLd';
import { ArrowLeft } from 'lucide-react';

interface InfoPageProps {
    params: {
        slug: string;
    };
}

// Generate Metadata for SEO
export async function generateMetadata({ params }: InfoPageProps): Promise<Metadata> {
    const instructor = await prisma.instructor.findUnique({
        where: { slug: params.slug }
    });

    if (!instructor) return { title: 'Eğitmen Bulunamadı' };

    return {
        title: `${instructor.name} | Hakan Karsak Akademi`,
        description: `${instructor.name} - ${instructor.role}. Biyografisi ve verdiği eğitimler.`,
        openGraph: {
            images: instructor.avatarUrl ? [instructor.avatarUrl] : [],
        }
    };
}

export default async function InstructorDetailPage({ params }: InfoPageProps) {
    const instructor = await prisma.instructor.findUnique({
        where: { slug: params.slug },
        include: {
            courses: true,
            workshops: { where: { status: 'PUBLISHED' } }
        }
    });

    if (!instructor) {
        notFound();
    }

    // Schema Markup for Person
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Person",
        "name": instructor.name,
        "jobTitle": instructor.role,
        "image": instructor.avatarUrl,
        "description": `Hakan Karsak Akademi eğitmeni ${instructor.name}.`,
        "worksFor": {
            "@type": "PerformingGroup",
            "name": "Hakan Karsak Akademi"
        }
    };

    return (
        <div className="bg-white dark:bg-black min-h-screen text-black dark:text-white pt-24 pb-20 transition-colors duration-300">
            <JsonLd data={jsonLd} />

            <div className="container mx-auto px-6">

                {/* Back Link */}
                <Link href="/egitmenler" className="inline-flex items-center text-zinc-500 hover:text-black dark:hover:text-white mb-8 transition-colors">
                    <ArrowLeft size={20} className="mr-2" /> Tüm Eğitmenler
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-20">

                    {/* Left Column: Image & Quick Info */}
                    <div>
                        <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 mb-8 sticky top-24 shadow-sm dark:shadow-none">
                            {instructor.avatarUrl ? (
                                <Image
                                    src={instructor.avatarUrl}
                                    alt={instructor.name}
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center text-zinc-400 dark:text-zinc-700">Fotoğraf Yok</div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Bio & Courses */}
                    <div className="lg:col-span-2">
                        <span className="text-yellow-600 dark:text-yellow-500 font-bold tracking-widest text-sm uppercase mb-2 block">{instructor.role}</span>
                        <h1 className="text-4xl md:text-6xl font-bold mb-8 text-black dark:text-white tracking-tighter">{instructor.name}</h1>

                        <article
                            className="prose dark:prose-invert prose-lg prose-p:text-zinc-600 dark:prose-p:text-zinc-300 prose-headings:text-black dark:prose-headings:text-white mb-16"
                            dangerouslySetInnerHTML={{ __html: instructor.bio }}
                        />

                        {/* Introduction Video */}
                        {instructor.videoUrl && (
                            <div className="mb-16">
                                <h3 className="text-2xl font-bold mb-6 text-black dark:text-white">Tanıtım Videosu</h3>
                                <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-100 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 shadow-xl dark:shadow-2xl">
                                    <video
                                        src={instructor.videoUrl}
                                        controls
                                        className="w-full h-full object-cover"
                                        poster={instructor.avatarUrl || undefined}
                                        playsInline
                                    >
                                        Tarayıcınız video etiketini desteklemiyor.
                                    </video>
                                </div>
                            </div>
                        )}

                        {/* Courses Given by Instructor */}
                        {(instructor.courses.length > 0 || instructor.workshops.length > 0) && (
                            <div className="border-t border-gray-100 dark:border-zinc-800 pt-10">
                                <h3 className="text-2xl font-bold mb-6 text-black dark:text-white">Verdiği Eğitimler</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {instructor.courses.map((course: any) => (
                                        <Link key={course.id} href={`/egitimler/${course.slug}`} className="block p-4 bg-gray-50 dark:bg-zinc-900 hover:bg-gray-100 dark:hover:bg-zinc-800 border border-gray-200 dark:border-zinc-800 rounded-lg transition-colors group">
                                            <span className="text-xs text-zinc-500 uppercase tracking-wider mb-1 block">Kurs</span>
                                            <div className="font-bold text-lg text-black dark:text-white group-hover:text-yellow-600 dark:group-hover:text-yellow-500 transition-colors">{course.title}</div>
                                        </Link>
                                    ))}
                                    {instructor.workshops.map((workshop: any) => (
                                        <Link key={workshop.id} href={`/atolyeler/${workshop.slug}`} className="block p-4 bg-gray-50 dark:bg-zinc-900 hover:bg-gray-100 dark:hover:bg-zinc-800 border border-gray-200 dark:border-zinc-800 rounded-lg transition-colors group">
                                            <span className="text-xs text-yellow-600 dark:text-yellow-500 uppercase tracking-wider mb-1 block">Atölye</span>
                                            <div className="font-bold text-lg text-black dark:text-white group-hover:text-yellow-600 dark:group-hover:text-yellow-500 transition-colors">{workshop.title}</div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
