import React, { useState } from 'react';
import { AltivioLogo } from './AltivioLogo';
import { ArrowUp, Shield, Lock, FileCode } from 'lucide-react';

export const Footer: React.FC = () => {
  const [modalType, setModalType] = useState<'privacy' | 'terms' | null>(null);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-purple-900 text-purple-200 py-16 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand Info */}
          <div className="md:col-span-4 space-y-4">
            <AltivioLogo size="md" theme="dark" />
            <p className="text-slate-400 text-xs max-w-sm leading-relaxed">
              Altivio turns big ideas into real products: AI tools, websites, mobile apps and brand design that lasts.
            </p>
            <div className="pt-2 flex items-center gap-4 text-slate-500 text-[11px] font-mono">
              <span>San Francisco · London · Zurich</span>
            </div>
          </div>

          {/* Quick Links Column 1: Core Services */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-semibold text-white uppercase tracking-wider text-[11px]">
              Services
            </h4>
            <ul className="space-y-2">
              <li><a href="#services" className="hover:text-purple-400 transition-colors">AI Solutions</a></li>
              <li><a href="#services" className="hover:text-purple-400 transition-colors">Mobile App Development</a></li>
              <li><a href="#services" className="hover:text-purple-400 transition-colors">Website Development</a></li>
              <li><a href="#services" className="hover:text-purple-400 transition-colors">Website & App Design</a></li>
              <li><a href="#services" className="hover:text-purple-400 transition-colors">Brand Identity & Strategy</a></li>
              <li><a href="#services" className="hover:text-purple-400 transition-colors">Packaging & Printed Goods</a></li>
            </ul>
          </div>

          {/* Quick Links Column 2: Navigation (matching user mockup links: Home, Advisors, Contact Services, Contact Us) */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-semibold text-white uppercase tracking-wider text-[11px]">
              Company
            </h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-purple-400 transition-colors">Home</a></li>
              <li><a href="#portfolio" className="hover:text-purple-400 transition-colors">Our Work</a></li>
              <li><a href="#testimonials" className="hover:text-purple-400 transition-colors">Client Success Stories</a></li>
              <li><a href="#estimator" className="hover:text-purple-400 transition-colors">Price Estimator</a></li>
              <li><a href="#approach" className="hover:text-purple-400 transition-colors">How We Work</a></li>
              <li><a href="#contact" className="hover:text-purple-400 transition-colors">Contact Services</a></li>
              <li><a href="#contact" className="hover:text-purple-400 transition-colors">Contact Us</a></li>
            </ul>
          </div>

          {/* Back to top & Guarantee */}
          <div className="md:col-span-2 space-y-4 flex flex-col justify-between">
            <div>
              <h4 className="font-semibold text-white uppercase tracking-wider text-[11px] mb-2">
                Our promise
              </h4>
              <p className="text-[11px] text-slate-500 leading-normal">
                You own 100% of everything we make for you: code, designs and files.
              </p>
            </div>

            <button
              onClick={scrollToTop}
              className="p-3 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl border border-slate-800 transition-colors flex items-center justify-between group cursor-pointer"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>

        </div>

        {/* Bottom copyright row matching user mockup */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <div>
            © 2026 Altivio, Inc. All rights reserved. Elevating Ideas into Digital Reality.
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => setModalType('privacy')}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => setModalType('terms')}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              Terms of Service
            </button>
          </div>
        </div>
      </div>

      {/* Privacy / Terms modal */}
      {modalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 text-slate-200 rounded-2xl max-w-lg p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-white text-lg">
                {modalType === 'privacy' ? 'Privacy Policy' : 'Terms of Service'}
              </h3>
              <button
                onClick={() => setModalType(null)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {modalType === 'privacy'
                ? 'Altivio is committed to strict data confidentiality. We do not sell, rent, or monetize your contact or project submission data. All technical schematics and briefs are protected under commercial non-disclosure agreements.'
                : 'All engineering deliverables, brand assets, source codes, and documentation delivered by Altivio become the exclusive intellectual property of the commissioning client upon final sprint settlement.'}
            </p>
            <div className="text-right">
              <button
                onClick={() => setModalType(null)}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
