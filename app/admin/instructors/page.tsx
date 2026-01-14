import prisma from '@/app/lib/prisma';
import Link from 'next/link';
import DeleteButton from './DeleteButton';

export default async function InstructorsPage() {
    const instructors = await prisma.instructor.findMany({
        orderBy: { createdAt: 'desc' },
    });

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Eğitmenler</h1>
                    <p className="text-zinc-500">Eğitmen ekibini yönetin.</p>
                </div>
                <Link
                    href="/admin/instructors/new"
                    className="bg-white text-black px-4 py-2 rounded-lg font-bold hover:bg-zinc-200 transition-colors"
                >
                    + Yeni Eğitmen
                </Link>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-zinc-950 text-zinc-400 text-sm uppercase">
                        <tr>
                            <th className="p-4 font-medium">Profil</th>
                            <th className="p-4 font-medium">İsim</th>
                            <th className="p-4 font-medium">Rol</th>
                            <th className="p-4 font-medium">Oluşturulma</th>
                            <th className="p-4 font-medium text-right">İşlemler</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800 text-sm">
                        {instructors.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-zinc-500">
                                    Eğitmen oluşturulmamış. Başlamak için bir tane oluşturun.
                                </td>
                            </tr>
                        ) : (
                            instructors.map((instructor: any) => (
                                <tr key={instructor.id} className="hover:bg-zinc-800/50 transition-colors group">
                                    <td className="p-4">
                                        <div className="w-10 h-10 rounded-full bg-zinc-800 overflow-hidden relative">
                                            {instructor.avatarUrl ? (
                                                // Using simplified img for now to avoid domain config issues
                                                <img src={instructor.avatarUrl} alt={instructor.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-zinc-600 font-bold">
                                                    {instructor.name.charAt(0)}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-4 font-medium">{instructor.name}</td>
                                    <td className="p-4 text-zinc-400">{instructor.role}</td>
                                    <td className="p-4 text-zinc-500">{new Date(instructor.createdAt).toLocaleDateString()}</td>
                                    <td className="p-4 text-right space-x-4">
                                        <Link
                                            href={`/admin/instructors/${instructor.id}`}
                                            className="text-zinc-400 hover:text-white"
                                        >
                                            Düzenle
                                        </Link>
                                        <DeleteButton id={instructor.id} />
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
