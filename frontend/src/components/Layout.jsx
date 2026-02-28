import React from 'react';
import Navbar from './Navbar';
import { Toaster } from 'react-hot-toast';

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col relative">
            <div className="page-overlay"></div>
            <Navbar />
            <main className="flex-grow relative z-10">
                {children}
            </main>
            <Toaster position="bottom-right" />
            <footer className="py-10 border-t border-stone-200/50 bg-white/30 backdrop-blur-sm text-center text-stone-600 text-sm relative z-10">
                <div className="max-w-7xl mx-auto px-6">
                    <p className="font-serif italic text-amber-900/60 mb-2">"Wait for the Lord; be strong and take heart and wait for the Lord." — Psalm 27:14</p>
                    <p>© {new Date().getFullYear()} Church Psalms Meditation Scheduler</p>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
