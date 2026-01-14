'use client';

interface Module {
    title: string;
    content: string;
}

interface CurriculumBuilderProps {
    value: Module[];
    onChange: (modules: Module[]) => void;
}

export default function CurriculumBuilder({ value = [], onChange }: CurriculumBuilderProps) {
    const addModule = () => {
        onChange([...value, { title: '', content: '' }]);
    };

    const removeModule = (index: number) => {
        onChange(value.filter((_, i) => i !== index));
    };

    const updateModule = (index: number, field: keyof Module, text: string) => {
        const newModules = [...value];
        newModules[index] = { ...newModules[index], [field]: text };
        onChange(newModules);
    };

    const moveModule = (index: number, direction: 'up' | 'down') => {
        if (direction === 'up' && index === 0) return;
        if (direction === 'down' && index === value.length - 1) return;

        const newModules = [...value];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;

        // Swap
        [newModules[index], newModules[targetIndex]] = [newModules[targetIndex], newModules[index]];
        onChange(newModules);
    };

    return (
        <div className="space-y-4">
            {value.map((module, index) => (
                <div key={index} className="bg-zinc-950 border border-zinc-700 rounded-lg p-4 group">
                    <div className="flex items-start gap-4">
                        {/* Index Badge */}
                        <div className="flex flex-col items-center gap-2 pt-2">
                            <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-sm font-bold border border-zinc-700">
                                {index + 1}
                            </div>
                            <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    type="button"
                                    onClick={() => moveModule(index, 'up')}
                                    disabled={index === 0}
                                    className="p-1 hover:bg-zinc-800 rounded text-zinc-400 disabled:opacity-30"
                                >
                                    ↑
                                </button>
                                <button
                                    type="button"
                                    onClick={() => moveModule(index, 'down')}
                                    disabled={index === value.length - 1}
                                    className="p-1 hover:bg-zinc-800 rounded text-zinc-400 disabled:opacity-30"
                                >
                                    ↓
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 space-y-3">
                            <input
                                type="text"
                                placeholder="Modül Başlığı (örn. Hafta 1: Giriş)"
                                value={module.title}
                                onChange={(e) => updateModule(index, 'title', e.target.value)}
                                className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2 text-sm focus:border-zinc-500 outline-none"
                            />
                            <textarea
                                placeholder="Kapsanan konular..."
                                value={module.content}
                                onChange={(e) => updateModule(index, 'content', e.target.value)}
                                className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2 text-sm focus:border-zinc-500 outline-none min-h-[60px]"
                            />
                        </div>

                        <button
                            type="button"
                            onClick={() => removeModule(index)}
                            className="text-zinc-500 hover:text-red-500 pt-2"
                            title="Modülü Kaldır"
                        >
                            ✕
                        </button>
                    </div>
                </div>
            ))}

            <button
                type="button"
                onClick={addModule}
                className="w-full py-3 border-2 border-dashed border-zinc-700 rounded-lg text-zinc-400 hover:border-zinc-500 hover:text-zinc-300 transition-colors flex items-center justify-center gap-2"
            >
                <span>+ Hafta / Modül Ekle</span>
            </button>
        </div>
    );
}
