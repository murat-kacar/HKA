import prisma from '@/app/lib/prisma';
import CourseForm from '../CourseForm';
import { notFound } from 'next/navigation';

export default async function EditCoursePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const [course, instructors] = await Promise.all([
        prisma.course.findUnique({
            where: { id },
            include: { instructors: true }
        }),
        prisma.instructor.findMany({ select: { id: true, name: true, avatarUrl: true, role: true } })
    ]);

    if (!course) {
        notFound();
    }

    return <CourseForm initialData={course} allInstructors={instructors} />;
}
