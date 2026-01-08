'use server';

import prisma from '@/app/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function updateSettingsAction(prevState: any, formData: FormData) {
    // 1. Content
    const aboutText = formData.get('aboutText') as string;
    const privacyPolicy = formData.get('privacyPolicy') as string;
    const cookiePolicy = formData.get('cookiePolicy') as string;
    const contactInfo = formData.get('contactInfo') as string;

    // 2. SEO
    const seoTitle = formData.get('seoTitle') as string;
    const seoDescription = formData.get('seoDescription') as string;
    const seoKeywords = formData.get('seoKeywords') as string;

    // 3. Integrations
    const googleAnalyticsId = formData.get('googleAnalyticsId') as string;
    const googleTagManagerId = formData.get('googleTagManagerId') as string;
    const googleSiteVerification = formData.get('googleSiteVerification') as string;

    const metaPixelId = formData.get('metaPixelId') as string;
    const metaSiteVerification = formData.get('metaSiteVerification') as string;

    const yandexMetricaId = formData.get('yandexMetricaId') as string;
    const yandexSiteVerification = formData.get('yandexSiteVerification') as string;

    // 4. Maps
    const mapsEmbedUrl = formData.get('mapsEmbedUrl') as string;
    const mapsGoogleUrl = formData.get('mapsGoogleUrl') as string;
    const mapsAppleUrl = formData.get('mapsAppleUrl') as string;
    const mapsYandexUrl = formData.get('mapsYandexUrl') as string;
    const mapsBingUrl = formData.get('mapsBingUrl') as string;

    // Microsoft
    const microsoftClarityId = formData.get('microsoftClarityId') as string;
    const bingSiteVerification = formData.get('bingSiteVerification') as string;

    // 5. Hero Section
    const heroTitle = formData.get('heroTitle') as string;
    const heroSubtitle = formData.get('heroSubtitle') as string;
    const heroMediaUrl = formData.get('heroMediaUrl') as string;
    const heroMediaType = formData.get('heroMediaType') as string; // 'image' or 'video'

    // 6. Social Links
    const instagram = formData.get('instagram') as string;
    const twitter = formData.get('twitter') as string;
    const linkedin = formData.get('linkedin') as string;
    const facebook = formData.get('facebook') as string;
    const youtube = formData.get('youtube') as string;

    const socialLinks = {
        instagram,
        twitter,
        linkedin,
        facebook,
        youtube
    };

    try {
        await prisma.siteSettings.upsert({
            where: { id: 1 },
            update: {
                aboutText,
                privacyPolicy,
                cookiePolicy,
                contactInfo,

                seoTitle,
                seoDescription,
                seoKeywords,

                googleAnalyticsId,
                googleTagManagerId,
                googleSiteVerification,

                metaPixelId,
                metaSiteVerification,

                yandexMetricaId,
                yandexSiteVerification,

                microsoftClarityId,
                bingSiteVerification,

                mapsEmbedUrl,
                mapsGoogleUrl,
                mapsAppleUrl,
                mapsYandexUrl,
                mapsBingUrl,

                heroTitle,
                heroSubtitle,
                heroMediaUrl,
                heroMediaType,

                socialLinks
            },
            create: {
                id: 1,
                aboutText: aboutText || '',
                privacyPolicy: privacyPolicy || '',
                cookiePolicy: cookiePolicy || '',
                contactInfo: contactInfo || '',

                seoTitle: seoTitle || 'Hakan Karsak Akademi',
                seoDescription: seoDescription || 'Hakan Karsak Akademi Resmi Web Sitesi',
                seoKeywords,

                googleAnalyticsId,
                googleTagManagerId,
                googleSiteVerification,

                metaPixelId,
                metaSiteVerification,

                yandexMetricaId,
                yandexSiteVerification,

                microsoftClarityId,
                bingSiteVerification,

                mapsEmbedUrl,
                mapsGoogleUrl,
                mapsAppleUrl,
                mapsYandexUrl,
                mapsBingUrl,

                heroTitle: heroTitle || 'SAHNE SENİN.',
                heroSubtitle: heroSubtitle || 'Hakan Karsak Akademi ile oyunculuk yeteneğinizi keşfedin.',
                heroMediaUrl,
                heroMediaType: heroMediaType || 'image',

                socialLinks
            },
        });

        revalidatePath('/admin/settings');
        revalidatePath('/', 'layout'); // Update root layout meta
        revalidatePath('/', 'page'); // Update homepage
        return { message: 'All Marketing, SEO, Map & Hero settings updated successfully' };
    } catch (error) {
        console.error('Settings update error:', error);
        return { error: 'Failed to update settings.' };
    }
}
