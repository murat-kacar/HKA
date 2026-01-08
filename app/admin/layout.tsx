import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex bg-black text-white">
            {/* Sidebar */}
            <aside className="w-64 border-r border-zinc-800 bg-zinc-900/30 backdrop-blur fixed h-full p-6">
                <div className="mb-8">
                    <h2 className="text-xl font-bold tracking-tighter">HKA<span className="text-zinc-500">Admin</span></h2>
                </div>

                <nav className="space-y-4">
                    <NavLink href="/admin/dashboard">Kontrol Paneli</NavLink>
                    <NavLink href="/admin/applications">Başvurular</NavLink>
                    <div className="pt-4 pb-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider">İçerik</div>
                    <NavLink href="/admin/events">Gösterimler/Etkinlikler</NavLink>
                    <NavLink href="/admin/academy-news">Akademide Ne Var</NavLink>
                    <NavLink href="/admin/press-news">Basında Biz</NavLink>
                    <NavLink href="/admin/courses">Eğitimler</NavLink>
                    <NavLink href="/admin/instructors">Eğitmenler</NavLink>
                    <div className="pt-4 pb-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Ayarlar</div>
                    <NavLink href="/admin/settings">Site Ayarları</NavLink>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 p-8">
                {children}
            </main>
        </div>
    );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <Link
            href={href}
            className="block px-3 py-2 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all font-medium"
        >
            {children}
        </Link>
    );
}
