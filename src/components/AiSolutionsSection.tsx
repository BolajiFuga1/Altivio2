import React, { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight, Check } from 'lucide-react';

interface AiSolution {
  name: string;
  desc: string;
  /** The steps the work flows through, shown as a connected chain. */
  flow: string[];
  /** Sample outcome for this kind of project. Shown labelled as an example, not a client result. */
  example: string;
  promises: string[];
}

const SOLUTIONS: AiSolution[] = [
  {
    name: 'Workflow automation',
    desc: 'Orders and payments, onboarding, approvals. We map the busywork and hand it to software that never skips a step.',
    flow: ['Checkout', 'Warehouse', 'Carrier', 'Inbox'],
    example: '11 → 2 steps per order',
    promises: [
      'Built on the tools you already pay for',
      'Every task is recorded and can be re-run',
      'A person is alerted only when a decision is needed',
    ],
  },
  {
    name: 'AI agents',
    desc: 'Agents that read your inbox, draft the reply and update your customer records, and ask before doing anything risky.',
    flow: ['Email', 'AI agent', 'Customer records', 'Your review'],
    example: '68% of support requests resolved',
    promises: [
      'Answers based on your own information, not guesses',
      'Clear rules you set for when it hands over to a person',
      'A weekly review of every decision it made',
    ],
  },
  {
    name: 'System integrations',
    desc: 'Your online store talks to your accounts. Your customer list talks to Slack. Every tool finally shares the same up-to-date information.',
    flow: ['Store', 'Accounts', 'Customer list', 'Slack'],
    example: '14 spreadsheets no longer needed',
    promises: [
      'Updates flow both ways, as they happen',
      'Mismatches caught before they spread',
      'Fully documented so your team can run it',
    ],
  },
  {
    name: 'Reporting & insight',
    desc: "Live dashboards that update themselves, so Monday's numbers are ready before Monday is.",
    flow: ['Ads', 'Sales data', 'Analysis', 'Dashboard'],
    example: '4 days → 0 spent on reports',
    promises: [
      'Every number means the same thing everywhere',
      'A written summary drafted for you',
      'An alert when a number changes unexpectedly',
    ],
  },
];

interface AiSolutionsSectionProps {
  /** Adds AI Solutions to the cost estimator and scrolls to it. */
  onGetEstimate: () => void;
}

export const AiSolutionsSection: React.FC<AiSolutionsSectionProps> = ({ onGetEstimate }) => {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  const solution = SOLUTIONS[active];

  return (
    <section id="ai-solutions" className="py-24 md:py-32 bg-white dark:bg-slate-950 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <span className="inline-flex items-center h-7 px-3 rounded-full bg-slate-100 dark:bg-slate-900 text-[13px] text-slate-700 dark:text-slate-300">
            AI solutions
          </span>
          <h2 className="mt-5 text-[clamp(2.25rem,5vw,3.75rem)] text-slate-900 dark:text-white">
            Everything you need.
            <br />
            Nothing you don't.
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-3">
          {/* Service list: the selected one opens to show its explanation */}
          <div role="tablist" aria-label="AI solutions" className="flex flex-col gap-3">
            {SOLUTIONS.map((s, i) => {
              const isActive = i === active;
              return (
                <button
                  key={s.name}
                  role="tab"
                  id={`ai-tab-${i}`}
                  aria-selected={isActive}
                  aria-controls="ai-panel"
                  onClick={() => setActive(i)}
                  className={`text-left rounded-[20px] px-6 py-5 sm:px-7 sm:py-6 transition-colors cursor-pointer group ${
                    isActive
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                      : 'bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-800'
                  }`}
                >
                  <span className="flex items-center justify-between gap-4">
                    <span className="font-display text-xl sm:text-2xl">{s.name}</span>
                    <ArrowRight
                      className={`w-4 h-4 shrink-0 transition-transform ${isActive ? '' : 'opacity-50 group-hover:translate-x-0.5'}`}
                    />
                  </span>
                  {isActive && (
                    <motion.span
                      initial={reduce ? false : { opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="block mt-3 text-[15px] leading-relaxed text-white/75 dark:text-slate-600 max-w-md"
                    >
                      {s.desc}
                    </motion.span>
                  )}
                </button>
              );
            })}

            <button
              onClick={onGetEstimate}
              className="btn-ink self-start mt-3 h-12 px-7 text-[15px] inline-flex items-center gap-2 group cursor-pointer"
            >
              <span>Get an estimate</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>

          {/* Visual: how the work flows for the selected service */}
          <div id="ai-panel" role="tabpanel" aria-labelledby={`ai-tab-${active}`} className="flex flex-col gap-3 min-w-0">
            <div className="@container relative overflow-hidden rounded-[20px] ai-glow min-h-[340px] md:min-h-[420px] flex flex-col">
              <motion.ol
                key={active}
                initial={reduce ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                aria-label={`${solution.name}: ${solution.flow.join(', then ')}`}
                className="flex-1 flex flex-col @[640px]:flex-row items-center justify-center gap-2 @[640px]:gap-0 px-6 py-10"
              >
                {solution.flow.map((node, i) => (
                  <li key={node} className="flex flex-col @[640px]:flex-row items-center">
                    {i > 0 && <span className="ai-flow-link" aria-hidden="true" />}
                    <span className="flex items-center gap-2 h-10 px-4 rounded-xl bg-[rgba(13,26,15,0.55)] border border-white/15 backdrop-blur-md text-white text-[15px] whitespace-nowrap">
                      <span className="w-1.5 h-1.5 rounded-full bg-white" aria-hidden="true" />
                      {node}
                    </span>
                  </li>
                ))}
              </motion.ol>

              <div className="m-4 sm:m-5 self-start rounded-xl px-4 py-2.5 bg-[rgba(13,26,15,0.55)] border border-white/15 backdrop-blur-md text-white text-[15px]">
                <span className="text-white/60">Example: </span>
                {solution.example}
              </div>
            </div>

            <ul className="grid grid-cols-1 sm:grid-cols-3 rounded-[20px] bg-slate-100 dark:bg-slate-900 divide-y sm:divide-y-0 sm:divide-x divide-slate-200 dark:divide-slate-800">
              {solution.promises.map((p) => (
                <li key={p} className="flex items-start gap-2.5 px-5 py-4 text-[15px] leading-snug text-slate-700 dark:text-slate-300">
                  <Check className="w-4 h-4 mt-0.5 shrink-0 text-purple-600 dark:text-purple-300" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
