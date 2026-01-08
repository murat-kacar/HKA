'use server';

import prisma from '@/app/lib/prisma';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const courseSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    slug: z.string().min(1, 'Slug is required'), // Added Slug
    summary: z.string().min(1, 'Summary is required'),
    description: z.string().min(1, 'Description is required'),
    duration: z.string().min(1, 'Duration is required'),
    coverImage: z.string().optional(),
    videoUrl: z.string().optional(), // Added Video
    instructorIds: z.string().optional(),
    curriculum: z.string().optional(),
});

function slugify(text: string) {
    return text.toString().toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '').replace(/\-\-+/g, '-').replace(/^-+/, '').replace(/-+$/, '');
}

export async function createCourseAction(prevState: any, formData: FormData) {
    const rawData = Object.fromEntries(formData);

    // Manual Slug or Auto
    if (!rawData.slug && rawData.title) {
        rawData.slug = slugify(rawData.title as string);
    }

    let instructorIds: string[] = [];
    try { if (rawData.instructorIds) instructorIds = JSON.parse(rawData.instructorIds as string); } catch { }

    let curriculum: any[] = [];
    try { if (rawData.curriculum) curriculum = JSON.parse(rawData.curriculum as string); } catch { }

    const validation = courseSchema.safeParse(rawData);
    if (!validation.success) return { error: 'Validation failed' };

    const { title, slug, summary, description, duration, coverImage, videoUrl } = validation.data;

    let uniqueSlug = slug;
    let counter = 1;
    while (await prisma.course.findUnique({ where: { slug: uniqueSlug } })) {
        uniqueSlug = `${slug}-${counter}`;
        counter++;
    }

    try {
        await prisma.course.create({
            data: {
                title,
                slug: uniqueSlug,
                summary,
                description,
                duration,
                coverImage: coverImage || null,
                videoUrl: videoUrl || null,
                curriculum,
                instructors: {
                    connect: instructorIds.map(id => ({ id }))
                }
            },
        });
    } catch (error) {
        console.error('Create Course Error:', error);
        return { error: 'Database Error' };
    }

    revalidatePath('/admin/courses');
    redirect('/admin/courses');
}

export async function updateCourseAction(id: string, prevState: any, formData: FormData) {
    const rawData = Object.fromEntries(formData);

    let instructorIds: string[] = [];
    try { if (rawData.instructorIds) instructorIds = JSON.parse(rawData.instructorIds as string); } catch { }

    let curriculum: any[] = [];
    try { if (rawData.curriculum) curriculum = JSON.parse(rawData.curriculum as string); } catch { }

    const validation = courseSchema.safeParse(rawData);
    if (!validation.success) return { error: 'Validation failed' };

    const { title, slug, summary, description, duration, coverImage, videoUrl } = validation.data;

    // Verify slug uniqueness if changed
    const existingCourse = await prisma.course.findUnique({ where: { id } });
    let finalSlug = slug;

    if (existingCourse && existingCourse.slug !== slug) {
        let counter = 1;
        while (await prisma.course.findFirst({ where: { slug: finalSlug, NOT: { id } } })) {
            finalSlug = `${slug}-${counter}`;
            counter++;
        }
    }

    try {
        await prisma.course.update({
            where: { id },
            data: {
                title,
                slug: finalSlug,
                summary,
                description,
                duration,
                coverImage,
                videoUrl,
                curriculum,
                instructors: {
                    set: instructorIds.map(id => ({ id }))
                }
            },
        });
    } catch (error) {
        console.error('Update Course Error:', error);
        return { error: 'Update Failed' };
    }

    revalidatePath('/admin/courses');
    redirect('/admin/courses');
}

export async function deleteCourseAction(id: string) {
    try {
        await prisma.course.delete({ where: { id } });
        revalidatePath('/admin/courses');
        return { message: 'Deleted' };
    } catch {
        return { error: 'Failed' };
    }
}
