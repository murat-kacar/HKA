'use client';

import { useState, useRef, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import Link from 'next/link';
import { Volume2, VolumeX } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface HeroSlide {
    title: string;
    subtitle: string;
    mediaUrl: string;
    isVideo: boolean;
    category: string;
    link: string;
    theme: 'theater' | 'workshop' | 'workshops';
}

interface HeroProps {
    slides?: HeroSlide[];
}

export default function Hero({ slides }: HeroProps) {
    const [isMuted, setIsMuted] = useState(true);
    const [mounted, setMounted] = useState(false);
    const videoRefs = useRef<Map<number, HTMLVideoElement>>(new Map());

    useEffect(() => {
        setMounted(true);
    }, []);

    const toggleMute = (index: number) => {
        const video = videoRefs.current.get(index);
        if (video) {
            video.muted = !video.muted;
            setIsMuted(video.muted);
        }
    };

    const defaultSlides: HeroSlide[] = slides || [
        {
            title: 'Profesyonel <br/><i>Eğitim</i>',
            subtitle: 'Sanatın her alanında uzman eğitmenlerimizle birlikte yeteneklerinizi geliştirin ve kendinizi keşfedin.',
            mediaUrl: '/assets/videos/hero-video.mp4',
            isVideo: true,
            category: 'Atölyeler',
            link: '/egitimler',
            theme: 'workshop'
        }
    ];

    if (!mounted) return null;

    return (
        <header id="hero-section" className="pt-0 mt-20 bg-transparent overflow-x-hidden w-full max-w-full">
            <div
                id="theater-banner-wrapper"
                data-theme={defaultSlides[0].theme}
                className="w-full max-w-full relative overflow-hidden transition-colors duration-600"
                style={{
                    height: 'calc(35vw)',
                    minHeight: '450px',
                    maxHeight: 'calc(100vh - 80px)',
                    backgroundColor: 'var(--banner-bg)',
                    color: '#f5f5f5'
                }}
            >
                {/* Noise Texture */}
                <div
                    className="noise-texture absolute inset-0 opacity-12 pointer-events-none z-[2]"
                    style={{
                        backgroundImage: 'url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=)'
                    }}
                />

                {/* Gradient Overlay */}
                <div
                    className="absolute inset-0 z-[1] pointer-events-none transition-all duration-600"
                    style={{
                        background: 'var(--banner-gradient)'
                    }}
                />

                <Swiper
                    modules={[Navigation, Pagination, Autoplay]}
                    pagination={{
                        clickable: true,
                        el: '.hero-pagination'
                    }}
                    navigation={{
                        nextEl: '.hero-next',
                        prevEl: '.hero-prev'
                    }}
                    autoplay={{ delay: 7000, disableOnInteraction: false }}
                    loop={defaultSlides.length > 1}
                    className="w-full h-full relative z-[5] hero-swiper"
                >
                    {defaultSlides.map((slide, index) => (
                        <SwiperSlide key={index} className="flex items-center justify-center">
                            <div className="slide-content w-full h-full grid items-center" style={{ gridTemplateColumns: '1fr 1.6fr' }}>
                                {/* Text Sector */}
                                <div className="text-sector flex flex-col justify-center relative z-10 h-full transition-colors duration-600" style={{ padding: '0 4vw 0 6vw', color: 'var(--banner-text-color)' }}>
                                    <div className="category-tag text-xs uppercase tracking-[3px] mb-4 mt-4 opacity-0 translate-y-5 transition-all duration-600" style={{ color: 'var(--banner-accent)' }}>
                                        {slide.category}
                                    </div>
                                    <h2
                                        className="show-title font-serif text-6xl leading-tight mb-6 opacity-0 translate-y-8 transition-all duration-800 delay-100"
                                        dangerouslySetInnerHTML={{ __html: slide.title }}
                                    />
                                    <p className="description text-base leading-relaxed opacity-90 mb-10 max-w-md opacity-0 translate-y-5 transition-all duration-800 delay-200 border-l pl-6" style={{ borderColor: 'var(--banner-border-color)' }}>
                                        {slide.subtitle}
                                    </p>
                                    <Link
                                        href={slide.link}
                                        className="action-btn inline-block px-9 py-3.5 border rounded-full no-underline text-xs uppercase tracking-wide transition-all duration-300 self-start backdrop-blur-sm opacity-0 translate-y-5 delay-300"
                                        style={{
                                            borderColor: 'var(--banner-btn-border)',
                                            color: 'var(--banner-text-color)',
                                            background: 'var(--banner-btn-bg)'
                                        }}
                                    >
                                        Daha Fazla Bilgi
                                    </Link>
                                </div>

                                {/* Media Sector */}
                                <div className="media-sector w-full h-full relative overflow-hidden bg-black">
                                    {slide.isVideo ? (
                                        <>
                                            <video
                                                ref={(el) => {
                                                    if (el) videoRefs.current.set(index, el);
                                                }}
                                                autoPlay
                                                loop
                                                muted
                                                playsInline
                                                className="w-full h-full absolute top-0 left-0 z-[2] scale-100 transition-transform duration-[2000ms] ease-out shadow-[0_0_80px_rgba(0,0,0,0.8)]"
                                                style={{ objectFit: 'contain' }}
                                            >
                                                <source src={slide.mediaUrl} type="video/mp4" />
                                            </video>

                                            {/* Sound Toggle */}
                                            <button
                                                onClick={() => toggleMute(index)}
                                                className="video-sound-toggle absolute top-5 right-5 w-12 h-12 rounded-full backdrop-blur-md border-2 cursor-pointer flex items-center justify-center z-10 transition-all duration-300 p-0 hover:scale-110"
                                                style={{
                                                    background: 'rgba(0, 0, 0, 0.5)',
                                                    borderColor: 'rgba(255, 255, 255, 0.3)',
                                                    color: 'white'
                                                }}
                                                aria-label="Toggle sound"
                                            >
                                                {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                                            </button>
                                        </>
                                    ) : (
                                        <img
                                            src={slide.mediaUrl}
                                            alt={slide.title.replace(/<[^>]*>/g, '')}
                                            className="w-full h-full object-cover scale-110 transition-transform duration-[2000ms] ease-out relative z-[2]"
                                        />
                                    )}
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>

                {/* Navigation Arrows */}
                <div className="slider-nav absolute bottom-12 right-[6vw] flex gap-5 z-10">
                    <div className="hero-prev nav-arrow w-15 h-15 border rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 backdrop-blur-sm hover:scale-110" style={{ borderColor: 'rgba(255, 255, 255, 0.2)', background: 'rgba(0, 0, 0, 0.2)', color: 'white' }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M15 18l-6-6 6-6" />
                        </svg>
                    </div>
                    <div className="hero-next nav-arrow w-15 h-15 border rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 backdrop-blur-sm hover:scale-110" style={{ borderColor: 'rgba(255, 255, 255, 0.2)', background: 'rgba(0, 0, 0, 0.2)', color: 'white' }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M9 18l6-6-6-6" />
                        </svg>
                    </div>
                </div>

                {/* Pagination */}
                <div className="hero-pagination absolute bottom-12 left-[6vw] z-10 flex gap-2.5" />
            </div>
        </header>
    );
}
