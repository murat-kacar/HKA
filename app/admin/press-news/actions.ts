'use server';

import prisma from '@/app/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createPressAction(_prevState: any, formData: FormData) {
    try {
        const title = formData.get('title') as string;
        const slug = formData.get('slug') as string;
        const coverImage = formData.get('coverImage') as string;
        const videoUrl = formData.get('videoUrl') as string;
        const content = formData.get('content') as string;
        const isPublished = formData.get('isPublished') === 'true';

        await prisma.pressNews.create({
            data: {
                title,
                slug,
                coverImage: coverImage || null,
                videoUrl: videoUrl || null,
                content,
                isPublished,
            },
        });

        revalidatePath('/admin/press-news');
    } catch (error: any) {
        return { error: error.message || 'Basın haberi oluşturulamadı' };
    }

    redirect('/admin/press-news');
}

export async function updatePressAction(id: string, _prevState: any, formData: FormData) {
    try {
        const title = formData.get('title') as string;
        const slug = formData.get('slug') as string;
        const coverImage = formData.get('coverImage') as string;
        const videoUrl = formData.get('videoUrl') as string;
        const content = formData.get('content') as string;
        const isPublished = formData.get('isPublished') === 'true';

        await prisma.pressNews.update({
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

        revalidatePath('/admin/press-news');
        revalidatePath(`/basinda-biz/${slug}`);
    } catch (error: any) {
        return { error: error.message || 'Basın haberi güncellenemedi' };
    }

    redirect('/admin/press-news');
}

export async function deletePressAction(id: string) {
    try {
        await prisma.pressNews.delete({ where: { id } });
        revalidatePath('/admin/press-news');
    } catch (error: any) {
        console.error('Delete error:', error);
        // return { error: error.message || 'Basın haberi silinemedi' };
    }

    redirect('/admin/press-news');
}
