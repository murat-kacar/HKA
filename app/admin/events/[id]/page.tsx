import prisma from '@/app/lib/prisma';
import EventForm from '../EventForm';
import { notFound } from 'next/navigation';

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const event = await prisma.event.findUnique({
        where: { id },
        include: { gallery: true },
    });

    if (!event) {
        notFound();
    }

    return <EventForm initialData={event} />;
}
