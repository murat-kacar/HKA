import prisma from '@/app/lib/prisma';
import NewsForm from '../NewsForm';
import { notFound } from 'next/navigation';

export default async function EditNewsPage({ params }: { params: { id: string } }) {
    const news = await prisma.academyNews.findUnique({
        where: { id: params.id },
    });

    if (!news) {
        notFound();
    }

    return <NewsForm initialData={news} />;
}
