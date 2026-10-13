import React from 'react';
import { ArrowDown, ArrowRight } from 'lucide-react';
import { Reveal } from './Reveal';
import digitalWorkImage from '../assets/images/altivio_telemedicine_case_1790419310693.jpg';
import brandWorkImage from '../assets/images/altivio_luxury_packaging_case_1790419338324.jpg';

interface HeroProps {
  onExploreClick: () => void;
  onEstimateClick: () => void;
}

const METRICS = [
  { value: '16', label: 'Services under one roof' },
  { value: '100%', label: 'Built by our own team, never outsourced' },
  { value: '$180M+', label: 'Raised from investors by our clients' },
  { value: '4.9', label: 'Average client rating out of 5' },
];

// Client marks: a simple geometric monogram per client, drawn in the current text colour
// so they read correctly in light and dark mode.
const CLIENTS: { name: string; initials: string; shape: 'circle' | 'square' | 'diamond' | 'arch' }[] = [
  { name: 'PulseCare Health', initials: 'P', shape: 'circle' },
  { name: 'Aura Financial', initials: 'A', shape: 'arch' },
  { name: 'Cognitive Dynamics', initials: 'CD', shape: 'square' },
  { name: 'Aethelgard Paris', initials: 'Æ', shape: 'diamond' },
];

const ClientMark: React.FC<{ initials: string; shape: (typeof CLIENTS)[number]['shape'] }> = ({ initials, shape }) => (
  <svg viewBox="0 0 32 32" className="w-8 h-8 shrink-0" aria-hidden="true">
    {shape === 'circle' && <circle cx="16" cy="16" r="15" fill="currentColor" />}
    {shape === 'square' && <rect x="1" y="1" width="30" height="30" rx="7" fill="currentColor" />}
    {shape === 'diamond' && <rect x="5" y="5" width="22" height="22" rx="3" transform="rotate(45 16 16)" fill="currentColor" />}
    {shape === 'arch' && <path d="M1 31V16a15 15 0 0 1 30 0v15z" fill="currentColor" />}
    <text
      x="16"
      y="17"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={initials.length > 1 ? 11 : 15}
      fontWeight="600"
      fontFamily="'Space Grotesk', sans-serif"
      className="fill-white dark:fill-slate-950"
    >
      {initials}
    </text>
  </svg>
);

export const Hero: React.FC<HeroProps> = ({ onExploreClick, onEstimateClick }) => {
  return (
    <section className="relative pt-32 md:pt-44 pb-16 md:pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <Reveal immediate>
            <h1 className="text-[clamp(2.75rem,7.5vw,5.5rem)] leading-[1] text-slate-800 dark:text-white text-balance max-w-5xl mx-auto mb-7">
              Elevating ideas into digital reality.
            </h1>
          </Reveal>

          <Reveal immediate delay={0.08}>
            <p className="text-base sm:text-lg leading-relaxed text-slate-700 dark:text-slate-300 max-w-xl mx-auto mb-9">
              Altivio helps growing businesses build apps, websites and AI tools, and creates brands people remember.
            </p>
          </Reveal>

          <Reveal immediate delay={0.16}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={onExploreClick}
                className="btn-ink w-full sm:w-auto h-12 px-7 text-[15px] flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>Explore services</span>
                <ArrowDown className="w-4 h-4 transition-transform group-hover:translate-y-0.5" />
              </button>
              <button
                onClick={onEstimateClick}
                className="w-full sm:w-auto h-12 px-7 text-[15px] text-slate-900 dark:text-slate-100 border border-slate-900 dark:border-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 active:scale-[0.98] rounded-full transition-[background-color,transform] flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>Get an estimate</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
          </Reveal>
        </div>

        {/* Showcase: real client work, digital product in front, brand and packaging behind */}
        <Reveal immediate delay={0.24}>
          <div className="relative mt-14 md:mt-20 h-[clamp(320px,50vw,620px)] rounded-[24px] overflow-hidden cohere-media">
            <img
              src={digitalWorkImage}
              alt="PulseCare online clinic app shown on a laptop and a phone"
              width={1200}
              height={896}
              fetchPriority="high"
              className="absolute left-4 right-4 top-6 sm:right-auto sm:left-[6%] sm:top-[9%] sm:w-[62%] aspect-[4/3] object-cover rounded-2xl shadow-[0_30px_80px_-24px_rgba(13,26,15,0.6)]"
            />
            <img
              src={brandWorkImage}
              alt="Aethelgard shopping bag, clothing tags and lookbook"
              width={1200}
              height={896}
              loading="lazy"
              className="hidden sm:block absolute right-[5%] bottom-[8%] w-[34%] aspect-[4/3] object-cover rounded-2xl shadow-[0_30px_70px_-24px_rgba(13,26,15,0.6)]"
            />
          </div>
        </Reveal>

        {/* Trusted by */}
        <Reveal className="mt-16 md:mt-20 text-center">
          <p className="text-[15px] text-slate-700 dark:text-slate-300">
            Trusted by growing businesses and the investors behind them
          </p>
          <ul className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-7 items-center text-slate-500 dark:text-slate-400">
            {CLIENTS.map((client) => (
              <li key={client.name} className="flex items-center justify-center gap-2.5">
                <ClientMark initials={client.initials} shape={client.shape} />
                <span className="font-display text-base sm:text-lg tracking-tight">{client.name}</span>
              </li>
            ))}
          </ul>
        </Reveal>

        {/* Metrics */}
        <Reveal className="mt-16 md:mt-20 rounded-[24px] bg-slate-100 dark:bg-slate-900 p-6 sm:p-10 grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
          {METRICS.map((m) => (
            <div key={m.value}>
              <div className="font-display text-[clamp(2.25rem,4vw,3.25rem)] text-slate-900 dark:text-white tabular-nums">
                {m.value}
              </div>
              <div className="text-sm leading-5 text-slate-600 dark:text-slate-400 mt-2 max-w-[14rem]">{m.label}</div>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
};
