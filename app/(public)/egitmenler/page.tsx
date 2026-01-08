
import prisma from '@/app/lib/prisma';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import { ArrowUpRight } from 'lucide-react';
import PageHeroGrid from '@/app/components/PageHeroGrid';

export const metadata: Metadata = {
    title: 'Eğitmen Kadrosu | Hakan Karsak Akademi',
    description: 'Alanında uzman, tecrübeli ve ödüllü eğitmen kadromuzla tanışın.',
};

export default async function InstructorsPage() {
    const instructors = await prisma.instructor.findMany({
        orderBy: { createdAt: 'desc' }
    });

    return (
        <div className="bg-white dark:bg-black min-h-screen text-black dark:text-white pt-20 transition-colors duration-300">

            {/* Header */}
            <div style={{ marginTop: 'var(--nav-height, 0px)' }}>
                <PageHeroGrid
                    title="Eğitmen Kadrosu"
                    subtitle="Sahne sanatlarının inceliklerini, sektörün içinden gelen deneyimli isimlerden öğrenin."
                    items={instructors.map((i: any) => ({
                        id: i.id,
                        title: i.name,
                        slug: i.slug,
                        coverImage: i.avatarUrl, // Using avatar as cover for hero grid
                        category: i.role,
                        description: i.role
                    }))}
                    baseUrl="/egitmenler"
                    accentColor="#ca8a04" // yellow-600
                    overlayColor="rgba(202, 138, 4, 0.15)"
                />
            </div>

            {/* Grid */}
            <section className="py-20">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {instructors.length > 0 ? instructors.map((instructor: any) => (
                            <Link
                                key={instructor.id}
                                href={`/egitmenler/${instructor.slug}`}
                                className="group block relative"
                            >
                                <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-gray-50 dark:bg-zinc-900 mb-6 border border-gray-100 dark:border-zinc-800 shadow-sm dark:shadow-none transition-all duration-300">
                                    {instructor.avatarUrl ? (
                                        <Image
                                            src={instructor.avatarUrl}
                                            alt={instructor.name}
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center text-zinc-400 dark:text-zinc-700 flex-col gap-2">
                                            <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-zinc-800"></div>
                                            <span>Fotoğraf Yok</span>
                                        </div>
                                    )}

                                    {/* Icon visible by default on mobile/desktop without hover requirement */}
                                    <div className="absolute top-4 right-4 bg-black/50 backdrop-blur text-white p-2 rounded-full border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <ArrowUpRight size={20} />
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-2xl font-bold text-black dark:text-white mb-1 group-hover:text-yellow-600 dark:group-hover:text-yellow-500 transition-colors">
                                        {instructor.name}
                                    </h3>
                                    <p className="text-zinc-500 dark:text-zinc-400 text-sm uppercase tracking-wider font-medium">
                                        {instructor.role}
                                    </p>
                                </div>
                            </Link>
                        )) : (
                            <div className="col-span-full text-center py-20 text-zinc-500">
                                <p>Henüz eğitmen eklenmemiş.</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

        </div>
    );
}
