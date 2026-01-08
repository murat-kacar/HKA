
'use server';

import prisma from '@/app/lib/prisma';
import { z } from 'zod';

const applicationSchema = z.object({
    firstName: z.string().min(2, 'Adınız en az 2 karakter olmalıdır.'),
    lastName: z.string().min(2, 'Soyadınız en az 2 karakter olmalıdır.'),
    phone: z.string().min(10, 'Geçerli bir telefon numarası giriniz.'),
    email: z.string().email('Geçerli bir e-posta adresi giriniz.'),
    isConsentGiven: z.string().refine(val => val === 'on', {
        message: 'KVKK metnini onaylamanız gerekmektedir.',
    }),
    interest: z.string().optional(),
    // Tracking (Hidden)
    utmSource: z.string().optional(),
    utmMedium: z.string().optional(),
    utmCampaign: z.string().optional(),
    referrer: z.string().optional(),
});

export async function createApplicationAction(prevState: any, formData: FormData) {
    const rawData = Object.fromEntries(formData);

    // 1. Turnstile Verification
    const token = formData.get('cf-turnstile-response') as string;
    if (!token) {
        return { success: false, message: 'Lütfen robot olmadığınızı doğrulayınız.' };
    }

    const ip = '127.0.0.1'; // In production, get real IP from headers
    const verifyFormData = new FormData();
    verifyFormData.append('secret', process.env.TURNSTILE_SECRET_KEY || '');
    verifyFormData.append('response', token);
    verifyFormData.append('remoteip', ip);

    const turnstileResult = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        body: verifyFormData,
    });

    const turnstileOutcome = await turnstileResult.json();
    if (!turnstileOutcome.success) {
        console.error('Turnstile Validation Failed:', turnstileOutcome);
        return { success: false, message: 'Robot doğrulaması başarısız. Lütfen tekrar deneyiniz.' };
    }

    // 2. Data Validation
    const validation = applicationSchema.safeParse(rawData);

    if (!validation.success) {
        return {
            success: false,
            errors: validation.error.flatten().fieldErrors,
            message: 'Lütfen formu kontrol ediniz.'
        };
    }

    const { firstName, lastName, phone, email, isConsentGiven, interest, utmSource, utmMedium, utmCampaign, referrer } = validation.data;

    try {
        await prisma.application.create({
            data: {
                firstName,
                lastName,
                phone,
                email,
                isConsentGiven: true,
                adminNote: interest ? `İlgilenilen Eğitim/Atölye: ${interest}` : undefined,

                // Tracking
                utmSource,
                utmMedium,
                utmCampaign,
                referrer
            }
        });

        return { success: true, message: 'Başvurunuz başarıyla alındı. En kısa sürede sizinle iletişime geçeceğiz.' };

    } catch (error) {
        console.error('Application Error:', error);
        return { success: false, message: 'Bir hata oluştu. Lütfen daha sonra tekrar deneyiniz.' };
    }
}
