import React, { useEffect, useState } from 'react';

const SplashScreen = ({ onFinish }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        // Show splash screen for 3 seconds (including fade-out transition)
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(() => onFinish(), 500); // Wait for the transition out to complete
        }, 2500);

        return () => clearTimeout(timer);
    }, [onFinish]);

    return (
        <div
            className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-stone-950 transition-opacity duration-500 ${
                isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
        >
            <div className="relative flex flex-col items-center animate-fade-in-up">
                {/* Glow behind the logo */}
                <div className="absolute inset-0 top-[-20px] blur-[60px] bg-amber-600/30 rounded-full scale-[1.5] animate-pulse"></div>
                
                {/* Logo container with glassmorphism */}
                <div className="relative z-10 w-36 h-36 p-1 bg-white/5 backdrop-blur-xl rounded-full border border-white/10 shadow-[0_0_40px_rgba(217,119,6,0.2)] flex items-center justify-center overflow-hidden mb-8">
                    <img
                        src="/logo.png"
                        alt="Psalms Meditation Logo"
                        className="w-full h-full object-cover rounded-full"
                    />
                </div>

                <h1 className="relative z-10 text-3xl font-serif font-bold text-white tracking-wide text-center">
                    Psalms <span className="text-amber-500">Meditation</span>
                </h1>
                <div className="relative z-10 mt-3 w-12 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent rounded-full opacity-70"></div>
                <p className="relative z-10 mt-4 text-stone-400 font-serif italic max-w-xs text-center text-sm">
                    "Wait for the Lord; be strong and take heart and wait for the Lord."<br/>— Psalm 27:14
                </p>
            </div>
        </div>
    );
};

export default SplashScreen;
