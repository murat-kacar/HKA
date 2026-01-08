import prisma from '@/app/lib/prisma';
import ApplicationControls from '../ApplicationControls';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function ApplicationDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const application = await prisma.application.findUnique({
        where: { id },
    });

    if (!application) {
        notFound();
    }

    return (
        <div className="max-w-6xl mx-auto">
            <div className="mb-8 flex items-center justify-between">
                <Link href="/admin/applications" className="text-sm text-zinc-400 hover:text-white">← Back to List</Link>
                <div className="text-zinc-500 text-sm">
                    Applied on {new Date(application.createdAt).toLocaleString()}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Main Info */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 space-y-6">
                        <div className="border-b border-zinc-800 pb-6">
                            <h1 className="text-3xl font-bold">{application.firstName} {application.lastName}</h1>
                            <div className="mt-2 text-zinc-400">Application ID: <span className="font-mono text-zinc-500 text-xs">{application.id}</span></div>
                        </div>

                        <div className="grid grid-cols-2 gap-8">
                            <div>
                                <label className="block text-xs uppercase text-zinc-500 font-bold mb-1">Email</label>
                                <div className="text-lg">{application.email}</div>
                            </div>
                            <div>
                                <label className="block text-xs uppercase text-zinc-500 font-bold mb-1">Phone</label>
                                <div className="text-lg">{application.phone}</div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs uppercase text-zinc-500 font-bold mb-1">Consent</label>
                            <div className="flex items-center gap-2">
                                <div className={`w-3 h-3 rounded-full ${application.isConsentGiven ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                <span className="text-zinc-300">{application.isConsentGiven ? 'KVKK Consent Given' : 'Consent Not Given'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Future: If the application form had more questions (e.g. "Previous Experience"), they would go here */}
                    {/* For now, just placeholder or empty */}
                </div>

                {/* Sidebar Controls */}
                <div>
                    <ApplicationControls
                        applicationId={application.id}
                        currentStatus={application.status}
                        currentNote={application.adminNote}
                    />
                </div>

            </div>
        </div>
    );
}
