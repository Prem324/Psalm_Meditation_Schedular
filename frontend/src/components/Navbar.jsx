import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Menu, X as CloseIcon } from 'lucide-react';

const Navbar = () => {
    const { admin, logout } = useAuth();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        setIsMenuOpen(false);
        navigate('/');
    };

    const navLinks = [
        { name: 'Schedule', path: '/' },
        ...(admin ? [{ name: 'Dashboard', path: '/dashboard' }] : []),
    ];

    return (
        <nav className="bg-white/30 backdrop-blur-md border-b border-stone-200/50 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="text-xl font-bold font-serif text-amber-900">
                            Psalms Meditation
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className="text-stone-600 hover:text-amber-800 font-medium transition-colors"
                            >
                                {link.name}
                            </Link>
                        ))}
                        {admin ? (
                            <button
                                onClick={handleLogout}
                                className="flex items-center text-stone-600 hover:text-red-600 font-medium transition-colors"
                            >
                                <LogOut className="w-4 h-4 mr-1" /> Logout
                            </button>
                        ) : (
                            <Link
                                to="/login"
                                className="flex items-center text-stone-600 hover:text-amber-800 font-medium transition-colors"
                            >
                                <User className="w-4 h-4 mr-1" /> Admin
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-stone-600 hover:text-amber-800 p-2"
                        >
                            {isMenuOpen ? <CloseIcon className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isMenuOpen && (
                <div className="md:hidden bg-white/95 backdrop-blur-lg border-b border-stone-200 shadow-xl overflow-hidden animate-in slide-in-from-top duration-300">
                    <div className="px-4 pt-2 pb-6 space-y-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                onClick={() => setIsMenuOpen(false)}
                                className="block px-3 py-4 text-base font-medium text-stone-700 hover:text-amber-800 hover:bg-amber-50 rounded-lg transition-all"
                            >
                                {link.name}
                            </Link>
                        ))}
                        {admin ? (
                            <button
                                onClick={handleLogout}
                                className="w-full text-left px-3 py-4 text-base font-medium text-red-600 hover:bg-red-50 rounded-lg transition-all flex items-center"
                            >
                                <LogOut className="w-5 h-5 mr-2" /> Logout
                            </button>
                        ) : (
                            <Link
                                to="/login"
                                onClick={() => setIsMenuOpen(false)}
                                className="block px-3 py-4 text-base font-medium text-stone-700 hover:text-amber-800 hover:bg-amber-50 rounded-lg transition-all flex items-center"
                            >
                                <User className="w-5 h-5 mr-2" /> Admin
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
