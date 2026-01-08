'use client';

import { useTransition } from 'react';
import { deleteEventAction } from './actions';

export default function DeleteButton({ id }: { id: string }) {
    const [isPending, startTransition] = useTransition();

    const handleDelete = () => {
        if (confirm('Delete this event?')) {
            startTransition(async () => {
                await deleteEventAction(id);
            });
        }
    };

    return (
        <button
            onClick={handleDelete}
            disabled={isPending}
            className="text-red-500 hover:text-red-400 text-sm font-medium disabled:opacity-50"
        >
            {isPending ? '...' : 'Delete'}
        </button>
    );
}
