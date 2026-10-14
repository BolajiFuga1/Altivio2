import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  motion,
  MotionValue,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { Reveal } from './Reveal';
import { PORTFOLIO_PROJECTS } from '../data/portfolioData';

interface HeroProps {
  onExploreClick: () => void;
  onEstimateClick: () => void;
}

const METRICS = [
  { value: '$180M+', label: 'Raised from investors by our clients' },
  { value: '4.9', label: 'Average client rating out of 5' },
  { value: '100%', label: 'Built by our own team, never outsourced' },
  { value: '16', label: 'Services under one roof' },
];

// Short names for the showcase, in the same order as the portfolio.
const SHORT_NAMES: Record<string, string> = {
  'telemedicine-platform': 'PulseCare',
  'mobile-app-fintech': 'Aura',
  'ai-engineering-synapse': 'SynapseML',
  'luxury-packaging-brand': 'Aethelgard',
};
const SHOWCASE = PORTFOLIO_PROJECTS.map((p) => ({
  id: p.id,
  name: SHORT_NAMES[p.id] ?? p.client,
  kind: p.category,
  line: p.headline,
  image: p.image,
}));

// Client marks: a simple geometric monogram per client, drawn in the current text colour.
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

const scrollToProjects = () => document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' });

// Scroll timeline for the pinned showcase (0 = top of the hero, 1 = end of the pinned stretch).
const INTRO_GONE = 0.06; // headline and buttons have fully faded out
const EXPAND_START = 0.04; // card starts growing (only once the text is nearly gone)
const EXPAND_END = 0.22; // card has grown to full screen
const CYCLE_START = 0.26;
const CYCLE_END = 0.9; // last project finishes
const SEGMENT = (CYCLE_END - CYCLE_START) / SHOWCASE.length;
const FADE = 0.035;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/** How visible project `index` is at scroll progress `p` (0 to 1), with a short cross-fade at each edge. */
const segmentOpacity = (p: number, index: number, fadeInFrom = CYCLE_START + index * SEGMENT) => {
  const start = CYCLE_START + index * SEGMENT;
  const end = start + SEGMENT;
  const isFirst = index === 0;
  const isLast = index === SHOWCASE.length - 1;
  const fadeIn = isFirst && fadeInFrom === start ? 1 : clamp01((p - (fadeInFrom - FADE / 2)) / FADE);
  const fadeOut = isLast ? 1 : clamp01(((end + FADE / 2) - p) / FADE);
  return Math.min(fadeIn, fadeOut);
};

/** Large showcase only where pinning feels good: wide, tall-enough screens with a mouse or trackpad. */
const useCinematic = () => {
  const [cinematic, setCinematic] = useState(false);
  useEffect(() => {
    const query = window.matchMedia('(min-width: 1024px) and (min-height: 640px)');
    const update = () => setCinematic(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  return cinematic;
};

/** One project photo whose opacity follows its slice of the scroll timeline. */
const ShowcaseImage: React.FC<{ index: number; progress: MotionValue<number>; zoom: MotionValue<number>; shift: MotionValue<number>; src: string; alt: string }> = ({
  index,
  progress,
  zoom,
  shift,
  src,
  alt,
}) => {
  const opacity = useTransform(progress, (p) => segmentOpacity(p, index));
  return (
    <motion.img
      src={src}
      alt={alt}
      width={1200}
      height={896}
      fetchPriority={index === 0 ? 'high' : 'auto'}
      style={{ opacity, scale: zoom, y: shift }}
      className="absolute inset-0 w-full h-full object-cover"
    />
  );
};

/** The label and progress marker for one project along the bottom of the showcase. */
const ShowcaseTab: React.FC<{ index: number; progress: MotionValue<number>; name: string }> = ({ index, progress, name }) => {
  const start = CYCLE_START + index * SEGMENT;
  const fill = useTransform(progress, [start, start + SEGMENT], [0, 1], { clamp: true });
  const opacity = useTransform(progress, [start - FADE, start, start + SEGMENT, start + SEGMENT + FADE], [0.55, 1, 1, 0.55]);
  return (
    <motion.div style={{ opacity }} className="flex-1 min-w-0">
      <div className="h-0.5 rounded-full bg-white/25 overflow-hidden">
        <motion.div style={{ scaleX: fill }} className="h-full bg-white origin-left" />
      </div>
      <div className="mt-2 text-sm text-white truncate">{name}</div>
    </motion.div>
  );
};

/** Caption for the project currently on screen. */
const ShowcaseCaption: React.FC<{ index: number; progress: MotionValue<number> }> = ({ index, progress }) => {
  // The first caption appears as the card finishes growing; the rest follow their photo.
  const opacity = useTransform(progress, (p) => segmentOpacity(p, index, index === 0 ? EXPAND_END - 0.02 : undefined));
  const visibility = useTransform(opacity, (o) => (o > 0.5 ? 'visible' : 'hidden'));
  const project = SHOWCASE[index];
  return (
    <motion.div style={{ opacity, visibility }} className="absolute inset-x-0 bottom-0">
      <div className="text-sm text-white/70">{project.kind}</div>
      <div className="mt-1 font-display text-[clamp(1.75rem,3vw,2.75rem)] leading-tight text-white">{project.name}</div>
      <p className="mt-2 text-[15px] text-white/80 max-w-lg">{project.line}</p>
      <button
        onClick={scrollToProjects}
        className="mt-4 h-10 px-5 rounded-full bg-white text-slate-900 text-sm inline-flex items-center gap-2 cursor-pointer hover:bg-slate-100 transition-colors"
      >
        See project
        <ArrowRight className="w-4 h-4" />
      </button>
    </motion.div>
  );
};

const HeroIntro: React.FC<{ onEstimateClick: () => void }> = ({ onEstimateClick }) => (
  <div className="text-center px-4">
    <h1 className="text-[clamp(2.5rem,6.2vw,5rem)] leading-[1.02] text-slate-800 dark:text-white text-balance max-w-5xl mx-auto">
      Apps, websites and brands, built by one team.
    </h1>
    <p className="mt-6 text-base sm:text-lg leading-relaxed text-slate-700 dark:text-slate-300 max-w-xl mx-auto">
      Altivio designs and builds apps, websites and AI tools for growing businesses, and creates brands people remember.
    </p>
    <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
      <a href="#contact" className="btn-ink w-full sm:w-auto h-12 px-7 text-[15px] flex items-center justify-center gap-2 group">
        <span>Get a proposal</span>
        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
      </a>
      <button
        onClick={onEstimateClick}
        className="w-full sm:w-auto h-12 px-7 text-[15px] text-slate-900 dark:text-slate-100 border border-slate-900 dark:border-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 active:scale-[0.98] rounded-full transition-[background-color,transform] flex items-center justify-center gap-2 group cursor-pointer"
      >
        <span>Get an estimate</span>
        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
      </button>
    </div>
  </div>
);

/** Desktop: the pinned "opening showcase". */
const CinematicShowcase: React.FC<{ onEstimateClick: () => void }> = ({ onEstimateClick }) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ['start start', 'end end'] });

  // Where the card starts: just below the intro text (measured), leaving at least 240px of card on screen.
  const startTop = useMotionValue(560);
  useLayoutEffect(() => {
    const measure = () => {
      const intro = introRef.current;
      if (!intro) return;
      const bottom = intro.offsetTop + intro.offsetHeight + 32;
      startTop.set(Math.min(bottom, window.innerHeight - 240));
    };
    measure();
    const observer = new ResizeObserver(measure);
    if (introRef.current) observer.observe(introRef.current);
    window.addEventListener('resize', measure);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [startTop]);

  // Stage 2: the card grows to full screen (its edges are revealed, so photos never stretch).
  const top = useTransform([scrollYProgress, startTop] as MotionValue<number>[], ([p, s]: number[]) => {
    if (p <= EXPAND_START) return s;
    if (p <= EXPAND_END) return s * (1 - (p - EXPAND_START) / (EXPAND_END - EXPAND_START));
    if (p >= CYCLE_END) return 0;
    return 0;
  });
  const side = useTransform(scrollYProgress, [EXPAND_START, EXPAND_END, CYCLE_END, 1], [7, 0, 0, 3]);
  const bottom = useTransform(scrollYProgress, [EXPAND_START, EXPAND_END, CYCLE_END, 1], [24, 0, 0, 40]);
  const radius = useTransform(scrollYProgress, [EXPAND_START, EXPAND_END, CYCLE_END, 1], [24, 0, 0, 24]);
  const clipPath = useMotionTemplate`inset(${top}px ${side}% ${bottom}px ${side}% round ${radius}px)`;
  const zoom = useTransform(scrollYProgress, [EXPAND_START, EXPAND_END], [1.12, 1]);
  // While the card is small, centre the photo in the visible window so it shows the middle of the image.
  const shift = useTransform(top, (t) => t / 2);

  // The intro fades and drifts up as the card takes over.
  // The intro clears out quickly, before the card grows underneath it, so text never sits over a photo.
  const introOpacity = useTransform(scrollYProgress, [0, INTRO_GONE], [1, 0]);
  const introY = useTransform(scrollYProgress, [0, INTRO_GONE], [0, -120]);
  const introPointer = useTransform(introOpacity, (o) => (o > 0.4 ? 'auto' : 'none'));
  const introVisibility = useTransform(introOpacity, (o) => (o > 0.01 ? 'visible' : 'hidden'));

  // Overlay (captions + progress) appears once the card is full screen.
  const overlayOpacity = useTransform(scrollYProgress, [EXPAND_END - 0.04, EXPAND_END, CYCLE_END, CYCLE_END + 0.05], [0, 1, 1, 0]);

  return (
    <div ref={trackRef} className="relative h-[330vh]">
      <div className="sticky top-0 h-[100dvh] overflow-hidden">
        {/* Card */}
        <motion.div style={{ clipPath }} className="absolute inset-0 cohere-media">
          {SHOWCASE.map((p, i) => (
            <ShowcaseImage key={p.id} index={i} progress={scrollYProgress} zoom={zoom} shift={shift} src={p.image} alt={`${p.name}: ${p.line}`} />
          ))}
          <motion.div style={{ opacity: overlayOpacity }} className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/10 pointer-events-none" />
          <motion.div style={{ opacity: overlayOpacity }} className="absolute inset-x-0 bottom-0 px-[6vw] pb-10">
            <div className="relative h-56">
              {SHOWCASE.map((_, i) => (
                <ShowcaseCaption key={i} index={i} progress={scrollYProgress} />
              ))}
            </div>
            <div className="mt-8 flex gap-4" aria-hidden="true">
              {SHOWCASE.map((p, i) => (
                <ShowcaseTab key={p.id} index={i} progress={scrollYProgress} name={p.name} />
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Intro */}
        <motion.div
          ref={introRef}
          style={{ opacity: introOpacity, y: introY, pointerEvents: introPointer, visibility: introVisibility }}
          className="absolute inset-x-0 top-0 pt-[clamp(6.5rem,14vh,9rem)]"
        >
          <HeroIntro onEstimateClick={onEstimateClick} />
        </motion.div>
      </div>
    </div>
  );
};

/** Phones, tablets and reduced motion: a lighter showcase. */
const CompactShowcase: React.FC<{ onEstimateClick: () => void; reduce: boolean }> = ({ onEstimateClick, reduce }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: cardRef, offset: ['start end', 'end start'] });
  const scale = useTransform(scrollYProgress, [0, 0.4], [0.94, 1]);
  const [active, setActive] = useState(0);

  // Photos change as the card moves through the screen.
  useEffect(() => {
    if (reduce) return;
    return scrollYProgress.on('change', (p) => {
      const i = Math.min(SHOWCASE.length - 1, Math.max(0, Math.floor(((p - 0.2) / 0.6) * SHOWCASE.length)));
      setActive(i);
    });
  }, [scrollYProgress, reduce]);

  return (
    <div className="pt-24 md:pt-32">
      <Reveal immediate>
        <HeroIntro onEstimateClick={onEstimateClick} />
      </Reveal>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        {reduce ? (
          <div className="grid grid-cols-2 gap-3">
            {SHOWCASE.map((p) => (
              <button key={p.id} onClick={scrollToProjects} className="text-left cursor-pointer">
                <img src={p.image} alt={`${p.name}: ${p.line}`} width={1200} height={896} className="w-full aspect-[4/3] object-cover rounded-2xl" />
                <span className="block mt-2 text-sm text-slate-700 dark:text-slate-300">{p.name}</span>
              </button>
            ))}
          </div>
        ) : (
          <motion.div ref={cardRef} style={{ scale }} className="relative aspect-[4/5] sm:aspect-[16/10] rounded-[24px] overflow-hidden cohere-media">
            {SHOWCASE.map((p, i) => (
              <img
                key={p.id}
                src={p.image}
                alt={`${p.name}: ${p.line}`}
                width={1200}
                height={896}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${i === active ? 'opacity-100' : 'opacity-0'}`}
              />
            ))}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5">
              <div className="text-[13px] text-white/70">{SHOWCASE[active].kind}</div>
              <div className="font-display text-2xl text-white">{SHOWCASE[active].name}</div>
              <div className="mt-3 flex gap-2" aria-hidden="true">
                {SHOWCASE.map((p, i) => (
                  <span key={p.id} className={`h-0.5 flex-1 rounded-full ${i === active ? 'bg-white' : 'bg-white/30'}`} />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export const Hero: React.FC<HeroProps> = ({ onEstimateClick }) => {
  const reduce = useReducedMotion();
  const cinematic = useCinematic();

  return (
    <section className="relative pb-16 md:pb-24">
      {cinematic && !reduce ? (
        <CinematicShowcase onEstimateClick={onEstimateClick} />
      ) : (
        <CompactShowcase onEstimateClick={onEstimateClick} reduce={Boolean(reduce)} />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Trusted by */}
        <Reveal className="mt-16 md:mt-20 text-center">
          <p className="text-[15px] text-slate-700 dark:text-slate-300">Trusted by growing businesses and the investors behind them</p>
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
              <div className="font-display text-[clamp(2.25rem,4vw,3.25rem)] text-slate-900 dark:text-white tabular-nums">{m.value}</div>
              <div className="text-sm leading-5 text-slate-600 dark:text-slate-400 mt-2 max-w-[14rem]">{m.label}</div>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
};
