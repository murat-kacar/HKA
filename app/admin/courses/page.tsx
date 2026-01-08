import prisma from '@/app/lib/prisma';
import Link from 'next/link';
import DeleteButton from './DeleteButton';

export default async function CoursesPage() {
    const courses = await prisma.course.findMany({
        orderBy: { createdAt: 'desc' },
        include: { instructors: true }
    });

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Eğitimler</h1>
                    <p className="text-zinc-500">Uzun dönem oyunculuk programları.</p>
                </div>
                <Link
                    href="/admin/courses/new"
                    className="bg-white text-black px-4 py-2 rounded-lg font-bold hover:bg-zinc-200 transition-colors"
                >
                    + Yeni Eğitim
                </Link>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-zinc-950 text-zinc-400 text-sm uppercase">
                        <tr>
                            <th className="p-4 font-medium">Başlık</th>
                            <th className="p-4 font-medium">Süre</th>
                            <th className="p-4 font-medium">Eğitmenler</th>
                            <th className="p-4 font-medium text-right">İşlemler</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800 text-sm">
                        {courses.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="p-8 text-center text-zinc-500">Eğitim bulunamadı.</td>
                            </tr>
                        ) : (
                            courses.map((course: any) => (
                                <tr key={course.id} className="hover:bg-zinc-800/50 transition-colors">
                                    <td className="p-4 font-medium flex items-center gap-3">
                                        {course.coverImage && (
                                            <div className="w-8 h-8 rounded bg-zinc-800 overflow-hidden">
                                                <img src={course.coverImage} className="w-full h-full object-cover" />
                                            </div>
                                        )}
                                        {course.title}
                                    </td>
                                    <td className="p-4 text-zinc-400">{course.duration}</td>
                                    <td className="p-4">
                                        <div className="flex -space-x-2">
                                            {course.instructors.map((inst: any) => (
                                                <div key={inst.id} className="w-6 h-6 rounded-full border border-zinc-900 bg-zinc-800 overflow-hidden" title={inst.name}>
                                                    {inst.avatarUrl ? <img src={inst.avatarUrl} className="w-full h-full object-cover" /> : null}
                                                </div>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="p-4 text-right space-x-4">
                                        <Link href={`/admin/courses/${course.id}`} className="text-zinc-400 hover:text-white">Düzenle</Link>
                                        <DeleteButton id={course.id} />
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
