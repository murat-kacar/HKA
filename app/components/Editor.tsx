'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface EditorProps {
    value: string;
    onChange: (html: string) => void;
    className?: string;
    placeholder?: string;
}

export default function Editor({ value, onChange, className }: EditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [2, 3],
                },
            }),
        ],
        content: value,
        editorProps: {
            attributes: {
                class: 'prose prose-invert max-w-none focus:outline-none min-h-[150px]',
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        // Fix for SSR/hydration mismatch if content changes immediately
        immediatelyRender: false
    });

    if (!editor) {
        return null;
    }

    return (
        <div className={twMerge("rounded-lg border border-zinc-700 bg-zinc-900 overflow-hidden", className)}>
            {/* Basic Toolbar */}
            <div className="flex flex-wrap gap-1 p-2 border-b border-zinc-700 bg-zinc-800/50">
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    isActive={editor.isActive('bold')}
                    label="B"
                />
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    isActive={editor.isActive('italic')}
                    label="I"
                />
                <div className="w-px h-6 bg-zinc-700 mx-1 self-center" />
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    isActive={editor.isActive('heading', { level: 2 })}
                    label="H2"
                />
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    isActive={editor.isActive('heading', { level: 3 })}
                    label="H3"
                />
                <div className="w-px h-6 bg-zinc-700 mx-1 self-center" />
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    isActive={editor.isActive('bulletList')}
                    label="List"
                />
            </div>

            {/* Content Area */}
            <div className="p-4">
                <EditorContent editor={editor} />
            </div>
        </div>
    );
}

function ToolbarButton({ onClick, isActive, label }: { onClick: () => void; isActive: boolean; label: string }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={clsx(
                "px-3 py-1 rounded text-sm font-semibold transition-colors",
                isActive
                    ? "bg-white text-black"
                    : "text-zinc-400 hover:bg-zinc-700 hover:text-white"
            )}
        >
            {label}
        </button>
    );
}
