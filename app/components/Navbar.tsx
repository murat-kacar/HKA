'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { useTheme } from '../providers/ThemeProvider';

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const { theme, toggleTheme } = useTheme();

    // Handle Scroll Effect
    useEffect(() => {
        setMounted(true);
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { href: '/', label: 'Anasayfa' },
        { href: '/kurumsal', label: 'Biz Kimiz?' },
        { href: '/egitimler', label: 'Eğitimler' },
        { href: '/egitmenler', label: 'Eğitmenler' },
        { href: '/etkinlikler', label: 'Etkinlikler' },
        { href: '/akademide-ne-var', label: 'Akademide Ne Var' },
        { href: '/basinda-biz', label: 'Basında Biz' },
        { href: '/iletisim', label: 'İletişim' },
    ];

    return (
        <>
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5 }}
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                    ? 'bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200 dark:border-white/10 py-4'
                    : 'bg-transparent py-6'
                    }`}
            >
                <div className="container mx-auto px-6 flex items-center justify-between">
                    {/* Brand Logo - Large and overflowing */}
                    <Link href="/" className="relative z-50 group">
                        <div className="relative w-[132px] h-[132px] -mb-11 ml-12 -mt-6">
                            {/* Dark mode: light logo */}
                            <Image
                                src="/logo-circle-light.png"
                                alt="Hakan Karsak Akademi"
                                fill
                                className="object-contain hidden dark:block group-hover:opacity-80 transition-opacity drop-shadow-lg"
                                priority
                            />
                            {/* Light mode: dark logo */}
                            <Image
                                src="/logo-circle-dark.png"
                                alt="Hakan Karsak Akademi"
                                fill
                                className="object-contain dark:hidden group-hover:opacity-80 transition-opacity drop-shadow-lg"
                                priority
                            />
                        </div>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-sm font-medium text-gray-600 dark:text-zinc-300 hover:text-black dark:hover:text-white transition-colors relative group"
                            >
                                {link.label}
                                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-black dark:bg-white transition-all duration-300 group-hover:w-full"></span>
                            </Link>
                        ))}

                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-zinc-800 transition-colors"
                            aria-label="Toggle theme"
                        >
                            {!mounted ? (
                                <div className="w-5 h-5" />
                            ) : theme === 'dark' ? (
                                <Sun size={20} className="text-yellow-500" />
                            ) : (
                                <Moon size={20} className="text-gray-700" />
                            )}
                        </button>

                        <Link
                            href="/apply"
                            className="bg-black dark:bg-white text-white dark:text-black px-6 py-2 rounded-full text-sm font-bold hover:bg-gray-800 dark:hover:bg-zinc-200 transition-colors"
                        >
                            Başvuru Yap
                        </Link>
                    </div>

                    {/* Mobile Toggle */}
                    <button
                        className="md:hidden text-black dark:text-white z-50 p-2"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </motion.nav>

            {/* Mobile Fullscreen Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: '-100%' }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: '-100%' }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                        className="fixed inset-0 bg-white dark:bg-black z-40 flex flex-col items-center justify-center space-y-8 md:hidden"
                    >
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-2xl font-light text-gray-600 dark:text-zinc-300 hover:text-black dark:hover:text-white transition-colors"
                            >
                                {link.label}
                            </Link>
                        ))}

                        {/* Mobile Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="p-3 rounded-full bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors"
                            aria-label="Toggle theme"
                        >
                            {!mounted ? (
                                <div className="w-6 h-6" />
                            ) : theme === 'dark' ? (
                                <Sun size={24} className="text-yellow-500" />
                            ) : (
                                <Moon size={24} className="text-gray-700" />
                            )}
                        </button>

                        <Link
                            href="/apply"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="mt-8 bg-black dark:bg-white text-white dark:text-black px-8 py-3 rounded-full text-lg font-bold hover:bg-gray-800 dark:hover:bg-zinc-200"
                        >
                            Başvuru Yap
                        </Link>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
