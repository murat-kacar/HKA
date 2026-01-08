'use server';

import prisma from '@/app/lib/prisma';
import { revalidatePath } from 'next/cache';
import { ApplicationStatus } from '@prisma/client';

export async function updateApplicationStatus(id: string, status: ApplicationStatus) {
    try {
        await prisma.application.update({
            where: { id },
            data: { status },
        });
        revalidatePath(`/admin/applications`);
        revalidatePath(`/admin/applications/${id}`);
        return { success: true };
    } catch (error) {
        console.error('Update Status Error:', error);
        return { error: 'Failed to update status' };
    }
}

export async function updateAdminNote(id: string, note: string) {
    try {
        await prisma.application.update({
            where: { id },
            data: { adminNote: note },
        });
        revalidatePath(`/admin/applications/${id}`);
        return { success: true };
    } catch (error) {
        console.error('Update Note Error:', error);
        return { error: 'Failed to update note' };
    }
}

export async function deleteApplication(id: string) {
    try {
        await prisma.application.delete({ where: { id } });
        revalidatePath('/admin/applications');
        return { success: true };
    } catch {
        return { error: 'Failed to delete' };
    }
}
