import prisma from '@/app/lib/prisma';
import CourseForm from '../CourseForm';

export default async function NewCoursePage() {
    const instructors = await prisma.instructor.findMany({ select: { id: true, name: true, avatarUrl: true, role: true } });
    return <CourseForm allInstructors={instructors} />;
}
