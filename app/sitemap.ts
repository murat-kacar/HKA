
import { MetadataRoute } from 'next';
import prisma from '@/app/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://hakankarsakakademi.com';

    // 1. Static Routes (Semantic Turkish URLs)
    const routes = [
        '',
        '/kurumsal',
        '/egitimler',
        '/egitmenler',
        '/etkinlikler',
        '/iletisim',
        '/basvuru',
        '/gizlilik', // privacy -> gizlilik
        '/sartlar', // terms -> sartlar
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    // 2. Dynamic Courses (Semantic URL: /egitimler/[slug])
    let courses: any[] = [];
    try {
        courses = await prisma.course.findMany({
            select: { slug: true, updatedAt: true },
        });
    } catch (e) {
        console.warn("Could not fetch courses for sitemap:", e);
    }

    const courseUrls = courses.map((course: any) => ({
        url: `${baseUrl}/egitimler/${course.slug}`,
        lastModified: course.updatedAt,
        changeFrequency: 'weekly' as const,
        priority: 0.9,
    }));

    // 3. Dynamic Instructors (Semantic URL: /egitmenler/[slug])
    let instructors: any[] = [];
    try {
        instructors = await prisma.instructor.findMany({
            select: { slug: true, updatedAt: true },
        });
    } catch (e) {
        console.warn("Could not fetch instructors for sitemap:", e);
    }

    const instructorUrls = instructors.map((instructor: any) => ({
        url: `${baseUrl}/egitmenler/${instructor.slug}`,
        lastModified: instructor.updatedAt,
        changeFrequency: 'monthly' as const,
        priority: 0.7,
    }));

    // 4. Dynamic Events (Semantic URL: /etkinlikler/[slug])
    let events: any[] = [];
    try {
        events = await prisma.event.findMany({
            select: { slug: true, updatedAt: true },
        });
    } catch (e) {
        console.warn("Could not fetch events for sitemap:", e);
    }

    const eventUrls = events.map((event: any) => ({
        url: `${baseUrl}/etkinlikler/${event.slug}`,
        lastModified: event.updatedAt,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }));

    return [...routes, ...courseUrls, ...instructorUrls, ...eventUrls];
}
