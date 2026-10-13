import React, { useRef, useState } from 'react';
import { motion, MotionValue, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { PORTFOLIO_PROJECTS } from '../data/portfolioData';
import { PortfolioProject } from '../types';
import { Play } from 'lucide-react';

interface PortfolioSectionProps {
  onOpenDemo: (project: PortfolioProject) => void;
}

const FILTERS = [
  { id: 'all', label: 'All Projects' },
  { id: 'digital', label: 'Web & Mobile Apps' },
  { id: 'ai', label: 'AI Solutions' },
  { id: 'brand', label: 'Brand & Packaging' },
] as const;

type FilterId = (typeof FILTERS)[number]['id'];

const matchesFilter = (project: PortfolioProject, filter: FilterId) => {
  if (filter === 'all') return true;
  if (filter === 'digital') return project.previewType === 'telemedicine' || project.previewType === 'fintech';
  if (filter === 'ai') return project.previewType === 'ai-dashboard';
  return project.previewType === 'luxury-brand';
};

// Card themes rotate through the palette, after Cohere's alternating dark / light panels.
const THEMES = [
  {
    card: 'stack-forest text-white',
    label: 'text-white/70',
    body: 'text-white/75',
    statLabel: 'text-white/60',
    divider: 'border-white/15',
    button: 'bg-white text-slate-900 hover:bg-slate-100',
  },
  {
    card: 'bg-slate-900 dark:bg-black text-white border border-white/5',
    label: 'text-white/70',
    body: 'text-white/75',
    statLabel: 'text-white/60',
    divider: 'border-white/15',
    button: 'bg-white text-slate-900 hover:bg-slate-100',
  },
  {
    card: 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800',
    label: 'text-slate-500 dark:text-slate-400',
    body: 'text-slate-600 dark:text-slate-300',
    statLabel: 'text-slate-500 dark:text-slate-400',
    divider: 'border-slate-200 dark:border-slate-800',
    button: 'btn-ink',
  },
  {
    card: 'cohere-media text-slate-900',
    label: 'text-slate-900/70',
    body: 'text-slate-900/80',
    statLabel: 'text-slate-900/65',
    divider: 'border-slate-900/15',
    button: 'bg-slate-900 text-white hover:bg-purple-600',
  },
];

// How much each covered card shrinks per card stacked on top of it (Cohere-style depth).
const SCALE_STEP = 0.035;

interface StackCardProps {
  project: PortfolioProject;
  index: number;
  total: number;
  progress: MotionValue<number>;
  onOpenDemo: (project: PortfolioProject) => void;
}

// One pinned card. It sticks below the header (each card a little lower than the last, so the
// labels of the cards underneath stay visible) and shrinks back as later cards slide over it.
const StackCard: React.FC<StackCardProps> = ({ project, index, total, progress, onOpenDemo }) => {
  const reduce = useReducedMotion();
  const theme = THEMES[index % THEMES.length];
  const targetScale = 1 - (total - 1 - index) * SCALE_STEP;
  const scale = useTransform(progress, [index / total, 1], [1, targetScale]);

  return (
    <div
      className="sticky"
      style={{ top: `calc(var(--stack-top) + ${index} * var(--stack-step))`, zIndex: index + 1 }}
    >
      <motion.article
        style={{ scale: reduce ? 1 : scale, transformOrigin: 'top center' }}
        className={`h-[var(--stack-h)] rounded-[20px] overflow-hidden px-5 pb-5 pt-3.5 sm:px-8 sm:pb-8 lg:px-10 lg:pb-10 lg:pt-[18px] grid grid-rows-[auto_minmax(0,1fr)] lg:grid-rows-1 lg:grid-cols-[5fr_7fr] gap-5 lg:gap-12 shadow-[0_-12px_40px_-24px_rgba(13,26,15,0.35)] ${theme.card}`}
      >
        <div className="flex flex-col min-w-0">
          <span className={`font-mono text-[11px] sm:text-xs uppercase tracking-[0.12em] truncate ${theme.label}`}>
            {project.category}
          </span>

          <div className="mt-5 lg:mt-auto">
            <h3 className="font-display text-[clamp(1.5rem,min(3.4vw,5.2vh),3rem)] leading-[1.05] tracking-[-0.025em]">
              {project.title}
            </h3>
            <p className={`mt-3 lg:mt-4 text-sm sm:text-[15px] leading-relaxed max-w-md line-clamp-2 ${theme.body}`}>{project.headline}</p>

            <dl className={`hidden [@media(min-width:1024px)_and_(min-height:800px)]:grid mt-6 pt-5 border-t grid-cols-3 gap-3 ${theme.divider}`}>
              {project.stats.map((stat) => (
                <div key={stat.label} className="flex flex-col">
                  <dt className={`text-[11px] leading-snug ${theme.statLabel}`}>{stat.label}</dt>
                  <dd className="font-display text-xl tabular-nums mt-1 order-first">{stat.value}</dd>
                </div>
              ))}
            </dl>

            <button
              onClick={() => onOpenDemo(project)}
              className={`mt-5 lg:mt-7 h-11 lg:h-12 px-6 rounded-full text-[15px] inline-flex items-center gap-2 transition-[background-color,transform] active:scale-[0.98] cursor-pointer ${theme.button}`}
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Try the demo</span>
            </button>
          </div>
        </div>

        <div className="relative min-h-0 lg:mt-[22px] rounded-2xl overflow-hidden">
          <img
            src={project.image}
            alt={`${project.title} for ${project.client}`}
            width={1200}
            height={896}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      </motion.article>
    </div>
  );
};

export const PortfolioSection: React.FC<PortfolioSectionProps> = ({ onOpenDemo }) => {
  const [activeFilter, setActiveFilter] = useState<FilterId>('all');
  const projects = PORTFOLIO_PROJECTS.filter((p) => matchesFilter(p, activeFilter));
  const stackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: stackRef, offset: ['start start', 'end end'] });

  return (
    <section id="portfolio" className="pt-24 md:pt-32 pb-12 bg-slate-100 dark:bg-slate-950 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-[clamp(2.25rem,4.5vw,3.25rem)] text-slate-900 dark:text-white">Recent Projects</h2>
          <p className="text-slate-600 dark:text-slate-400 mt-4 max-w-xl mx-auto text-base sm:text-lg">
            See real apps, websites, AI tools and packaging we have created for our clients.
          </p>

          <div className="mt-8 inline-flex flex-wrap justify-center gap-1.5 p-1.5 bg-white dark:bg-slate-900 rounded-full">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                className={`px-4 py-2 text-[13px] rounded-full transition-colors cursor-pointer ${
                  activeFilter === f.id
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Stacking cards, after Cohere: each card pins below the header and the next one slides
            over it. The spacer at the end lets the last card settle so the full stack holds a moment
            before scrolling away together. */}
        <div
          ref={stackRef}
          className="project-stack flex flex-col gap-6 lg:gap-8"
          style={{ ['--stack-count' as string]: projects.length }}
        >
          {projects.map((project, i) => (
            <StackCard
              key={project.id}
              project={project}
              index={i}
              total={projects.length}
              progress={scrollYProgress}
              onOpenDemo={onOpenDemo}
            />
          ))}
          <div aria-hidden="true" className="h-[22vh]" />
        </div>
      </div>
    </section>
  );
};
