import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

interface Testimonial {
  id: string;
  author: string;
  role: string;
  company: string;
  shortName: string;
  initials: string;
  shape: 'circle' | 'square' | 'diamond' | 'arch';
  resultValue: string;
  resultLabel: string;
  quote: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: 'pulsecare',
    author: 'Dr. Elena Vance',
    role: 'Co-Founder & Chief Medical Officer',
    company: 'PulseCare Health',
    shortName: 'PulseCare',
    initials: 'P',
    shape: 'circle',
    resultValue: '68%',
    resultLabel: 'faster for patients to get seen',
    quote:
      'In 7 weeks Altivio turned our shaky first version into a secure clinic on web and mobile. It grew to 140,000 appointments without going offline once.',
  },
  {
    id: 'aura',
    author: 'Marcus Sterling',
    role: 'VP of Product & Engineering',
    company: 'Aura Financial Technologies',
    shortName: 'Aura',
    initials: 'A',
    shape: 'arch',
    resultValue: '$450M+',
    resultLabel: 'handled in the first 9 months',
    quote:
      'Our app feels smooth, opens instantly and keeps accounts locked down. We reached #3 in the App Store’s Finance chart and 88,000 monthly users.',
  },
  {
    id: 'synapse',
    author: 'Dr. Soren Berg',
    role: 'Head of Applied AI',
    company: 'Cognitive Dynamics Global',
    shortName: 'Cognitive Dynamics',
    initials: 'CD',
    shape: 'square',
    resultValue: 'Under 0.4s',
    resultLabel: 'for the AI to answer',
    quote:
      'Altivio built a tool that pulls key facts out of financial reports for us. It cut our analysts’ review time by 74%, and every answer is easy to check.',
  },
  {
    id: 'aethelgard',
    author: 'Claire Delacroix',
    role: 'Managing Director & Brand Strategist',
    company: 'Maison Aethelgard Paris',
    shortName: 'Aethelgard',
    initials: 'Æ',
    shape: 'diamond',
    resultValue: '4.2x',
    resultLabel: 'growth in luxury store sales',
    quote:
      'Altivio is brilliant at both luxury packaging and online shopping. Their work helped get our brand into Harrods and Le Bon Marché.',
  },
];

// Seconds each quote stays before the next one shows.
const QUOTE_SECONDS = 7;

const ClientMark: React.FC<{ initials: string; shape: Testimonial['shape'] }> = ({ initials, shape }) => (
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

export const TestimonialsSection: React.FC = () => {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [inView, setInView] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const t = TESTIMONIALS[active];

  // Only play through while the section is on screen.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.35 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const playing = !reduce && inView && !hovered && !focused;
  const next = () => setActive((i) => (i + 1) % TESTIMONIALS.length);

  return (
    <section
      id="testimonials"
      ref={sectionRef}
      className="py-24 md:py-32 bg-white dark:bg-slate-950 transition-colors duration-200"
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={() => setFocused(false)}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-[clamp(2.25rem,4.5vw,3.25rem)] text-slate-900 dark:text-white">What our clients say</h2>

        {/* Featured quote */}
        <div className="mt-12 md:mt-16 min-h-[22rem] sm:min-h-[19rem]" aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            <motion.figure
              key={t.id}
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: -12 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            >
              <blockquote className="font-display text-[clamp(1.6rem,3.2vw,2.75rem)] leading-[1.2] tracking-[-0.02em] text-slate-900 dark:text-white text-balance">
                “{t.quote}”
              </blockquote>

              <figcaption className="mt-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                  <div className="text-[17px] text-slate-900 dark:text-white">{t.author}</div>
                  <div className="text-[15px] text-slate-600 dark:text-slate-400">
                    {t.role}, {t.company}
                  </div>
                </div>
                <div className="md:text-right">
                  <div className="font-display text-[clamp(2rem,3.5vw,2.75rem)] leading-none text-purple-600 dark:text-purple-300 tabular-nums">
                    {t.resultValue}
                  </div>
                  <div className="mt-1 text-[15px] text-slate-600 dark:text-slate-400">{t.resultLabel}</div>
                  <button
                    onClick={() => document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' })}
                    className="mt-3 inline-flex items-center gap-1.5 text-[15px] text-slate-900 dark:text-white underline-offset-4 hover:underline cursor-pointer"
                  >
                    See the project
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </figcaption>
            </motion.figure>
          </AnimatePresence>
        </div>

        {/* Client switcher */}
        <div
          role="tablist"
          aria-label="Choose a client"
          className="mt-12 -mx-4 px-4 sm:mx-0 sm:px-0 flex sm:grid sm:grid-cols-4 gap-6 overflow-x-auto no-scrollbar"
        >
          {TESTIMONIALS.map((item, i) => {
            const isActive = i === active;
            return (
              <button
                key={item.id}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActive(i)}
                className={`relative shrink-0 pt-5 pb-1 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2.5 text-left cursor-pointer transition-colors ${
                  isActive ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                {/* Progress line: when it fills, the next quote shows */}
                <span className="absolute left-0 right-0 -top-px h-0.5 overflow-hidden" aria-hidden="true">
                  {isActive && (
                    <span
                      key={`${item.id}-${active}`}
                      className="testimonial-progress block h-full bg-slate-900 dark:bg-white origin-left"
                      style={{
                        animationDuration: `${QUOTE_SECONDS}s`,
                        animationPlayState: playing ? 'running' : 'paused',
                      }}
                      onAnimationEnd={next}
                    />
                  )}
                </span>
                <ClientMark initials={item.initials} shape={item.shape} />
                <span className="font-display text-base sm:text-lg tracking-tight whitespace-nowrap">{item.shortName}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
