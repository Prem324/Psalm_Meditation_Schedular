import React from "react";

const Hero = () => {
  return (
    <div className="relative overflow-hidden bg-transparent py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-7xl font-serif mb-6">
          <span className="bg-clip-text text-transparent bg-linear-to-r from-amber-900 via-amber-800 to-amber-900 drop-shadow-sm">
            Psalms Meditation
          </span>
        </h1>
        <div className="relative inline-block">
          <p className="text-lg sm:text-3xl leading-relaxed text-stone-800 font-[Crimson_Text] italic font-semibold max-w-2xl mx-auto">
            "Your word is a lamp to my feet and a light to my path"
          </p>
          <p className="mt-2 text-amber-900/70 font-serif italic text-sm sm:text-lg tracking-widest">
            — Psalm 119:105 —
          </p>
        </div>
      </div>
    </div>
  );
};

export default Hero;
