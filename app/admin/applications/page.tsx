import prisma from '@/app/lib/prisma';
import Link from 'next/link';
import { ApplicationStatus } from '@prisma/client';

export default async function ApplicationsPage() {
    const applications = await prisma.application.findMany({
        orderBy: { createdAt: 'desc' },
    });

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Başvurular</h1>
                    <p className="text-zinc-500">Gelen öğrenci başvurularını inceleyin ve yönetin.</p>
                </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-zinc-950 text-zinc-400 text-sm uppercase">
                        <tr>
                            <th className="p-4 font-medium">Tarih</th>
                            <th className="p-4 font-medium">Başvuru Sahibi</th>
                            <th className="p-4 font-medium">E-posta / Telefon</th>
                            <th className="p-4 font-medium">Durum</th>
                            <th className="p-4 font-medium text-right">İşlemler</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800 text-sm">
                        {applications.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-zinc-500">Henüz başvuru yok.</td>
                            </tr>
                        ) : (
                            applications.map((app: any) => (
                                <tr key={app.id} className="hover:bg-zinc-800/50 transition-colors">
                                    <td className="p-4 text-zinc-400 font-mono">
                                        {new Date(app.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="p-4 font-medium">
                                        {app.firstName} {app.lastName}
                                    </td>
                                    <td className="p-4 text-zinc-400">
                                        <div className="flex flex-col">
                                            <span>{app.email}</span>
                                            <span className="text-xs text-zinc-500">{app.phone}</span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <StatusBadge status={app.status} />
                                    </td>
                                    <td className="p-4 text-right">
                                        <Link
                                            href={`/admin/applications/${app.id}`}
                                            className="bg-white text-black px-3 py-1.5 rounded text-xs font-bold hover:bg-zinc-200"
                                        >
                                            İncele
                                        </Link>
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

function StatusBadge({ status }: { status: ApplicationStatus }) {
    const colors = {
        PENDING: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20',
        CALLED: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
        APPROVED: 'text-green-500 bg-green-500/10 border-green-500/20',
        REJECTED: 'text-red-500 bg-red-500/10 border-red-500/20',
    };

    return (
        <span className={`px-2 py-0.5 rounded text-xs border ${colors[status]}`}>
            {status}
        </span>
    );
}
