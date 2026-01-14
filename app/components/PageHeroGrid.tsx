'use client';

import Image from 'next/image';
import Link from 'next/link';

interface GridItem {
    id: string;
    title: string;
    slug: string;
    coverImage?: string;
    description?: string;
    content?: string; // Fallback for description
    category?: string; // Optional chip text
}

interface PageHeroGridProps {
    title: string;
    subtitle: string;
    items: GridItem[];
    baseUrl: string; // e.g., '/egitimler'
    accentColor?: string; // Hex color for highlights (e.g., #d4af37)
    overlayColor?: string; // For shadow/tint (optional)
}

export default function PageHeroGrid({
    title,
    subtitle,
    items,
    baseUrl,
    accentColor = '#d4af37',
    overlayColor = 'rgba(157, 9, 25, 0.08)' // Default reddish tint
}: PageHeroGridProps) {

    // Safety check
    if (!items || items.length === 0) return null;

    // Take max 6 items
    const displayItems = items.slice(0, 6);

    return (
        <section className="page-hero-grid py-8 px-[5%] pb-20 bg-white dark:bg-black relative overflow-hidden transition-colors duration-300">
            {/* Header Section */}
            <div className="text-center mb-10 relative z-[2]">
                <div className="animated-title-wrapper relative block mb-10 py-15 px-30 rounded-2xl w-full overflow-hidden bg-[rgba(255,250,250,0.95)] dark:bg-zinc-900 shadow-[0_10px_40px_rgba(0,0,0,0.1)] transition-colors duration-300" style={{
                    clipPath: 'inset(0)'
                }}>
                    {/* Background Animation */}
                    <div className="background-words absolute top-0 left-0 w-full h-full overflow-hidden rounded-2xl pointer-events-none z-[1]" style={{ clipPath: 'inset(0)' }}>
                        {/* Animated shadow gradient */}
                        <div className="absolute top-0 left-0 w-96 h-full z-[2] pointer-events-none animate-shadowMove" style={{
                            background: `linear-gradient(to right, transparent 0%, ${overlayColor} 20%, ${overlayColor} 50%, ${overlayColor} 80%, transparent 100%)`,
                            filter: 'blur(30px)'
                        }} />
                    </div>

                    <h1 className="animated-title font-serif text-3xl md:text-5xl font-bold mb-5 relative z-[3] tracking-wide leading-tight text-center whitespace-nowrap" style={{ color: accentColor }}>
                        {title}
                    </h1>
                    <div className="title-divider w-20 h-0.5 mx-auto mb-5 relative z-[3]" style={{ background: accentColor }} />
                    <p className="title-subtitle text-lg text-gray-600 dark:text-gray-400 m-0 font-normal tracking-wide relative z-[3] italic">
                        {subtitle}
                    </p>
                </div>
            </div>

            {/* Asymmetric Grid */}
            <div className="hero-grid-asymmetric grid gap-5 max-w-7xl mx-auto" style={{
                // We'll use responsiveness here directly via Tailwind classes or inline styles if needed
                // Defaulting to MD+ 2 columns, Mobile 1 column handled by standard CSS grid behavior
                // but for this specific layout we might want explicit inline styles for the exact look
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            }}>
                {/* 
                   For precise control of the "2 large, 2 small, 1 full" layout, we need to enforce desktop grid.
                   On mobile, we usually want stacking.
                */}
                <style jsx>{`
                    .hero-grid-asymmetric {
                        display: grid;
                        gap: 20px;
                        grid-template-columns: 1fr;
                    }
                    @media (min-width: 768px) {
                        .hero-grid-asymmetric {
                            grid-template-columns: repeat(2, 1fr);
                            grid-template-rows: auto auto auto;
                        }
                        .card-large { grid-row: span 1; min-height: 400px; }
                        .card-small { grid-row: span 1; min-height: 300px; }
                        .card-full { grid-column: 1 / -1; min-height: 350px; }
                    }
                `}</style>

                {displayItems.map((item, index) => {
                    // Logic: 0,1 = Large | 2,3 = Small | 5 = Full Width (if it exists)
                    // If we have fewer items, we adapt lightly.
                    const isLarge = index < 2;
                    const isFullWidth = index === 5; // The 6th item

                    // Simple logic for grid placement class
                    const cardClass = isFullWidth ? 'card-full' : (isLarge ? 'card-large' : 'card-small');

                    const description = item.description || item.content || '';

                    return (
                        <Link
                            key={item.id}
                            href={`${baseUrl}/${item.slug}`}
                            className={`hero-card relative rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl bg-white dark:bg-zinc-800 ${cardClass}`}
                            style={{
                                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
                                minHeight: '300px' // Mobile Default
                            }}
                        >
                            <div className="hero-card-image w-full h-full absolute top-0 left-0 overflow-hidden">
                                {item.coverImage ? (
                                    <Image
                                        src={item.coverImage}
                                        alt={item.title}
                                        fill
                                        className="object-cover transition-transform duration-500 hover:scale-110"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-200 dark:bg-zinc-700 flex items-center justify-center text-gray-400 dark:text-zinc-500">
                                        Görsel Yok
                                    </div>
                                )}
                            </div>

                            <div className="hero-card-overlay absolute bottom-0 left-0 right-0 z-[2] text-white" style={{
                                background: 'linear-gradient(to top, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.5) 50%, transparent 100%)',
                                padding: '40px 30px 30px'
                            }}>
                                {item.category && (
                                    <div className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: accentColor }}>
                                        {item.category}
                                    </div>
                                )}

                                <h3 className="hero-card-title font-serif text-2xl mb-2.5 text-white font-medium">
                                    {item.title}
                                </h3>

                                {description && (
                                    <div
                                        className="hero-card-description text-base leading-relaxed mb-4 line-clamp-2"
                                        style={{ color: 'rgba(255, 255, 255, 0.9)' }}
                                        dangerouslySetInnerHTML={{
                                            __html: description.substring(0, 100) + '...'
                                        }}
                                    />
                                )}

                                <span className="hero-card-link inline-flex items-center gap-2 font-semibold no-underline text-sm uppercase tracking-wide transition-all duration-300 hover:gap-3" style={{ color: accentColor }}>
                                    İncele
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M5 12h14M12 5l7 7-7 7" />
                                    </svg>
                                </span>
                            </div>
                        </Link>
                    );
                })}


            </div>
        </section>
    );
}
