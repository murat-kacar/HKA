
import { Metadata } from 'next';
import { Suspense } from 'react';
import ApplicationForm from './ApplicationForm';
import { Loader2 } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Başvuru Yap | Hakan Karsak Akademi',
    description: 'Hakan Karsak Akademi eğitim ve atölyelerine başvuru yapın.',
};

export default function ApplicationPage() {
    return (
        <div className="bg-white dark:bg-black min-h-screen text-black dark:text-white pt-20 transition-colors duration-300">

            {/* Header */}
            <div className="relative py-24 border-b border-gray-100 dark:border-zinc-900 overflow-hidden">
                <div className="absolute inset-0 bg-green-600/5 dark:bg-green-900/10 blur-[120px] pointer-events-none"></div>
                <div className="container mx-auto px-6 relative z-10 text-center">
                    <span className="text-green-600 dark:text-green-500 font-bold tracking-widest text-sm uppercase mb-4 block">Geleceğinize İlk Adım</span>
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-black dark:text-white mb-6">
                        Ön Başvuru Formu
                    </h1>
                    <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl font-light mx-auto">
                        Aşağıdaki formu doldurarak ilgilendiğiniz eğitim programı için ön kaydınızı oluşturun.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-6 py-20">
                <div className="max-w-3xl mx-auto bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-900 rounded-3xl p-8 md:p-12 shadow-xl dark:shadow-2xl">
                    <Suspense fallback={
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="animate-spin text-zinc-400 dark:text-zinc-500" size={32} />
                        </div>
                    }>
                        <ApplicationForm />
                    </Suspense>
                </div>
            </div>

        </div>
    );
}
