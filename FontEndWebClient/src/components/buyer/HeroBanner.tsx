import React from 'react';

interface HeroBannerProps {
    title: string;
    subtitle: string;
    description: string;
    imageUrl: string;
    ctaText?: string;
    ctaSecondaryText?: string;
    onCtaClick?: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
    title,
    subtitle,
    description,
    imageUrl,
    ctaText = 'Shop Now',
    ctaSecondaryText = 'Learn More',
    onCtaClick
}) => {
    return (
        <section className="w-full">
            <div className="relative overflow-hidden rounded-2xl shadow-lg bg-gray-900 group h-[300px] sm:h-[400px] lg:h-[480px]">
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                    style={{ backgroundImage: `url('${imageUrl}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>

                <div className="relative h-full flex flex-col justify-center px-6 sm:px-12 lg:px-16 max-w-3xl">
                    <span className="inline-block px-3 py-1 mb-4 text-xs font-bold tracking-wider text-green-100 uppercase bg-primary/90 rounded-full w-fit">
                        {subtitle}
                    </span>

                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight mb-4 drop-shadow-md">
                        {title.split('\n')[0]}
                        {title.includes('\n') && (
                            <>
                                <br className="hidden sm:block" />
                                <span className="text-green-400">{title.split('\n')[1]}</span>
                            </>
                        )}
                    </h1>

                    <p className="text-gray-200 text-base sm:text-lg mb-8 max-w-lg font-medium">
                        {description}
                    </p>

                    <div className="flex gap-4">
                        <button
                            onClick={onCtaClick}
                            className="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-8 rounded-lg transition-all shadow-lg hover:shadow-green-900/20 flex items-center gap-2"
                        >
                            {ctaText}
                            <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        </button>
                        <button className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold py-3 px-6 rounded-lg transition-all border border-white/30">
                            {ctaSecondaryText}
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};
