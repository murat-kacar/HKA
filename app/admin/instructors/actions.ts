'use server';

import prisma from '@/app/lib/prisma';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const instructorSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    slug: z.string().min(1, 'Slug is required'), // Validating Slug
    role: z.string().min(1, 'Role is required'),
    bio: z.string().min(1, 'Bio is required'),
    avatarUrl: z.string().optional(),
    videoUrl: z.string().optional(), // Added Video URL
});

// ... slugify function ...

export async function createInstructorAction(prevState: any, formData: FormData) {
    const rawData = {
        name: formData.get('name'),
        slug: formData.get('slug'),
        role: formData.get('role'),
        bio: formData.get('bio'),
        avatarUrl: formData.get('avatarUrl'),
        videoUrl: formData.get('videoUrl'), // Catch video field
    };

    // ... slugify logic ...

    const validation = instructorSchema.safeParse(rawData);

    if (!validation.success) {
        return { error: 'Validation failed. Please check inputs.' };
    }

    const { name, slug, role, bio, avatarUrl, videoUrl } = validation.data;

    // ... unique slug logic ...
    let uniqueSlug = slug;
    let counter = 1;
    while (await prisma.instructor.findUnique({ where: { slug: uniqueSlug } })) {
        uniqueSlug = `${slug}-${counter}`;
        counter++;
    }

    try {
        await prisma.instructor.create({
            data: {
                name,
                slug: uniqueSlug,
                role,
                bio,
                avatarUrl: avatarUrl || null,
                videoUrl: videoUrl || null,
            },
        });
    } catch (error) {
        console.error('Create instructor error:', error);
        return { error: 'Database error. Could not create instructor.' };
    }

    revalidatePath('/admin/instructors');
    redirect('/admin/instructors');
}

export async function deleteInstructorAction(id: string) {
    try {
        await prisma.instructor.delete({ where: { id } });
        revalidatePath('/admin/instructors');
        return { message: 'Deleted successfully' };
    } catch (error) {
        return { error: 'Failed to delete' };
    }
}
