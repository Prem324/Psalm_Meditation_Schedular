import React from 'react';

const Hero = () => {
    return (
        <div className="relative overflow-hidden bg-transparent py-16 sm:py-24">
            <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
                <h1 className="text-5xl font-bold tracking-tight sm:text-7xl font-serif mb-6">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-900 via-amber-800 to-amber-900 drop-shadow-sm">
                        Church Psalms Meditation
                    </span>
                </h1>
                <div className="relative inline-block">
                    <p className="text-2xl sm:text-3xl leading-relaxed text-stone-800 font-[Crimson_Text] italic font-semibold max-w-2xl mx-auto">
                        "Your word is a lamp to my feet and a light to my path"
                    </p>
                    <p className="mt-2 text-amber-900/70 font-serif italic text-lg tracking-widest uppercase">
                        — Psalm 119:105 —
                    </p>
                </div>
            </div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-amber-800/30 to-transparent"></div>
        </div>
    );
};

export default Hero;
