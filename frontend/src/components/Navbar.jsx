import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiMenu, HiX } from 'react-icons/hi';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Home', to: '/#home' },
        { name: 'About', to: '/#about' },
        { name: 'Skills', to: '/#skills' },
        { name: 'Experience', to: '/#experience' },
        { name: 'Projects', to: '/#projects' },
        { name: 'Contact', to: '/#contact' },
    ];

    const handleScrollToSection = (id) => {
        setIsOpen(false);
        if (location.pathname !== '/') {
            return;
        }

        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    useEffect(() => {
        if (location.pathname === '/' && location.hash) {
            setTimeout(() => {
                const element = document.getElementById(location.hash.substring(1));
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            }, 100);
        }
    }, [location]);

    return (
        <nav
            className={`fixed top-0 left-0 right-0 w-full transition-all duration-300 ${scrolled || isOpen 
                ? 'bg-white/80 dark:bg-background-dark/80 backdrop-blur-md shadow-md' 
                : 'bg-transparent'
                }`}
            style={{ zIndex: 2147483647 }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16 relative" style={{ zIndex: 2147483648 }}>
                    {/* Logo Section */}
                    <Link
                        to="/"
                        onClick={() => {
                            if (location.pathname === '/') {
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }
                            setIsOpen(false);
                        }}
                        className="relative flex items-center space-x-3 cursor-pointer group"
                        style={{ zIndex: 2147483649 }}
                    >
                        <img src="/logo.png" alt="Awanish Logo" className="h-10 w-10 object-cover rounded-full shadow-sm group-hover:scale-105 transition-transform" />
                        <span className="text-2xl font-bold text-primary tracking-tight">Awanish</span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden xl:flex items-center space-x-8 relative" style={{ zIndex: 2147483649 }}>
                        {navLinks.map((link) => (
                            location.pathname === '/' && link.to.startsWith('/#') ? (
                                <button
                                    key={link.name}
                                    onClick={() => handleScrollToSection(link.to.substring(2))}
                                    className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors font-medium"
                                >
                                    {link.name}
                                </button>
                            ) : (
                                <Link
                                    key={link.name}
                                    to={link.to}
                                    className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors font-medium"
                                >
                                    {link.name}
                                </Link>
                            )
                        ))}
                        <ThemeToggle />
                    </div>

                    {/* Mobile Menu Button - Ultra High Visibility */}
                    <div className="xl:hidden relative flex items-center space-x-4 z-50 mr-2" style={{ zIndex: 2147483650 }}>
                        <ThemeToggle />
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-2 rounded-md focus:outline-none cursor-pointer text-gray-900 dark:text-gray-100 bg-white dark:bg-neutral-800 shadow-lg border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-700 flex items-center justify-center transform hover:scale-105 transition-transform"
                            aria-label="Toggle menu"
                        >
                            {isOpen ? <HiX size={28} /> : <HiMenu size={28} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="xl:hidden bg-white dark:bg-background-dark border-t border-gray-100 dark:border-neutral-800 shadow-2xl absolute w-full left-0 top-16 overflow-hidden"
                        style={{ zIndex: 2147483646 }}
                    >
                        <div className="px-4 py-4 space-y-3 relative z-50">
                            {navLinks.map((link) => (
                                location.pathname === '/' && link.to.startsWith('/#') ? (
                                    <button
                                        key={link.name}
                                        onClick={() => handleScrollToSection(link.to.substring(2))}
                                        className="block w-full text-left px-4 py-3 text-base font-bold text-gray-800 dark:text-gray-200 hover:text-primary hover:bg-gray-50 dark:hover:bg-neutral-800 rounded-lg transition-colors border border-transparent hover:border-gray-100 dark:hover:border-neutral-700"
                                    >
                                        {link.name}
                                    </button>
                                ) : (
                                    <Link
                                        key={link.name}
                                        to={link.to}
                                        onClick={() => setIsOpen(false)}
                                        className="block w-full text-left px-4 py-3 text-base font-bold text-gray-800 dark:text-gray-200 hover:text-primary hover:bg-gray-50 dark:hover:bg-slate-800 rounded-lg transition-colors border border-transparent hover:border-gray-100 dark:hover:border-slate-700"
                                    >
                                        {link.name}
                                    </Link>
                                )
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
