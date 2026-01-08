'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import Image from 'next/image';
import Link from 'next/link';
import 'swiper/css';
import 'swiper/css/navigation';

interface SliderItem {
    id: string;
    title: string;
    slug: string;
    coverImage?: string;
    date?: Date;
    type?: string;
}

interface HorizontalSliderProps {
    items: SliderItem[];
    title: string;
    accentColor?: 'yellow' | 'red' | 'blue';
    baseUrl: string;
    aspectRatio?: 'default' | 'square' | 'portrait';
}

export default function HorizontalSlider({
    items,
    title,
    accentColor = 'yellow',
    baseUrl,
    aspectRatio = 'default'
}: HorizontalSliderProps) {
    const colorClasses = {
        yellow: '#d4af37',
        red: '#9d0919',
        blue: '#3735f9'
    };

    const accentClass = colorClasses[accentColor];

    // Exact dimensions from original CSS
    const cardDimensions = {
        default: { width: 300, height: 180 },
        square: { width: 250, height: 250 },
        portrait: { width: 220, height: 320 }
    };

    const dims = cardDimensions[aspectRatio];

    return (
        <div className="mb-15">
            <h2 className="font-serif text-4xl mb-8" style={{ color: '#1a1a1a', fontWeight: 500 }}>
                {title}
            </h2>

            <div className="relative">
                <Swiper
                    modules={[Navigation]}
                    spaceBetween={20}
                    slidesPerView="auto"
                    navigation
                    className="netflix-row"
                    style={{
                        overflowX: 'auto',
                        overflowY: 'visible',
                        padding: '20px 0 60px 0'
                    }}
                >
                    {items.map((item) => (
                        <SwiperSlide
                            key={item.id}
                            style={{
                                width: `${dims.width}px`,
                                flexShrink: 0
                            }}
                        >
                            <Link href={`${baseUrl}/${item.slug}`}>
                                <div
                                    className="netflix-card relative rounded-lg cursor-pointer bg-white overflow-hidden transition-all duration-300 hover:scale-115 hover:z-100"
                                    style={{
                                        width: `${dims.width}px`,
                                        height: `${dims.height}px`,
                                        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
                                    }}
                                >
                                    <div className="relative w-full h-full">
                                        {item.coverImage ? (
                                            <Image
                                                src={item.coverImage}
                                                alt={item.title}
                                                fill
                                                className="object-cover rounded-lg"
                                                style={{
                                                    minWidth: '100%',
                                                    minHeight: '100%'
                                                }}
                                            />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center bg-gray-200 text-gray-400">
                                                Görsel Yok
                                            </div>
                                        )}
                                    </div>

                                    <div
                                        className={`card-info absolute bottom-0 left-0 w-full p-4 rounded-b-lg transition-opacity duration-300 ${aspectRatio === 'square' ? 'opacity-100' : 'opacity-0 hover:opacity-100'}`}
                                        style={{
                                            background: 'linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent)'
                                        }}
                                    >
                                        <h4 className="text-white text-base mb-1 font-semibold">
                                            {item.title}
                                        </h4>
                                        {item.date && (
                                            <span className="text-sm font-medium" style={{ color: accentClass }}>
                                                {new Date(item.date).toLocaleDateString('tr-TR')}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    );
}
