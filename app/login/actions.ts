'use server'

import { z } from 'zod';
import prisma from '@/app/lib/prisma';
import { verifyPassword } from '@/app/lib/auth';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const loginSchema = z.object({
    username: z.string().min(1, 'Username is required'),
    password: z.string().min(1, 'Password is required'),
});

export async function loginAction(prevState: any, formData: FormData) {
    const result = loginSchema.safeParse(Object.fromEntries(formData));

    if (!result.success) {
        return { error: 'Invalid input' };
    }

    const { username, password } = result.data;

    try {
        const admin = await prisma.admin.findUnique({
            where: { username },
        });

        if (!admin) {
            return { error: 'Invalid credentials' };
        }

        const isValid = await verifyPassword(password, admin.passwordHash);

        if (!isValid) {
            return { error: 'Invalid credentials' };
        }

        // Set Session Cookie
        const cookieStore = await cookies();
        cookieStore.set('admin_session', admin.id, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24, // 1 day
            path: '/',
        });

    } catch (error) {
        console.error('Login error:', error);
        return { error: 'Something went wrong.' };
    }

    // Redirect outside try-catch because it throws NEXT_REDIRECT
    redirect('/admin/dashboard');
}
