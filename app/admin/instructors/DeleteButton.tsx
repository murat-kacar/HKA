'use client';

import { useTransition } from 'react';
import { deleteInstructorAction } from './actions';

export default function DeleteButton({ id }: { id: string }) {
    const [isPending, startTransition] = useTransition();

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this instructor?')) {
            startTransition(async () => {
                await deleteInstructorAction(id);
            });
        }
    };

    return (
        <button
            onClick={handleDelete}
            disabled={isPending}
            className="text-red-500 hover:text-red-400 text-sm font-medium disabled:opacity-50"
        >
            {isPending ? 'Deleting...' : 'Delete'}
        </button>
    );
}
