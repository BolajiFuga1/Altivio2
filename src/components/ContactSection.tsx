import React, { useState, useEffect, useMemo } from 'react';
import { ArrowRight, Check, CheckCircle2, Copy, Download, FileText, ShieldCheck, X } from 'lucide-react';
import { StatementOfWorkModal } from './StatementOfWorkModal';
import { resolveAssignedSquad } from '../utils/squadMatcher';

interface ContactSectionProps {
  proposalEstimateData?: {
    totalCost: number;
    timelineWeeks: number;
    selectedServices: string[];
    tierName: string;
    assignedLead?: string;
    squadSummary?: string;
  } | null;
}

// What the visitor needs. These words also drive project-lead matching (ai, mobile, brand, ...).
const NEEDS = [
  'A website or mobile app',
  'AI tools',
  'Website or app design (UI/UX)',
  'Branding and logo',
  'Packaging, lookbooks and printed goods',
  'Marketing and Google search',
];

const BUDGET_OPTIONS = [
  { value: 'Under $15k (one focused task)', label: 'Under $15k' },
  { value: '$15k - $30k (first version of a product)', label: '$15k - $30k' },
  { value: '$30k - $60k (complete product)', label: '$30k - $60k' },
  { value: '$60k+ (large project)', label: '$60k+' },
  { value: 'Not sure yet', label: 'Not sure yet' },
];

// Picks the budget option that matches an estimate total.
const budgetOptionFor = (total: number) =>
  BUDGET_OPTIONS[total < 15000 ? 0 : total < 30000 ? 1 : total < 60000 ? 2 : 3].value;

const NEXT_STEPS = [
  { title: 'We reply within 4 business hours', desc: 'A real person reads every request.' },
  { title: 'A free 30-minute call', desc: 'With a senior designer and developer, not a salesperson.' },
  { title: 'Your free proposal', desc: 'A clear price, timeline and plan you can review.' },
];

const initialsOf = (name: string) =>
  name
    .replace(/^Dr\.\s*/, '')
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('');

const chipClass = (active: boolean) =>
  `h-10 px-4 rounded-full text-sm transition-colors cursor-pointer inline-flex items-center gap-1.5 ${
    active
      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
      : 'bg-slate-100 text-slate-800 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700'
  }`;

const inputClass =
  'w-full h-12 px-4 rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-[15px] text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:outline-2 focus:outline-offset-1 focus:outline-purple-600 dark:focus:outline-purple-300 transition-colors';

export const ContactSection: React.FC<ContactSectionProps> = ({ proposalEstimateData }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [needs, setNeeds] = useState<string[]>([]);
  const [budgetRange, setBudgetRange] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [estimateDismissed, setEstimateDismissed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSowModalOpen, setIsSowModalOpen] = useState(false);
  const [submissionResponse, setSubmissionResponse] = useState<{
    proposalId: string;
    referenceCode: string;
    estimatedSprintStart: string;
    assignedLead: string;
  } | null>(null);
  const [bookingConfirmed, setBookingConfirmed] = useState<any | null>(null);
  const [isBooking, setIsBooking] = useState(false);
  const [copiedQuote, setCopiedQuote] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const estimate = estimateDismissed ? null : proposalEstimateData ?? null;
  const serviceCategory = needs.length ? needs.join(', ') : 'Not sure yet';

  // The project lead is matched from what the visitor picks (or their estimate).
  const lead = useMemo(() => {
    if (estimate?.assignedLead) return estimate.assignedLead;
    const matched = resolveAssignedSquad(estimate?.selectedServices || [], `${needs.join(' ')} ${message}`);
    return `${matched.lead.name} (${matched.lead.role})`;
  }, [estimate, needs, message]);
  const leadName = lead.replace(/\s*\(.*\)$/, '');
  const showLead = needs.length > 0 || Boolean(estimate);

  // If an estimate arrives from the Cost Estimator, pre-fill the form from it.
  useEffect(() => {
    if (proposalEstimateData) {
      setEstimateDismissed(false);
      setBudgetRange(budgetOptionFor(proposalEstimateData.totalCost));
      setMessage(
        `Hi Altivio team,\n\nI used your Cost Estimator and I'm interested in: ${proposalEstimateData.selectedServices.join(', ')}.\n\nEstimated price: $${proposalEstimateData.totalCost.toLocaleString()}\nEstimated time to finish: about ${proposalEstimateData.timelineWeeks} weeks\n\nI'd like to book a call to talk it through.`
      );
    }
  }, [proposalEstimateData]);

  const toggleNeed = (need: string) =>
    setNeeds((prev) => (prev.includes(need) ? prev.filter((n) => n !== need) : [...prev, need]));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      return;
    }
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/proposals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          serviceCategory,
          budgetRange: budgetRange ?? 'Not specified',
          message: message.trim(),
          proposalEstimateData: estimate
            ? { ...estimate, assignedLead: lead }
            : {
                totalCost: 0,
                timelineWeeks: 4,
                selectedServices: needs.length ? needs : ['Not sure yet'],
                tierName: 'GROWTH',
                assignedLead: lead,
              },
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to submit proposal request');
      }

      const data = await res.json();
      setSubmissionResponse({
        proposalId: data.proposalId,
        referenceCode: data.referenceCode,
        estimatedSprintStart: data.estimatedSprintStart,
        assignedLead: data.assignedLead || lead,
      });
      setIsSubmitted(true);
    } catch (err: any) {
      console.error('Proposal submission failed:', err);
      // Never show a fake confirmation: the visitor must know the request did not reach us.
      setErrorMessage("We couldn't send your request just now. Please try again in a few minutes.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadSow = async () => {
    if (!submissionResponse?.proposalId) return;
    try {
      const res = await fetch(`/api/proposals/${submissionResponse.proposalId}/generate-sow`, {
        method: 'POST',
      });
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Altivio_SOW_${submissionResponse.referenceCode}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error('Failed to download SOW PDF:', err);
    }
  };

  const handleBookDiscoveryCall = async () => {
    setIsBooking(true);
    try {
      const res = await fetch('/api/calendar/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          preferredDate: submissionResponse?.estimatedSprintStart,
          timeSlot: '10:00 AM PST',
        }),
      });
      const data = await res.json();
      setBookingConfirmed(data.details);
    } catch (err) {
      console.error('Failed to book discovery session:', err);
    } finally {
      setIsBooking(false);
    }
  };

  const handleCopySummary = () => {
    const text = `Altivio Project Request\nRef: ${submissionResponse?.referenceCode || 'ALT-2026'}\nClient: ${name} (${email})\nBudget: ${budgetRange ?? 'Not specified'}\nNeeds: ${serviceCategory}\nBrief: ${message}`;
    navigator.clipboard.writeText(text);
    setCopiedQuote(true);
    setTimeout(() => setCopiedQuote(false), 2000);
  };

  return (
    <section id="contact" className="py-16 md:py-24 bg-white dark:bg-slate-950 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="stack-forest rounded-[28px] overflow-hidden p-6 sm:p-10 lg:p-14 grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-10 lg:gap-14">
          {/* ---------- Left: invitation and what happens next ---------- */}
          <div className="text-white flex flex-col">
            <h2 className="text-[clamp(2.25rem,3.8vw,3.5rem)] text-white text-balance">
              Let's build something great together.
            </h2>
            <p className="mt-5 text-base sm:text-lg leading-relaxed text-white/75 max-w-md">
              Tell us about your idea and we'll send you a free proposal.
            </p>

            <div className="mt-10">
              <h3 className="text-sm text-white/60">What happens next</h3>
              <ol className="mt-4 space-y-5">
                {NEXT_STEPS.map((step, i) => (
                  <li key={step.title} className="flex gap-4">
                    <span className="shrink-0 w-8 h-8 rounded-full border border-white/30 flex items-center justify-center text-sm tabular-nums">
                      {i + 1}
                    </span>
                    <span>
                      <span className="block text-[15px] text-white">{step.title}</span>
                      <span className="block text-sm text-white/65 mt-0.5">{step.desc}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="mt-10 lg:mt-auto pt-6 border-t border-white/15 flex items-start gap-3 text-sm text-white/75">
              <ShieldCheck className="w-5 h-5 shrink-0 text-white/80" />
              <span>We sign a confidentiality agreement (NDA) before you share any details.</span>
            </div>
          </div>

          {/* ---------- Right: form card ---------- */}
          <div className="rounded-[20px] bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.5)]">
            {isSubmitted ? (
              <div className="text-center py-4 space-y-6">
                <div className="w-14 h-14 rounded-full bg-purple-600 dark:bg-purple-300 text-white dark:text-slate-900 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="font-display text-2xl text-slate-900 dark:text-white">Thanks, {name.split(' ')[0]}. We have your request.</h3>
                  <p className="mt-2 text-[15px] text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                    Your reference is <strong className="text-slate-900 dark:text-white">{submissionResponse?.referenceCode}</strong>.
                    {' '}Your project lead is <strong className="text-slate-900 dark:text-white">{(submissionResponse?.assignedLead || lead).replace(/\s*\(.*\)$/, '')}</strong>,
                    {' '}and the earliest start date is <strong className="text-slate-900 dark:text-white">{submissionResponse?.estimatedSprintStart}</strong>.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                  <div className="rounded-xl bg-slate-100 dark:bg-slate-800 p-4 flex flex-col justify-between">
                    <div>
                      <span className="text-sm text-slate-900 dark:text-white block">Project outline</span>
                      <span className="text-[13px] text-slate-600 dark:text-slate-400 mt-0.5 block">
                        A printable summary of what we will deliver and when.
                      </span>
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      <button
                        onClick={() => setIsSowModalOpen(true)}
                        className="flex-1 h-9 rounded-full bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-[13px] inline-flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        View
                      </button>
                      <button
                        onClick={handleDownloadSow}
                        className="flex-1 h-9 btn-ink text-[13px] inline-flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        PDF
                      </button>
                    </div>
                  </div>

                  <div className="rounded-xl bg-slate-100 dark:bg-slate-800 p-4 flex flex-col justify-between">
                    <div>
                      <span className="text-sm text-slate-900 dark:text-white block">Free intro call</span>
                      <span className="text-[13px] text-slate-600 dark:text-slate-400 mt-0.5 block">
                        {bookingConfirmed ? `Booked for ${bookingConfirmed.date}` : 'Book a free 30-minute call with us.'}
                      </span>
                    </div>
                    {bookingConfirmed ? (
                      <div className="mt-3 text-[13px] text-purple-700 dark:text-purple-300 inline-flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5" />
                        Confirmed: {bookingConfirmed.time}
                      </div>
                    ) : (
                      <button
                        onClick={handleBookDiscoveryCall}
                        disabled={isBooking}
                        className="mt-3 h-9 btn-ink text-[13px] inline-flex items-center justify-center cursor-pointer disabled:opacity-60"
                      >
                        {isBooking ? 'Booking...' : 'Book my call'}
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={handleCopySummary}
                    className="h-9 px-4 rounded-full border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-[13px] inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    {copiedQuote ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedQuote ? 'Copied!' : 'Copy summary'}
                  </button>
                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      setMessage('');
                      setBookingConfirmed(null);
                    }}
                    className="h-9 px-4 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-[13px] cursor-pointer"
                  >
                    Send another request
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <fieldset>
                  <legend className="text-[15px] text-slate-900 dark:text-white">
                    What do you need? <span className="text-slate-500 dark:text-slate-400">Pick any</span>
                  </legend>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {NEEDS.map((need) => {
                      const active = needs.includes(need);
                      return (
                        <button key={need} type="button" aria-pressed={active} onClick={() => toggleNeed(need)} className={chipClass(active)}>
                          {active && <Check className="w-3.5 h-3.5" />}
                          {need}
                        </button>
                      );
                    })}
                  </div>
                </fieldset>

                <fieldset>
                  <legend className="text-[15px] text-slate-900 dark:text-white">Your budget</legend>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {BUDGET_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        aria-pressed={budgetRange === option.value}
                        onClick={() => setBudgetRange((prev) => (prev === option.value ? null : option.value))}
                        className={chipClass(budgetRange === option.value)}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </fieldset>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="contact-name" className="text-[15px] text-slate-900 dark:text-white">Name</label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      autoComplete="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      className={inputClass}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="contact-email" className="text-[15px] text-slate-900 dark:text-white">Email</label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@company.com"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="contact-message" className="text-[15px] text-slate-900 dark:text-white">Tell us about your project</label>
                  <textarea
                    id="contact-message"
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="What would you like to create? Any deadlines or must-haves?"
                    className={`${inputClass} h-auto py-3 resize-y`}
                  />
                </div>

                {estimate && (
                  <div className="rounded-xl bg-slate-100 dark:bg-slate-800 px-4 py-3 flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] text-slate-600 dark:text-slate-400">Your estimate</div>
                      <div className="text-[15px] text-slate-900 dark:text-white">
                        ${estimate.totalCost.toLocaleString()} · about {estimate.timelineWeeks} weeks
                      </div>
                      <div className="text-[13px] text-slate-600 dark:text-slate-400 mt-0.5">{estimate.selectedServices.join(', ')}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setEstimateDismissed(true)}
                      aria-label="Remove the estimate from this request"
                      className="p-1 rounded-full text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {showLead && (
                  <div className="flex items-center gap-3">
                    <span className="shrink-0 w-9 h-9 rounded-full bg-purple-600 dark:bg-purple-300 text-white dark:text-slate-900 flex items-center justify-center text-[13px] font-medium">
                      {initialsOf(leadName)}
                    </span>
                    <span className="text-[15px] text-slate-700 dark:text-slate-300">
                      Your project lead: <span className="text-slate-900 dark:text-white">{leadName}</span>
                    </span>
                  </div>
                )}

                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-ink w-full h-13 py-3.5 text-[15px] inline-flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <span>Sending...</span>
                    ) : (
                      <>
                        <span>Get a proposal</span>
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                      </>
                    )}
                  </button>
                  {errorMessage && (
                    <p role="alert" className="mt-3 text-center text-[13px] text-rose-700 dark:text-rose-300">
                      {errorMessage}
                    </p>
                  )}
                  <p className="mt-3 text-center text-[13px] text-slate-500 dark:text-slate-400">
                    No spam, ever. Everything you share stays confidential.
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Statement of Work Preview & Reader Modal */}
      {submissionResponse && (
        <StatementOfWorkModal
          isOpen={isSowModalOpen}
          onClose={() => setIsSowModalOpen(false)}
          onDownloadPdf={handleDownloadSow}
          proposalData={{
            referenceCode: submissionResponse.referenceCode,
            proposalId: submissionResponse.proposalId,
            clientName: name || 'Client Sponsor',
            clientEmail: email || 'sponsor@client.com',
            estimatedSprintStart: submissionResponse.estimatedSprintStart,
            assignedLead: submissionResponse.assignedLead || lead,
            totalCost: estimate?.totalCost ?? 0,
            timelineWeeks: estimate?.timelineWeeks || 4,
            tierName: estimate?.tierName || 'GROWTH',
            selectedServices: estimate?.selectedServices || (needs.length ? needs : ['Not sure yet']),
          }}
        />
      )}
    </section>
  );
};
