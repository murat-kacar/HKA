
import prisma from '@/app/lib/prisma';
import PageHeroGrid from '@/app/components/PageHeroGrid';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Basında Biz | Hakan Karsak Akademi',
    description: 'Medyada Hakan Karsak Akademi hakkında çıkan haberler.',
};

export default async function PressPage() {
    const news = await prisma.pressNews.findMany({
        where: { isPublished: true },
        orderBy: { createdAt: 'desc' }
    });

    return (
        <div className="bg-white dark:bg-black min-h-screen text-black dark:text-white transition-colors duration-300">
            <div style={{ marginTop: 'var(--nav-height, 0px)' }}>
                <PageHeroGrid
                    title="Basında Biz"
                    subtitle="Medyada hakkımızda çıkan haberler ve röportajlar"
                    items={news.map((item: any) => ({
                        id: item.id,
                        title: item.title,
                        slug: item.slug,
                        coverImage: item.coverImage,
                        description: item.content.replace(/<[^>]*>?/gm, ''),
                        category: 'BASIN'
                    }))}
                    baseUrl="/basinda-biz"
                    accentColor="#0284c7" // sky-600
                    overlayColor="rgba(2, 132, 199, 0.15)"
                />
            </div>

            {/* List Content */}
            <div className="container mx-auto px-6 py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {news.map((item: any) => (
                        <Link key={item.id} href={`/basinda-biz/${item.slug}`} className="group block">
                            <div className="relative aspect-video overflow-hidden rounded-xl mb-4">
                                {item.coverImage ? (
                                    <Image
                                        src={item.coverImage}
                                        alt={item.title}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-200 dark:bg-zinc-800 flex items-center justify-center">
                                        Görsel Yok
                                    </div>
                                )}
                            </div>
                            <h3 className="text-xl font-bold mb-2 group-hover:text-sky-600 transition-colors">{item.title}</h3>
                            <p className="text-sm text-zinc-500 line-clamp-2">{item.content.replace(/<[^>]*>?/gm, '')}</p>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
