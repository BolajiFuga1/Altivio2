import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ArrowRight, Calculator, Check, Plus, Sparkles, X } from 'lucide-react';
import { ALL_SERVICES, SERVICE_CATEGORIES } from '../data/servicesData';
import { ServiceItem } from '../types';
import { resolveAssignedSquad } from '../utils/squadMatcher';

interface CostEstimatorProps {
  selectedServiceIds: string[];
  onToggleService: (serviceId: string) => void;
  onSelectServices: (ids: string[]) => void;
  onAttachToProposal: (estimateSummary: {
    totalCost: number;
    timelineWeeks: number;
    selectedServices: string[];
    tierName: string;
    assignedLead?: string;
    squadSummary?: string;
  }) => void;
}

// Every estimate is priced at the standard project size.
const PROJECT_TIER = 'GROWTH';

// Services billed every month rather than once.
const isMonthly = (service: ServiceItem) => /monthly|ongoing/i.test(service.timeline);

// Services that benefit from ongoing website care once launched.
const NEEDS_CARE = ['web-development', 'mobile-app-dev', 'ai-engineering', 'ui-ux-design'];
const CARE_ID = 'website-management';

const QUICK_PICKS = [
  { label: 'AI-powered website', ids: ['ai-engineering', 'web-development', 'ui-ux-design'] },
  { label: 'Mobile App Launch', ids: ['mobile-app-dev', 'ui-ux-design'] },
  { label: 'Brand & Packaging', ids: ['brand-identity-design', 'packaging-design', 'web-development', 'shopping-bag-design'] },
];

const money = (amount: number) => `$${amount.toLocaleString()}`;

const initialsOf = (name: string) =>
  name
    .replace(/^Dr\.\s*/, '')
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('');

interface AiAnalysis {
  summary: string;
  recommendedServiceIds: string[];
  estimatedWeeks: number;
}

export const CostEstimator: React.FC<CostEstimatorProps> = ({
  selectedServiceIds,
  onToggleService,
  onSelectServices,
  onAttachToProposal,
}) => {
  const reduce = useReducedMotion();
  const [activeCategory, setActiveCategory] = useState<string>('all');

  // "Ask our AI" helper
  const [aiOpen, setAiOpen] = useState(false);
  const [briefInput, setBriefInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<AiAnalysis | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  const handleAnalyzeBrief = async () => {
    if (briefInput.trim().length < 5) return;
    setIsAnalyzing(true);
    setAiError(null);
    try {
      const res = await fetch('/api/ai/analyze-brief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ briefText: briefInput.trim() }),
      });
      const data = await res.json();
      if (data.analysis) setAiResult(data.analysis);
      else setAiError('We could not read that. Try describing your idea in a little more detail.');
    } catch (err) {
      console.error('Failed to analyze brief:', err);
      setAiError('Something went wrong. Please try again, or pick services from the list.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const visibleServices = ALL_SERVICES.filter((s) => activeCategory === 'all' || s.category === activeCategory);
  const chosen = ALL_SERVICES.filter((s) => selectedServiceIds.includes(s.id));
  const oneOff = chosen.filter((s) => !isMonthly(s));
  const monthly = chosen.filter(isMonthly);
  const oneOffTotal = oneOff.reduce((sum, s) => sum + s.basePrice, 0);
  const monthlyTotal = monthly.reduce((sum, s) => sum + s.basePrice, 0);
  const estimatedWeeks = chosen.length ? Math.max(3, Math.round(chosen.length * 1.4)) : 0;
  const suggestCare = !selectedServiceIds.includes(CARE_ID) && selectedServiceIds.some((id) => NEEDS_CARE.includes(id));
  const careService = ALL_SERVICES.find((s) => s.id === CARE_ID);

  const squad = useMemo(() => resolveAssignedSquad(selectedServiceIds, briefInput), [selectedServiceIds, briefInput]);

  const handleGetProposal = () => {
    onAttachToProposal({
      totalCost: oneOffTotal,
      timelineWeeks: estimatedWeeks || 4,
      selectedServices: chosen.map((s) => (isMonthly(s) ? `${s.name} (${money(s.basePrice)}/month)` : s.name)),
      tierName: PROJECT_TIER,
      assignedLead: `${squad.lead.name} (${squad.lead.role})`,
      squadSummary: squad.squadSummary,
    });
  };

  const scrollToReceipt = () => document.getElementById('estimate-receipt')?.scrollIntoView({ behavior: 'smooth', block: 'center' });

  return (
    <section id="estimator" className="py-24 md:py-32 bg-slate-100 dark:bg-slate-950 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
          <span className="inline-flex items-center gap-2 h-7 px-3 rounded-full bg-white dark:bg-slate-900 text-[13px] text-slate-700 dark:text-slate-300">
            <Calculator className="w-3.5 h-3.5" />
            Plan your project
          </span>
          <h2 className="mt-5 text-[clamp(2.25rem,5vw,3.75rem)] text-slate-900 dark:text-white">Cost Estimator</h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400">
            Pick what you need and see the price right away.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] gap-6 lg:gap-8 items-start">
          {/* ---------- Picker ---------- */}
          <div className="rounded-[24px] bg-white dark:bg-slate-900 p-5 sm:p-8">
            <h3 className="font-display text-2xl text-slate-900 dark:text-white">Add services</h3>

            <div className="mt-5 -mx-5 px-5 sm:mx-0 sm:px-0 flex gap-2 overflow-x-auto no-scrollbar">
              {SERVICE_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`shrink-0 h-9 px-4 rounded-full text-[13px] whitespace-nowrap transition-colors cursor-pointer ${
                    activeCategory === cat.id
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {cat.id === 'all' ? 'All' : cat.label}
                </button>
              ))}
            </div>

            <ul className="mt-4 divide-y divide-slate-200 dark:divide-slate-800">
              {visibleServices.map((service) => {
                const isAdded = selectedServiceIds.includes(service.id);
                return (
                  <li key={service.id}>
                    <button
                      onClick={() => onToggleService(service.id)}
                      aria-pressed={isAdded}
                      className="w-full flex items-center gap-4 py-3.5 text-left cursor-pointer group"
                    >
                      <span className="flex-1 min-w-0">
                        <span className="block text-[15px] text-slate-900 dark:text-white truncate">{service.name}</span>
                        <span className="block text-[13px] text-slate-500 dark:text-slate-400">
                          {money(service.basePrice)}
                          {isMonthly(service) ? ' per month' : ` · ${service.timeline}`}
                        </span>
                      </span>
                      <span
                        className={`shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                          isAdded
                            ? 'bg-purple-600 text-white dark:bg-purple-300 dark:text-slate-900'
                            : 'border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 group-hover:border-slate-900 dark:group-hover:border-white'
                        }`}
                        aria-hidden="true"
                      >
                        {isAdded ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                      </span>
                      <span className="sr-only">{isAdded ? 'Added' : 'Add'}</span>
                    </button>
                  </li>
                );
              })}
            </ul>

            {/* Help choosing */}
            <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800">
              <div className="text-sm text-slate-600 dark:text-slate-400">Not sure where to start?</div>
              <div className="mt-3 flex flex-wrap gap-2">
                {QUICK_PICKS.map((pick) => (
                  <button
                    key={pick.label}
                    onClick={() => onSelectServices(pick.ids)}
                    className="h-9 px-4 rounded-full text-[13px] bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                  >
                    {pick.label}
                  </button>
                ))}
                <button
                  onClick={() => setAiOpen((open) => !open)}
                  aria-expanded={aiOpen}
                  className="h-9 px-4 rounded-full text-[13px] inline-flex items-center gap-1.5 border border-slate-900 dark:border-slate-300 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Ask our AI
                </button>
              </div>

              <AnimatePresence initial={false}>
                {aiOpen && (
                  <motion.div
                    initial={reduce ? false : { opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={reduce ? { opacity: 0 } : { opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="mt-4 rounded-2xl bg-slate-100 dark:bg-slate-800 p-4 sm:p-5">
                      <label htmlFor="ai-brief" className="block text-sm text-slate-900 dark:text-white">
                        Describe your idea in your own words
                      </label>
                      <textarea
                        id="ai-brief"
                        rows={3}
                        value={briefInput}
                        onChange={(e) => setBriefInput(e.target.value)}
                        placeholder="e.g. A phone app where patients can book and see a doctor online, plus a logo and a website"
                        className="mt-2 w-full rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 px-3.5 py-3 text-[15px] text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:outline-2 focus:outline-purple-600 resize-none"
                      />
                      <div className="mt-3 flex items-center justify-between gap-3">
                        <span className="text-[13px] text-slate-600 dark:text-slate-400">Our AI will suggest the right services.</span>
                        <button
                          onClick={handleAnalyzeBrief}
                          disabled={isAnalyzing || briefInput.trim().length < 5}
                          className="btn-ink h-10 px-5 text-sm shrink-0 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        >
                          {isAnalyzing ? 'Thinking...' : 'Suggest services'}
                        </button>
                      </div>
                      {aiError && <p className="mt-3 text-[13px] text-rose-700 dark:text-rose-300">{aiError}</p>}
                      {aiResult && (
                        <div className="mt-4 rounded-xl bg-white dark:bg-slate-900 p-4">
                          <div className="text-sm text-slate-900 dark:text-white">Our suggestion</div>
                          <p className="mt-1 text-[15px] text-slate-600 dark:text-slate-400">{aiResult.summary}</p>
                          <button
                            onClick={() => {
                              onSelectServices(aiResult.recommendedServiceIds);
                              setAiOpen(false);
                            }}
                            className="mt-3 h-9 px-4 rounded-full text-[13px] inline-flex items-center gap-1.5 bg-purple-600 text-white dark:bg-purple-300 dark:text-slate-900 cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5" />
                            Use these {aiResult.recommendedServiceIds.length} services
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* ---------- Receipt ---------- */}
          <aside
            id="estimate-receipt"
            aria-live="polite"
            className="lg:sticky lg:top-[88px] rounded-[24px] bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-[0_24px_60px_-32px_rgba(13,26,15,0.35)]"
          >
            <div className="flex items-baseline justify-between gap-4">
              <h3 className="font-display text-2xl text-slate-900 dark:text-white">Your estimate</h3>
              {chosen.length > 0 && (
                <button
                  onClick={() => onSelectServices([])}
                  className="text-[13px] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white underline-offset-4 hover:underline cursor-pointer"
                >
                  Clear all
                </button>
              )}
            </div>

            {chosen.length === 0 ? (
              <div className="mt-8 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 p-6 text-center">
                <p className="text-[15px] text-slate-700 dark:text-slate-300">
                  Pick a service from the list, or start from a quick pick.
                </p>
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  {QUICK_PICKS.map((pick) => (
                    <button
                      key={pick.label}
                      onClick={() => onSelectServices(pick.ids)}
                      className="h-9 px-4 rounded-full text-[13px] bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                    >
                      {pick.label}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                <ul className="mt-6 space-y-3">
                  {chosen.map((s) => (
                    <li key={s.id} className="flex items-start gap-3 text-[15px]">
                      <span className="flex-1 min-w-0 text-slate-800 dark:text-slate-200">{s.name}</span>
                      <span className="tabular-nums text-slate-900 dark:text-white whitespace-nowrap">
                        {money(s.basePrice)}
                        {isMonthly(s) && <span className="text-slate-500 dark:text-slate-400">/mo</span>}
                      </span>
                      <button
                        onClick={() => onToggleService(s.id)}
                        aria-label={`Remove ${s.name}`}
                        className="-mr-1 p-1 rounded-full text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </li>
                  ))}
                </ul>

                {suggestCare && careService && (
                  <button
                    onClick={() => onToggleService(CARE_ID)}
                    className="mt-5 w-full flex items-center justify-between gap-3 rounded-xl bg-slate-100 dark:bg-slate-800 px-4 py-3 text-left text-[14px] text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                  >
                    <span>Add website care after launch?</span>
                    <span className="inline-flex items-center gap-1 text-slate-900 dark:text-white whitespace-nowrap">
                      <Plus className="w-3.5 h-3.5" />
                      {money(careService.basePrice)}/mo
                    </span>
                  </button>
                )}

                <div className="mt-6 pt-5 border-t border-slate-200 dark:border-slate-800 space-y-2">
                  {oneOff.length > 0 && (
                    <div className="flex items-baseline justify-between gap-4">
                      <span className="text-slate-700 dark:text-slate-300">One-off total</span>
                      <span className="font-display text-[clamp(2rem,3.5vw,2.75rem)] leading-none tabular-nums text-slate-900 dark:text-white">
                        {money(oneOffTotal)}
                      </span>
                    </div>
                  )}
                  {monthly.length > 0 && (
                    <div className="flex items-baseline justify-between gap-4">
                      <span className="text-slate-700 dark:text-slate-300">Monthly</span>
                      <span className={`font-display tabular-nums text-slate-900 dark:text-white ${oneOff.length ? 'text-xl' : 'text-[clamp(2rem,3.5vw,2.75rem)] leading-none'}`}>
                        {money(monthlyTotal)}/mo
                      </span>
                    </div>
                  )}
                  <div className="flex items-baseline justify-between gap-4 text-[15px]">
                    <span className="text-slate-500 dark:text-slate-400">Time to finish</span>
                    <span className="text-slate-900 dark:text-white">About {estimatedWeeks} weeks</span>
                  </div>
                </div>

                <div className="mt-6 flex items-center gap-3 rounded-xl bg-slate-100 dark:bg-slate-800 px-4 py-3">
                  <span className="shrink-0 w-10 h-10 rounded-full bg-purple-600 dark:bg-purple-300 text-white dark:text-slate-900 flex items-center justify-center text-sm font-medium">
                    {initialsOf(squad.lead.name)}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[13px] text-slate-500 dark:text-slate-400">Your project lead</span>
                    <span className="block text-[15px] text-slate-900 dark:text-white truncate">{squad.lead.name}</span>
                  </span>
                </div>
              </>
            )}

            <button
              onClick={handleGetProposal}
              disabled={chosen.length === 0}
              className="btn-ink mt-6 w-full h-12 text-[15px] inline-flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <span>Get a proposal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <p className="mt-3 text-center text-[13px] text-slate-500 dark:text-slate-400">
              Starting prices. Your proposal confirms the final cost.
            </p>
          </aside>
        </div>

        {/* Phones: a small total bar while the picker is on screen */}
        {chosen.length > 0 && (
          <div className="lg:hidden sticky bottom-4 z-20 mt-6 flex justify-center pointer-events-none">
            <button
              onClick={scrollToReceipt}
              className="pointer-events-auto flex items-center gap-3 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 pl-5 pr-2 py-2 shadow-[0_18px_50px_-18px_rgba(13,26,15,0.55)] cursor-pointer"
            >
              <span className="text-sm tabular-nums whitespace-nowrap">
                {oneOff.length > 0 ? money(oneOffTotal) : `${money(monthlyTotal)}/mo`}
                <span className="opacity-70"> · {chosen.length} {chosen.length === 1 ? 'service' : 'services'}</span>
              </span>
              <span className="h-9 px-4 rounded-full bg-white text-slate-900 dark:bg-slate-900 dark:text-white text-sm inline-flex items-center">
                See estimate
              </span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
