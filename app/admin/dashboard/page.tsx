export default function DashboardPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Kontrol Paneli</h1>
                <p className="text-zinc-500">Tekrar hoşgeldiniz, Yönetici.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="Toplam Başvuru" value="0" />
                <StatCard title="Aktif Etkinlik" value="0" />
                <StatCard title="Atölyeler" value="0" />
            </div>

            <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/20">
                <h3 className="text-lg font-semibold mb-4">Son Aktiviteler</h3>
                <p className="text-zinc-500 text-sm">Son aktivite bulunamadı.</p>
            </div>
        </div>
    );
}

function StatCard({ title, value }: { title: string; value: string }) {
    return (
        <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/20">
            <h3 className="text-sm font-medium text-zinc-500 mb-2">{title}</h3>
            <div className="text-3xl font-bold">{value}</div>
        </div>
    );
}
