import prisma from '@/app/lib/prisma';
import PressForm from '../PressForm';
import { notFound } from 'next/navigation';

export default async function EditPressPage({ params }: { params: { id: string } }) {
    const press = await prisma.pressNews.findUnique({
        where: { id: params.id },
    });

    if (!press) {
        notFound();
    }

    return <PressForm initialData={press} />;
}
