'use server';

import prisma from '@/app/lib/prisma';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { EventType } from '@prisma/client';

const eventSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    slug: z.string().min(1, 'Slug is required'),
    date: z.string().min(1, 'Date is required'),
    type: z.nativeEnum(EventType),
    description: z.string().min(1, 'Description is required'),
    coverImage: z.string().optional(),
    videoUrl: z.string().optional(), // Added Video
    isFeatured: z.string().optional(),
    galleryUrls: z.string().optional(),
});

function slugify(text: string) {
    return text.toString().toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '').replace(/\-\-+/g, '-').replace(/^-+/, '').replace(/-+$/, '');
}

export async function createEventAction(prevState: any, formData: FormData) {
    const rawData = Object.fromEntries(formData);

    // ... auto slug ...
    if (!rawData.slug && rawData.title) {
        rawData.slug = slugify(rawData.title as string);
    }

    const galleryJson = rawData.galleryUrls as string;
    let galleryUrls: string[] = [];
    try { if (galleryJson) galleryUrls = JSON.parse(galleryJson); } catch { }

    const validation = eventSchema.safeParse(rawData);
    if (!validation.success) return { error: 'Validation failed' };

    const { title, slug, date, type, description, coverImage, videoUrl, isFeatured } = validation.data;
    const isFeaturedBool = isFeatured === 'on';

    // ... unique slug ...
    let uniqueSlug = slug;
    let counter = 1;
    while (await prisma.event.findUnique({ where: { slug: uniqueSlug } })) {
        uniqueSlug = `${slug}-${counter}`;
        counter++;
    }

    try {
        await prisma.event.create({
            data: {
                title,
                slug: uniqueSlug,
                date: new Date(date),
                type,
                description,
                coverImage,
                videoUrl,
                isFeatured: isFeaturedBool,
                gallery: { create: galleryUrls.map(url => ({ url })) }
            }
        });
    } catch (e) {
        console.error(e);
        return { error: 'DB Error' };
    }

    revalidatePath('/admin/events');
    redirect('/admin/events');
}

export async function updateEventAction(id: string, prevState: any, formData: FormData) {
    const rawData = Object.fromEntries(formData);

    // ... gallery, validation ...
    const galleryJson = rawData.galleryUrls as string;
    let galleryUrls: string[] = [];
    try { if (galleryJson) galleryUrls = JSON.parse(galleryJson); } catch { }

    const validation = eventSchema.safeParse(rawData);
    if (!validation.success) return { error: 'Validation failed' };

    const { title, slug, date, type, description, coverImage, videoUrl, isFeatured } = validation.data;
    const isFeaturedBool = isFeatured === 'on';

    // ... slug uniqueness ...
    const existingEvent = await prisma.event.findUnique({ where: { id } });
    let finalSlug = slug;
    if (existingEvent && existingEvent.slug !== slug) {
        let counter = 1;
        while (await prisma.event.findFirst({ where: { slug: finalSlug, NOT: { id } } })) {
            finalSlug = `${slug}-${counter}`;
            counter++;
        }
    }

    try {
        await prisma.$transaction(async (tx: any) => {
            await tx.event.update({
                where: { id },
                data: {
                    title,
                    slug: finalSlug,
                    date: new Date(date),
                    type,
                    description,
                    coverImage,
                    videoUrl,
                    isFeatured: isFeaturedBool,
                }
            });

            // ... gallery replace ...
            await tx.eventGalleryImage.deleteMany({ where: { eventId: id } });
            if (galleryUrls.length > 0) {
                await tx.eventGalleryImage.createMany({
                    data: galleryUrls.map(url => ({ eventId: id, url }))
                });
            }
        });
    } catch (e) {
        console.error(e);
        return { error: 'Update Failed' };
    }
    // ...

    revalidatePath('/admin/events');
    redirect('/admin/events');
}

export async function deleteEventAction(id: string) {
    try { await prisma.event.delete({ where: { id } }); revalidatePath('/admin/events'); return { message: 'Deleted' }; } catch { return { error: 'Failed' }; }
}
