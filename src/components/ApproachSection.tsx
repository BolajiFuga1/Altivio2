import React, { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight, Check } from 'lucide-react';

interface Step {
  title: string;
  weeks: string;
  /** Length in weeks, used to size the step on the 7-week track. */
  span: number;
  desc: string;
  youDo: string;
  youGet: string[];
}

const STEPS: Step[] = [
  {
    title: 'Discovery & planning',
    weeks: 'Week 1',
    span: 1,
    desc: 'We learn about your business and goals, check what is possible, and agree on a clear plan with fixed milestones.',
    youDo: 'Join a 30-minute call and tell us what you need.',
    youGet: ['A written plan with milestones', 'A detailed proposal you can review'],
  },
  {
    title: 'Design & testing',
    weeks: 'Weeks 2-3',
    span: 2,
    desc: 'We design your product and create clickable previews (or packaging samples), then test them with real customers before building anything.',
    youDo: 'Review the designs and tell us what you think.',
    youGet: ['Clickable previews or packaging samples', 'Feedback from real customers'],
  },
  {
    title: 'Building',
    weeks: 'Weeks 4-6',
    span: 3,
    desc: 'We build your website, app or AI tool with clean, reliable code that is tested automatically as we go, so it runs fast and smoothly.',
    youDo: 'Try each new piece as it is ready and share feedback.',
    youGet: ['A working product you can try as it grows', 'Regular progress updates'],
  },
  {
    title: 'Launch & handover',
    weeks: 'Week 7',
    span: 1,
    desc: 'We stress-test and security-check everything, publish to the app stores, and hand over full ownership. Everything is yours, with nothing left tied to us.',
    youDo: 'Give the final go-ahead.',
    youGet: ['Your product live and published', 'Full ownership of all code, designs and files'],
  },
];

const TOTAL_WEEKS = STEPS.reduce((sum, s) => sum + s.span, 0);

export const ApproachSection: React.FC = () => {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  const step = STEPS[active];

  return (
    <section id="approach" className="py-24 md:py-32 bg-white dark:bg-slate-950 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14 md:mb-16">
          <h2 className="text-[clamp(2.25rem,4.5vw,3.25rem)] text-slate-900 dark:text-white">Built fast. Built to last.</h2>
          <p className="text-slate-600 dark:text-slate-400 mt-4 text-base sm:text-lg">
            A small senior team, with no layers of managers.
          </p>
        </div>

        {/* 7-week track: each step's width matches its length */}
        <div
          role="tablist"
          aria-label="Project steps"
          className="flex flex-col md:grid gap-2 md:gap-1.5"
          style={{ gridTemplateColumns: STEPS.map((s) => `${s.span}fr`).join(' ') }}
        >
          {STEPS.map((s, i) => {
            const isActive = i === active;
            const isDone = i < active;
            return (
              <button
                key={s.title}
                role="tab"
                id={`approach-tab-${i}`}
                aria-selected={isActive}
                aria-controls="approach-panel"
                onClick={() => setActive(i)}
                className={`relative text-left rounded-2xl px-5 py-4 md:min-h-[112px] flex md:flex-col justify-between gap-3 overflow-hidden transition-colors cursor-pointer ${
                  isActive
                    ? 'text-white dark:text-slate-900'
                    : 'bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="approach-active"
                    transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 260, damping: 30 }}
                    className="absolute inset-0 bg-purple-600 dark:bg-purple-300"
                    aria-hidden="true"
                  />
                )}
                <span className={`relative text-[13px] ${isActive ? 'opacity-80' : 'text-slate-500 dark:text-slate-400'}`}>
                  {s.weeks}
                </span>
                <span className="relative font-display text-lg leading-tight flex items-center gap-2">
                  {isDone && <Check className="w-4 h-4 shrink-0 text-purple-600 dark:text-purple-300" aria-label="Earlier step" />}
                  {s.title}
                </span>
              </button>
            );
          })}
        </div>

        {/* Week scale under the track (desktop) */}
        <div className="hidden md:flex justify-between mt-3 px-1 text-xs text-slate-400 dark:text-slate-500">
          <span>Day 1</span>
          <span>Week {TOTAL_WEEKS}</span>
        </div>

        {/* Detail for the selected step */}
        <motion.div
          key={active}
          id="approach-panel"
          role="tabpanel"
          aria-labelledby={`approach-tab-${active}`}
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 md:mt-10 grid grid-cols-1 lg:grid-cols-[7fr_5fr] gap-8 lg:gap-12 rounded-[24px] bg-slate-100 dark:bg-slate-900 p-6 sm:p-10"
        >
          <div>
            <div className="text-sm text-slate-500 dark:text-slate-400">{step.weeks}</div>
            <h3 className="mt-2 font-display text-[clamp(1.75rem,3vw,2.5rem)] leading-tight text-slate-900 dark:text-white">
              {step.title}
            </h3>
            <p className="mt-4 text-base sm:text-lg leading-relaxed text-slate-700 dark:text-slate-300 max-w-[60ch]">
              {step.desc}
            </p>
          </div>

          <div className="flex flex-col gap-6 lg:border-l lg:pl-12 border-slate-200 dark:border-slate-800">
            <div>
              <div className="text-sm font-medium text-slate-900 dark:text-white">What you do</div>
              <p className="mt-1.5 text-slate-600 dark:text-slate-400">{step.youDo}</p>
            </div>
            <div>
              <div className="text-sm font-medium text-slate-900 dark:text-white">What you get</div>
              <ul className="mt-2 space-y-2">
                {step.youGet.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-slate-600 dark:text-slate-400">
                    <Check className="w-4 h-4 mt-1 shrink-0 text-purple-600 dark:text-purple-300" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Outcome and next step */}
        <div className="mt-10 md:mt-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <p className="font-display text-2xl text-slate-900 dark:text-white">
              A typical project launches in about {TOTAL_WEEKS} weeks.
            </p>
            <p className="mt-1.5 text-slate-600 dark:text-slate-400">PulseCare’s online clinic went live in 7 weeks.</p>
          </div>
          <a
            href="#contact"
            className="btn-ink self-start md:self-auto h-12 px-7 text-[15px] inline-flex items-center gap-2 whitespace-nowrap group"
          >
            <span>Get a proposal</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </a>
        </div>
      </div>
    </section>
  );
};
