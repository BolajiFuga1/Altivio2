import React, { useState } from 'react';
import { Quote, Star, CheckCircle2 } from 'lucide-react';

interface Testimonial {
  id: string;
  author: string;
  role: string;
  company: string;
  companyCategory: string;
  highlightMetric: string;
  metricLabel: string;
  quote: string;
  avatarText: string;
  verified: boolean;
}

export const TestimonialsSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('all');

  const testimonials: Testimonial[] = [
    {
      id: 'pulsecare',
      author: 'Dr. Elena Vance',
      role: 'Co-Founder & Chief Medical Officer',
      company: 'PulseCare Health',
      companyCategory: 'telehealth',
      highlightMetric: '68% Faster',
      metricLabel: 'Faster for patients to get seen',
      quote:
        'In 7 weeks Altivio turned our shaky first version into a secure clinic on web and mobile. It grew to 140,000 appointments without going offline once.',
      avatarText: 'EV',
      verified: true
    },
    {
      id: 'aura',
      author: 'Marcus Sterling',
      role: 'VP of Product & Engineering',
      company: 'Aura Financial Technologies',
      companyCategory: 'fintech',
      highlightMetric: '$450M+',
      metricLabel: 'Handled in the first 9 months',
      quote:
        'Our app feels smooth, opens instantly and keeps accounts locked down. We reached #3 in the App Store’s Finance chart and 88,000 monthly users.',
      avatarText: 'MS',
      verified: true
    },
    {
      id: 'synapse',
      author: 'Dr. Soren Berg',
      role: 'Head of Applied AI',
      company: 'Cognitive Dynamics Global',
      companyCategory: 'ai',
      highlightMetric: 'Under 0.4s',
      metricLabel: 'Time for the AI to answer',
      quote:
        'Altivio built a tool that pulls key facts out of financial reports for us. It cut our analysts’ review time by 74%, and every answer is easy to check.',
      avatarText: 'SB',
      verified: true
    },
    {
      id: 'aethelgard',
      author: 'Claire Delacroix',
      role: 'Managing Director & Brand Strategist',
      company: 'Maison Aethelgard Paris',
      companyCategory: 'brand',
      highlightMetric: '4.2x Growth',
      metricLabel: 'Growth in luxury store sales',
      quote:
        'Altivio is brilliant at both luxury packaging and online shopping. Their work helped get our brand into Harrods and Le Bon Marché.',
      avatarText: 'CD',
      verified: true
    }
  ];

  const filteredTestimonials = testimonials.filter(
    (t) => activeTab === 'all' || t.companyCategory === activeTab
  );

  return (
    <section id="testimonials" className="py-24 bg-white dark:bg-slate-950 border-t border-slate-200/80 dark:border-slate-800/80 relative transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white font-display tracking-tight">
              Client Success Stories
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mt-2 max-w-xl text-base">
              Hear from the founders and business leaders who trusted Altivio with their most important projects.
            </p>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-900 border border-transparent dark:border-slate-800 rounded-xl">
            {[
              { id: 'all', label: 'All Stories' },
              { id: 'telehealth', label: 'Healthcare' },
              { id: 'fintech', label: 'Finance' },
              { id: 'ai', label: 'AI' },
              { id: 'brand', label: 'Brand & Goods' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Testimonials Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredTestimonials.map((item) => (
            <div
              key={item.id}
              className="p-8 rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Metric pill header */}
                <div className="flex items-center justify-between pb-5 mb-5 border-b border-slate-200/70 dark:border-slate-800">
                  <div>
                    <div className="text-2xl font-bold font-display text-slate-900 dark:text-white tabular-nums">
                      {item.highlightMetric}
                    </div>
                    <div className="text-[11px] font-medium text-purple-700 dark:text-purple-400 uppercase tracking-wide">
                      {item.metricLabel}
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-purple-600 dark:text-purple-400 shadow-2xs">
                    <Quote className="w-4 h-4 fill-purple-100 dark:fill-purple-950/60" />
                  </div>
                </div>

                {/* Testimonial Quote Body */}
                <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed italic">
                  “{item.quote}”
                </p>
              </div>

              {/* Author & Company Attribution */}
              <div className="mt-8 pt-6 border-t border-slate-200/70 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-slate-900 dark:bg-slate-800 text-white font-bold text-xs flex items-center justify-center font-mono border border-transparent dark:border-slate-700">
                    {item.avatarText}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <span>{item.author}</span>
                      {item.verified && (
                        <span title="Verified Client" className="inline-flex">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {item.role}, <strong className="text-slate-700 dark:text-slate-300 font-semibold">{item.company}</strong>
                    </div>
                  </div>
                </div>

                <div className="hidden sm:flex items-center gap-1 text-purple-600 dark:text-purple-300">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
