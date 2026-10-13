import React, { useState, useEffect } from 'react';
import { AltivioLogo } from './AltivioLogo';
import { useTheme } from '../context/ThemeContext';
import { Menu, X, ArrowUpRight, Sun, Moon } from 'lucide-react';

interface NavbarProps {
  onOpenEstimator?: () => void;
  onSelectService?: (serviceId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenEstimator }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md transition-shadow duration-300 ${
        isScrolled ? 'shadow-[0_1px_0_rgba(23,23,28,0.08)] dark:shadow-[0_1px_0_rgba(255,255,255,0.06)]' : ''
      }`}
    >
      {/* Announcement bar */}
      <div className="bg-slate-900 dark:bg-black text-white text-[13px] sm:text-sm">
        <div className="max-w-7xl mx-auto px-4 h-9 flex items-center justify-center gap-3 text-center">
          <span className="truncate">New: plan your project and get a price in minutes</span>
          <a
            href="#estimator"
            onClick={onOpenEstimator}
            className="hidden sm:inline underline underline-offset-4 decoration-white/50 hover:decoration-white whitespace-nowrap"
          >
            Get an estimate
          </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Zone 1: Single element Brand Zone */}
          <a
            href="#"
            className="flex items-center group cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-purple-600 rounded-lg px-1 py-0.5"
            aria-label="Altivio Home"
          >
            <AltivioLogo size="md" />
          </a>

          {/* Zone 2: 4-6 clean text navigation links */}
          <nav className="hidden md:flex items-center gap-5 lg:gap-8 text-[14px] lg:text-[15px] text-slate-900 dark:text-slate-200">
            <a
              href="#services"
              className="hover:text-purple-600 dark:hover:text-purple-300 transition-colors relative py-1"
            >
              Services
            </a>
            <a
              href="#portfolio"
              className="hover:text-purple-600 dark:hover:text-purple-300 transition-colors relative py-1"
            >
              Portfolio
            </a>
            <a
              href="#estimator"
              className="hover:text-purple-600 dark:hover:text-purple-300 transition-colors relative py-1"
            >
              Cost Estimator
            </a>
            <a
              href="#approach"
              className="hover:text-purple-600 dark:hover:text-purple-300 transition-colors relative py-1"
            >
              How We Work
            </a>
            <a
              href="#contact"
              className="hover:text-purple-600 dark:hover:text-purple-300 transition-colors relative py-1"
            >
              Contact
            </a>
          </nav>

          {/* Zone 3: 1-2 primary actions + Dark Mode Toggle */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Dark Mode Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-[10px] text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors duration-200 cursor-pointer flex items-center justify-center group"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 transition-transform duration-300 group-hover:rotate-45" />
              ) : (
                <Moon className="w-4 h-4 transition-transform duration-300 group-hover:-rotate-12" />
              )}
            </button>

            <a
              href="#estimator"
              onClick={onOpenEstimator}
              className="hidden xl:inline-flex px-2 h-10 items-center text-[15px] text-slate-900 dark:text-slate-100 hover:text-purple-600 dark:hover:text-purple-300 transition-colors whitespace-nowrap cursor-pointer"
            >
              Get an estimate
            </a>
            <a
              href="#contact"
              className="px-5 h-10 text-[15px] btn-ink transition-colors whitespace-nowrap flex items-center gap-1 cursor-pointer"
            >
              <span>Get a proposal</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Mobile menu trigger + mobile theme toggle */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700" />
              )}
            </button>
            <a
              href="#contact"
              className="px-3 py-1.5 text-xs font-semibold btn-ink whitespace-nowrap"
            >
              Get a proposal
            </a>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900 rounded-lg"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/98 dark:bg-slate-950/98 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800 px-6 py-5 shadow-lg animate-in fade-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col gap-4 text-base font-medium text-slate-800 dark:text-slate-200">
            <a
              href="#services"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-slate-950 dark:hover:text-white"
            >
              Services (16)
            </a>
            <a
              href="#portfolio"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-slate-950 dark:hover:text-white"
            >
              Portfolio & Demos
            </a>
            <a
              href="#estimator"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-slate-950 dark:hover:text-white"
            >
              Interactive Cost Estimator
            </a>
            <a
              href="#approach"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-slate-950 dark:hover:text-white"
            >
              How We Work
            </a>
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-slate-950 dark:hover:text-white"
            >
              Contact Us
            </a>
          </nav>
          <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2.5">
            <button
              onClick={toggleTheme}
              className="w-full py-2.5 px-3 text-xs font-semibold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg flex items-center justify-between"
            >
              <span>Color Theme</span>
              <span className="flex items-center gap-1.5 capitalize text-purple-700 dark:text-purple-400 font-bold">
                {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
                {theme} Mode
              </span>
            </button>
            <a
              href="#estimator"
              onClick={() => {
                setMobileMenuOpen(false);
                if (onOpenEstimator) onOpenEstimator();
              }}
              className="w-full text-center py-2.5 text-xs font-semibold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-900 rounded-lg"
            >
              Get an estimate
            </a>
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 text-xs font-semibold text-slate-950 btn-ink rounded-lg"
            >
              Get a proposal
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
