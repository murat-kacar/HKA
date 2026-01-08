'use server';

import prisma from '@/app/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createNewsAction(_prevState: any, formData: FormData) {
    try {
        const title = formData.get('title') as string;
        const slug = formData.get('slug') as string;
        const coverImage = formData.get('coverImage') as string;
        const videoUrl = formData.get('videoUrl') as string;
        const content = formData.get('content') as string;
        const isPublished = formData.get('isPublished') === 'true';

        await prisma.academyNews.create({
            data: {
                title,
                slug,
                coverImage: coverImage || null,
                videoUrl: videoUrl || null,
                content,
                isPublished,
            },
        });

        revalidatePath('/admin/academy-news');
    } catch (error: any) {
        return { error: error.message || 'Haber oluşturulamadı' };
    }

    redirect('/admin/academy-news');
}

export async function updateNewsAction(id: string, _prevState: any, formData: FormData) {
    try {
        const title = formData.get('title') as string;
        const slug = formData.get('slug') as string;
        const coverImage = formData.get('coverImage') as string;
        const videoUrl = formData.get('videoUrl') as string;
        const content = formData.get('content') as string;
        const isPublished = formData.get('isPublished') === 'true';

        await prisma.academyNews.update({
            where: { id },
            data: {
                title,
                slug,
                coverImage: coverImage || null,
                videoUrl: videoUrl || null,
                content,
                isPublished,
            },
        });

        revalidatePath('/admin/academy-news');
        revalidatePath(`/akademide-ne-var/${slug}`);
    } catch (error: any) {
        return { error: error.message || 'Haber güncellenemedi' };
    }

    redirect('/admin/academy-news');
}

export async function deleteNewsAction(id: string) {
    try {
        await prisma.academyNews.delete({ where: { id } });
        revalidatePath('/admin/academy-news');
    } catch (error: any) {
        console.error('Delete error:', error);
        // return { error: error.message || 'Haber silinemedi' };
    }

    redirect('/admin/academy-news');
}
