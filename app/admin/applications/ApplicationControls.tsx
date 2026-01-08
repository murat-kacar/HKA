'use client';

import { useState, useTransition } from 'react';
import { updateApplicationStatus, updateAdminNote, deleteApplication } from './actions';
import { ApplicationStatus } from '@prisma/client';
import { useRouter } from 'next/navigation';

interface Props {
    applicationId: string;
    currentStatus: ApplicationStatus;
    currentNote: string | null;
}

export default function ApplicationControls({ applicationId, currentStatus, currentNote }: Props) {
    const [isPending, startTransition] = useTransition();
    const [note, setNote] = useState(currentNote || '');
    const router = useRouter();

    const handleStatusChange = (status: ApplicationStatus) => {
        startTransition(async () => {
            await updateApplicationStatus(applicationId, status);
        });
    };

    const handleNoteSave = () => {
        startTransition(async () => {
            await updateAdminNote(applicationId, note);
        });
    };

    const handleDelete = () => {
        if (confirm('Permanently delete this application?')) {
            startTransition(async () => {
                await deleteApplication(applicationId);
                router.push('/admin/applications');
            });
        }
    };

    return (
        <div className="space-y-8">
            {/* Status Panel */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
                <h3 className="font-semibold text-lg border-b border-zinc-800 pb-2">Status</h3>
                <div className="grid grid-cols-2 gap-3">
                    {[
                        { label: 'Pending', value: 'PENDING', bg: 'bg-yellow-500/20 text-yellow-500' },
                        { label: 'Called', value: 'CALLED', bg: 'bg-blue-500/20 text-blue-500' },
                        { label: 'Approved', value: 'APPROVED', bg: 'bg-green-500/20 text-green-500' },
                        { label: 'Rejected', value: 'REJECTED', bg: 'bg-red-500/20 text-red-500' },
                    ].map((s) => (
                        <button
                            key={s.value}
                            disabled={isPending}
                            onClick={() => handleStatusChange(s.value as ApplicationStatus)}
                            className={`
                        py-2 text-sm font-bold rounded-lg border-2 transition-all
                        ${currentStatus === s.value
                                    ? `${s.bg} border-current`
                                    : 'border-zinc-800 text-zinc-500 hover:border-zinc-600'}
                    `}
                        >
                            {s.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Admin Note Panel */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
                <h3 className="font-semibold text-lg border-b border-zinc-800 pb-2">Admin Notes</h3>
                <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-3 min-h-[120px] focus:outline-none focus:ring-1 focus:ring-white"
                    placeholder="Internal notes about the candidate..."
                />
                <div className="flex justify-end">
                    <button
                        onClick={handleNoteSave}
                        disabled={isPending}
                        className="bg-white text-black px-4 py-2 rounded-lg font-bold text-sm hover:bg-zinc-200 disabled:opacity-50"
                    >
                        {isPending ? 'Saving...' : 'Save Note'}
                    </button>
                </div>
            </div>

            {/* Danger Zone */}
            <div className="pt-4">
                <button
                    onClick={handleDelete}
                    className="w-full text-red-600 text-sm hover:text-red-500 py-2"
                >
                    Delete Application
                </button>
            </div>
        </div>
    );
}
