import prisma from '@/app/lib/prisma';
import Link from 'next/link';
import { deletePressAction } from './actions';

export default async function PressNewsListPage() {
    const pressList = await prisma.pressNews.findMany({
        orderBy: { createdAt: 'desc' },
    });

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold">Basında Biz</h1>
                    <p className="text-sm text-zinc-400 mt-1">Basında çıkan haberlerimizi yönetin</p>
                </div>
                <Link
                    href="/admin/press-news/new"
                    className="bg-white text-black px-6 py-3 rounded-lg font-bold hover:bg-zinc-200 transition-colors"
                >
                    + Yeni Basın Haberi Ekle
                </Link>
            </div>

            {pressList.length === 0 ? (
                <div className="text-center py-24 text-zinc-500 bg-zinc-900/30 rounded-2xl border border-zinc-800">
                    <p>Henüz basın haberi eklenmemiş.</p>
                </div>
            ) : (
                <div className="bg-zinc-900/30 rounded-2xl border border-zinc-800 overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-zinc-950 border-b border-zinc-800">
                            <tr>
                                <th className="text-left p-4 text-sm font-semibold text-zinc-400">Başlık</th>
                                <th className="text-left p-4 text-sm font-semibold text-zinc-400">Durum</th>
                                <th className="text-left p-4 text-sm font-semibold text-zinc-400">Tarih</th>
                                <th className="text-right p-4 text-sm font-semibold text-zinc-400">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pressList.map((press: any) => (
                                <tr key={press.id} className="border-b border-zinc-800 hover:bg-zinc-800/50 transition-colors">
                                    <td className="p-4">
                                        <div className="font-medium">{press.title}</div>
                                        <div className="text-sm text-zinc-500 font-mono">/basinda-biz/{press.slug}</div>
                                    </td>
                                    <td className="p-4">
                                        {press.isPublished ? (
                                            <span className="inline-block px-3 py-1 bg-green-500/10 text-green-500 rounded-full text-xs font-semibold">Yayında</span>
                                        ) : (
                                            <span className="inline-block px-3 py-1 bg-zinc-700 text-zinc-400 rounded-full text-xs font-semibold">Taslak</span>
                                        )}
                                    </td>
                                    <td className="p-4 text-sm text-zinc-400">
                                        {new Date(press.createdAt).toLocaleDateString('tr-TR')}
                                    </td>
                                    <td className="p-4 text-right space-x-2">
                                        <Link
                                            href={`/admin/press-news/${press.id}`}
                                            className="text-sm text-blue-400 hover:text-blue-300"
                                        >
                                            Düzenle
                                        </Link>
                                        <form action={deletePressAction.bind(null, press.id)} className="inline">
                                            <button
                                                type="submit"
                                                className="text-sm text-red-400 hover:text-red-300"
                                                onClick={(e) => {
                                                    if (!confirm('Bu basın haberini silmek istediğinizden emin misiniz?')) {
                                                        e.preventDefault();
                                                    }
                                                }}
                                            >
                                                Sil
                                            </button>
                                        </form>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
