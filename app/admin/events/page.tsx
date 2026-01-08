import prisma from '@/app/lib/prisma';
import Link from 'next/link';
import DeleteButton from './DeleteButton';

export default async function EventsPage() {
    const events = await prisma.event.findMany({
        orderBy: { date: 'desc' },
    });

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Etkinlikler</h1>
                    <p className="text-zinc-500">Gelecek ve geçmiş prodüksiyonlar.</p>
                </div>
                <Link
                    href="/admin/events/new"
                    className="bg-white text-black px-4 py-2 rounded-lg font-bold hover:bg-zinc-200 transition-colors"
                >
                    + Yeni Etkinlik
                </Link>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-zinc-950 text-zinc-400 text-sm uppercase">
                        <tr>
                            <th className="p-4 font-medium">Tarih</th>
                            <th className="p-4 font-medium">Başlık</th>
                            <th className="p-4 font-medium">Tür</th>
                            <th className="p-4 font-medium">Vitrin</th>
                            <th className="p-4 font-medium text-right">İşlemler</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800 text-sm">
                        {events.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-zinc-500">Etkinlik bulunamadı.</td>
                            </tr>
                        ) : (
                            events.map((event: any) => (
                                <tr key={event.id} className="hover:bg-zinc-800/50 transition-colors">
                                    <td className="p-4 text-zinc-400 font-mono">
                                        {new Date(event.date).toLocaleDateString()}
                                    </td>
                                    <td className="p-4 font-medium flex items-center gap-3">
                                        {event.coverImage && (
                                            <div className="w-8 h-8 rounded bg-zinc-800 overflow-hidden">
                                                <img src={event.coverImage} className="w-full h-full object-cover" />
                                            </div>
                                        )}
                                        {event.title}
                                    </td>
                                    <td className="p-4">
                                        <span className="px-2 py-1 rounded bg-zinc-800 text-xs font-semibold">
                                            {event.type}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        {event.isFeatured ? (
                                            <span className="text-green-500 text-xs">Vitrinde</span>
                                        ) : (
                                            <span className="text-zinc-600 text-xs">-</span>
                                        )}
                                    </td>
                                    <td className="p-4 text-right space-x-4">
                                        <Link href={`/admin/events/${event.id}`} className="text-zinc-400 hover:text-white">Düzenle</Link>
                                        <DeleteButton id={event.id} />
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
