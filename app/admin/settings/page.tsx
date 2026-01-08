import prisma from '@/app/lib/prisma';
import SettingsForm from './SettingsForm';

export default async function SettingsPage() {
    const settings = await prisma.siteSettings.findUnique({
        where: { id: 1 },
    });

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Site Settings</h1>
                <p className="text-zinc-500">Manage global content and configurations.</p>
            </div>

            <SettingsForm initialData={settings} />
        </div>
    );
}
