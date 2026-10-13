import React, { useState } from 'react';
import { ArrowRight, ArrowUp, X } from 'lucide-react';
import { AltivioLogo } from './AltivioLogo';
import { SERVICE_CATEGORIES } from '../data/servicesData';

// Fill these in when Altivio's real details are ready. Empty values are hidden on the site.
const CONTACT_EMAIL = '';
const SOCIAL_LINKS: { label: string; href: string }[] = [];

const OFFICES = ['San Francisco', 'London', 'Zurich'];

const COMPANY_LINKS = [
  { label: 'Our Work', href: '#portfolio' },
  { label: 'AI Solutions', href: '#ai-solutions' },
  { label: 'How We Work', href: '#approach' },
  { label: 'Cost Estimator', href: '#estimator' },
  { label: 'Contact', href: '#contact' },
];

// Tells the Services section which category tab to open, then scrolls to it.
const SERVICES_CATEGORY_EVENT = 'altivio:services-category';
const openServicesCategory = (categoryId: string) => {
  window.dispatchEvent(new CustomEvent(SERVICES_CATEGORY_EVENT, { detail: categoryId }));
  document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
};

const linkClass = 'text-[15px] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors';

export const Footer: React.FC = () => {
  const [modalType, setModalType] = useState<'privacy' | 'terms' | null>(null);

  return (
    <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 md:pt-20 pb-10">
        <div className="grid grid-cols-2 lg:grid-cols-[minmax(0,4fr)_repeat(3,minmax(0,2fr))] gap-x-8 gap-y-12">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-1 max-w-sm">
            <AltivioLogo size="md" />
            <p className="mt-5 text-[15px] leading-relaxed text-slate-600 dark:text-slate-400">
              We turn big ideas into real products: AI tools, websites, mobile apps and lasting brands. You own
              everything we make for you.
            </p>
            <a href="#contact" className="btn-ink mt-6 h-11 px-6 text-[15px] inline-flex items-center gap-2 group">
              <span>Get a proposal</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </a>
          </div>

          {/* Services, by category */}
          <nav aria-label="Services">
            <h3 className="text-sm font-medium text-slate-900 dark:text-white">Services</h3>
            <ul className="mt-4 space-y-3">
              {SERVICE_CATEGORIES.filter((c) => c.id !== 'all').map((category) => (
                <li key={category.id}>
                  <a
                    href="#services"
                    onClick={(e) => {
                      e.preventDefault();
                      openServicesCategory(category.id);
                    }}
                    className={linkClass}
                  >
                    {category.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Company */}
          <nav aria-label="Company">
            <h3 className="text-sm font-medium text-slate-900 dark:text-white">Company</h3>
            <ul className="mt-4 space-y-3">
              {COMPANY_LINKS.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className={linkClass}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div className="col-span-2 sm:col-span-1">
            <h3 className="text-sm font-medium text-slate-900 dark:text-white">Contact</h3>
            <ul className="mt-4 space-y-3">
              {CONTACT_EMAIL && (
                <li>
                  <a href={`mailto:${CONTACT_EMAIL}`} className={linkClass}>
                    {CONTACT_EMAIL}
                  </a>
                </li>
              )}
              <li>
                <a href="#contact" className={linkClass}>
                  Send us a message
                </a>
              </li>
              <li className="text-[15px] text-slate-600 dark:text-slate-400">{OFFICES.join(', ')}</li>
              {SOCIAL_LINKS.length > 0 && (
                <li className="flex flex-wrap gap-x-4 gap-y-2 pt-1">
                  {SOCIAL_LINKS.map((social) => (
                    <a key={social.label} href={social.href} target="_blank" rel="noreferrer" className={linkClass}>
                      {social.label}
                    </a>
                  ))}
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom row */}
        <div className="mt-14 md:mt-16 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-sm text-slate-500 dark:text-slate-400">
          <span>© 2026 Altivio, Inc. All rights reserved.</span>
          <div className="flex items-center gap-6">
            <button onClick={() => setModalType('privacy')} className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer">
              Privacy
            </button>
            <button onClick={() => setModalType('terms')} className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer">
              Terms
            </button>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="inline-flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer group"
            >
              Back to top
              <ArrowUp className="w-3.5 h-3.5 transition-transform group-hover:-translate-y-0.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Privacy / Terms modal */}
      {modalType && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="legal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm"
          onClick={() => setModalType(null)}
        >
          <div
            className="bg-white dark:bg-slate-900 rounded-[20px] max-w-lg w-full p-6 sm:p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-4">
              <h3 id="legal-title" className="font-display text-2xl text-slate-900 dark:text-white">
                {modalType === 'privacy' ? 'Privacy Policy' : 'Terms of Service'}
              </h3>
              <button
                onClick={() => setModalType(null)}
                aria-label="Close"
                className="p-1.5 rounded-full text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="mt-4 text-[15px] text-slate-600 dark:text-slate-400 leading-relaxed">
              {modalType === 'privacy'
                ? 'Altivio is committed to strict data confidentiality. We do not sell, rent, or monetize your contact or project submission data. All technical schematics and briefs are protected under commercial non-disclosure agreements.'
                : 'All engineering deliverables, brand assets, source codes, and documentation delivered by Altivio become the exclusive intellectual property of the commissioning client upon final sprint settlement.'}
            </p>
            <div className="mt-6 text-right">
              <button onClick={() => setModalType(null)} className="btn-ink h-10 px-5 text-sm cursor-pointer">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
