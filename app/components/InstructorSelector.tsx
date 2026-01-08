'use client';

interface Instructor {
    id: string;
    name: string;
    avatarUrl: string | null;
    role: string;
}

interface InstructorSelectorProps {
    instructors: Instructor[];
    selectedIds: string[];
    onChange: (ids: string[]) => void;
}

export default function InstructorSelector({ instructors, selectedIds, onChange }: InstructorSelectorProps) {
    const toggleSelection = (id: string) => {
        if (selectedIds.includes(id)) {
            onChange(selectedIds.filter((i) => i !== id));
        } else {
            onChange([...selectedIds, id]);
        }
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {instructors.map((inst) => {
                const isSelected = selectedIds.includes(inst.id);
                return (
                    <div
                        key={inst.id}
                        onClick={() => toggleSelection(inst.id)}
                        className={`
                flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all select-none
                ${isSelected
                                ? 'bg-zinc-800 border-white/50 ring-1 ring-white'
                                : 'bg-zinc-900 border-zinc-700 hover:border-zinc-500'}
            `}
                    >
                        <div className={`w-5 h-5 rounded border flex items-center justify-center ${isSelected ? 'bg-white border-white' : 'border-zinc-500'}`}>
                            {isSelected && <span className="text-black text-xs font-bold">✓</span>}
                        </div>

                        <div className="w-10 h-10 rounded-full bg-zinc-800 overflow-hidden shrink-0">
                            {inst.avatarUrl ? (
                                <img src={inst.avatarUrl} alt={inst.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-xs font-bold text-zinc-500">
                                    {inst.name.charAt(0)}
                                </div>
                            )}
                        </div>

                        <div>
                            <p className={`text-sm font-medium ${isSelected ? 'text-white' : 'text-zinc-300'}`}>{inst.name}</p>
                            <p className="text-xs text-zinc-500">{inst.role}</p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
