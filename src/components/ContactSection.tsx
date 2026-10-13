import React, { useState, useEffect, useMemo } from 'react';
import { AltivioLogo } from './AltivioLogo';
import { Send, CheckCircle2, Sparkles, ArrowRight, ShieldCheck, Download, Copy, Check, FileText, Users } from 'lucide-react';
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

const BUDGET_OPTIONS = [
  'Under $15k (one focused task)',
  '$15k - $30k (first version of a product)',
  '$30k - $60k (complete product)',
  '$60k+ (large project)',
];

// Picks the budget option that matches an estimate total.
const budgetOptionFor = (total: number) =>
  total < 15000 ? BUDGET_OPTIONS[0] : total < 30000 ? BUDGET_OPTIONS[1] : total < 60000 ? BUDGET_OPTIONS[2] : BUDGET_OPTIONS[3];

export const ContactSection: React.FC<ContactSectionProps> = ({ proposalEstimateData }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [serviceCategory, setServiceCategory] = useState('Everything (full product and brand)');
  const [budgetRange, setBudgetRange] = useState(BUDGET_OPTIONS[1]);
  const [message, setMessage] = useState('');
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

  // Automatically determine the lead architect based on estimator link or form inputs
  const currentLead = useMemo(() => {
    if (proposalEstimateData?.assignedLead) {
      return proposalEstimateData.assignedLead;
    }
    const matched = resolveAssignedSquad(
      proposalEstimateData?.selectedServices || [],
      `${serviceCategory} ${message}`
    );
    return `${matched.lead.name} (${matched.lead.role})`;
  }, [proposalEstimateData, serviceCategory, message]);

  // If proposalEstimateData updates, auto-populate the form
  useEffect(() => {
    if (proposalEstimateData) {
      setBudgetRange(budgetOptionFor(proposalEstimateData.totalCost));
      setMessage(
        `Hi Altivio team,\n\nI used your Cost Estimator and I'm interested in: ${proposalEstimateData.selectedServices.join(', ')}.\n\nEstimated price: $${proposalEstimateData.totalCost.toLocaleString()}\nEstimated time to finish: about ${proposalEstimateData.timelineWeeks} weeks\n\nI'd like to book a call to talk it through.`
      );
    }
  }, [proposalEstimateData]);

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
          budgetRange,
          message: message.trim(),
          proposalEstimateData: proposalEstimateData
            ? { ...proposalEstimateData, assignedLead: currentLead }
            : {
                totalCost: 0,
                timelineWeeks: 4,
                selectedServices: [serviceCategory],
                tierName: 'GROWTH',
                assignedLead: currentLead
              }
        })
      });

      if (!res.ok) {
        throw new Error('Failed to submit proposal request');
      }

      const data = await res.json();
      setSubmissionResponse({
        proposalId: data.proposalId,
        referenceCode: data.referenceCode,
        estimatedSprintStart: data.estimatedSprintStart,
        assignedLead: data.assignedLead || currentLead
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
        method: 'POST'
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
          timeSlot: '10:00 AM PST'
        })
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
    const text = `Altivio Project Request\nRef: ${submissionResponse?.referenceCode || 'ALT-2026'}\nClient: ${name} (${email})\nBudget: ${budgetRange}\nCategory: ${serviceCategory}\nBrief: ${message}`;
    navigator.clipboard.writeText(text);
    setCopiedQuote(true);
    setTimeout(() => setCopiedQuote(false), 2000);
  };

  return (
    <section id="contact" className="relative pt-24 pb-20 bg-white dark:bg-slate-950 overflow-hidden transition-colors duration-200">
      {/* Sleek organic ribbon wave matching the user's uploaded image (bottom-right) */}
      <div className="absolute top-0 left-0 right-0 overflow-hidden leading-none pointer-events-none -translate-y-1">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-16 sm:h-24 object-cover"
        >
          {/* Lavender/Dark smooth wave matching preceding section */}
          <path
            d="M0,40 C320,110 480,-10 800,50 C1120,110 1280,10 1440,40 L1440,0 L0,0 Z"
            fill="currentColor"
            className="text-[#FAF9F6] dark:text-[#0E0E11] transition-colors"
          />
          {/* Lime flowing wave ribbon */}
          <path
            d="M0,60 C380,120 540,10 920,80 C1200,130 1360,40 1440,70"
            stroke="#6B6862"
            strokeWidth="3.5"
            fill="none"
          />
          {/* Lilac flowing wave ribbon */}
          <path
            d="M0,45 C300,90 620,0 980,65 C1240,110 1380,30 1440,55"
            stroke="#CFCBC2"
            strokeWidth="2.5"
            fill="none"
          />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Brand Statement (as in user image: "Let's Build Something Altivio") */}
          <div className="lg:col-span-5 space-y-6">
            <AltivioLogo size="lg" />

            <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white font-display tracking-tight leading-tight">
              Let's Build Something <br />
              <span className="text-purple-700 dark:text-purple-400">Great Together</span>
            </h2>

            <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed max-w-md">
              Tell us about your idea. We will help you bring it to life, online and in the real world.
            </p>

            {/* Direct Contact Points */}
            <div className="pt-4 space-y-3 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>We reply within <strong className="text-slate-900 dark:text-white font-semibold">4 business hours</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span>We sign a confidentiality agreement (NDA) before you share details</span>
              </div>
            </div>

            {/* Quick Consultation Badge */}
            <div className="p-4 bg-purple-50/70 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900/60 rounded-2xl max-w-sm">
              <div className="flex items-center gap-2 text-xs font-bold text-purple-900 dark:text-purple-200">
                <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                <span>Talk directly to senior experts</span>
              </div>
              <p className="text-[11px] text-purple-800/80 dark:text-purple-300/80 mt-1">
                Your first conversation is always with a senior developer and a senior designer, not a salesperson.
              </p>
            </div>
          </div>

          {/* Right Column: Proposal Request Form (as in user image: Name, Email, Message, "Get a Proposal") */}
          <div className="lg:col-span-7">
            <div className="bg-white dark:bg-slate-900/90 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-lg p-6 sm:p-10 relative">
              
              {isSubmitted ? (
                <div className="text-center py-6 space-y-6 animate-in fade-in duration-300">
                  <div className="w-14 h-14 btn-ink text-slate-950 rounded-full flex items-center justify-center mx-auto shadow-md">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <div>
                    <div className="flex items-center justify-center gap-2 flex-wrap">
                      <span className="text-[11px] font-mono uppercase tracking-wider text-purple-700 dark:text-purple-300 bg-purple-100/70 dark:bg-purple-950/80 border border-transparent dark:border-purple-800 px-3 py-1 rounded-full font-bold">
                        Reference: {submissionResponse?.referenceCode}
                      </span>
                      <span className="text-[10px] font-mono text-emerald-800 dark:text-emerald-300 bg-emerald-100/80 dark:bg-emerald-950/60 border border-transparent dark:border-emerald-800/60 px-2.5 py-1 rounded-full font-semibold flex items-center gap-1">
                        <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                        Received · Our team has been notified
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white font-display mt-3">
                      Thanks! We have received your request
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2 max-w-md mx-auto leading-relaxed">
                      Thank you, <strong className="text-slate-900 dark:text-white">{name}</strong>. Your project lead: <strong className="text-slate-900 dark:text-white">{submissionResponse?.assignedLead}</strong>. Earliest start date: <strong className="text-purple-700 dark:text-purple-400">{submissionResponse?.estimatedSprintStart}</strong>.
                    </p>
                  </div>

                  {/* Actions Bar */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto text-left">
                    <div className="p-4 bg-white dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs flex flex-col justify-between">
                      <div>
                        <span className="text-xs font-bold text-slate-900 dark:text-white block">Project outline</span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 block">A printable summary of what we will deliver and when.</span>
                      </div>
                      <div className="mt-3 flex items-center gap-2">
                        <button
                          onClick={() => setIsSowModalOpen(true)}
                          className="flex-1 px-2.5 py-2 bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 dark:hover:bg-purple-900/60 text-purple-900 dark:text-purple-200 border border-purple-200 dark:border-purple-800 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>View</span>
                        </button>
                        <button
                          onClick={handleDownloadSow}
                          className="flex-1 px-2.5 py-2 bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-slate-950 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>PDF</span>
                        </button>
                      </div>
                    </div>

                    <div className="p-4 bg-white dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs flex flex-col justify-between">
                      <div>
                        <span className="text-xs font-bold text-slate-900 dark:text-white block">Free intro call</span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 block">
                          {bookingConfirmed ? `Booked for ${bookingConfirmed.date}` : 'Book a free 30-minute call with us.'}
                        </span>
                      </div>
                      {bookingConfirmed ? (
                        <div className="mt-3 p-2 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-lg text-[11px] text-emerald-800 dark:text-emerald-300 font-medium">
                          ✓ Confirmed: {bookingConfirmed.time}
                        </div>
                      ) : (
                        <button
                          onClick={handleBookDiscoveryCall}
                          disabled={isBooking}
                          className="mt-3 px-3 py-2 btn-ink text-slate-950 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>{isBooking ? 'Booking...' : 'Book my call'}</span>
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                    <button
                      onClick={handleCopySummary}
                      className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      {copiedQuote ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-500" />}
                      <span>{copiedQuote ? 'Copied!' : 'Copy summary'}</span>
                    </button>
                    <button
                      onClick={() => {
                        setIsSubmitted(false);
                        setMessage('');
                        setBookingConfirmed(null);
                      }}
                      className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-xs font-semibold cursor-pointer"
                    >
                      Send another request
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200/70 dark:border-slate-800">
                    <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                      Request a free proposal
                    </span>
                    {proposalEstimateData && (
                      <span className="text-xs text-purple-700 dark:text-purple-300 bg-purple-100/80 dark:bg-purple-950/80 border border-transparent dark:border-purple-800/60 px-2.5 py-0.5 rounded-full font-mono font-semibold">
                        Estimate added (${proposalEstimateData.totalCost.toLocaleString()})
                      </span>
                    )}
                  </div>

                  {/* Matched Lead Architect Indicator */}
                  <div className="p-3 bg-purple-50/80 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900/60 rounded-xl flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Users className="w-3.5 h-3.5 text-purple-700 dark:text-purple-400 shrink-0" />
                      <span className="text-slate-600 dark:text-slate-400">Your project lead:</span>
                      <strong className="text-purple-950 dark:text-purple-200 font-semibold">{currentLead}</strong>
                    </div>
                    <span className="text-[10px] text-purple-700 dark:text-purple-400 font-mono hidden sm:inline">Matched to you</span>
                  </div>

                  {/* Name field */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Name
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      className="w-full px-4 py-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-hidden focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
                    />
                  </div>

                  {/* Email field */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@company.com"
                      className="w-full px-4 py-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-hidden focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
                    />
                  </div>

                  {/* Service interest & Budget grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                        What do you need most?
                      </label>
                      <select
                        value={serviceCategory}
                        onChange={(e) => setServiceCategory(e.target.value)}
                        className="w-full px-3 py-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-purple-600 cursor-pointer"
                      >
                        <option>Everything (full product and brand)</option>
                        <option>AI tools</option>
                        <option>A website or mobile app</option>
                        <option>Website or app design (UI/UX)</option>
                        <option>Branding and logo</option>
                        <option>Packaging, lookbooks and printed goods</option>
                        <option>Marketing and Google search</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                        Your budget
                      </label>
                      <select
                        value={budgetRange}
                        onChange={(e) => setBudgetRange(e.target.value)}
                        className="w-full px-3 py-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-purple-600 cursor-pointer"
                      >
                        {BUDGET_OPTIONS.map((option) => (
                          <option key={option}>{option}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Message field */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Tell us about your project
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="What would you like to create? Any deadlines or must-haves?"
                      className="w-full px-4 py-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-hidden focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all resize-y"
                    />
                  </div>

                  {/* Primary CTA button matching the user's mockup: "Get a Proposal" */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 text-sm font-extrabold text-slate-950 btn-ink border border-transparent rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group cursor-pointer"
                    >
                      {isSubmitting ? (
                        <span>Sending...</span>
                      ) : (
                        <>
                          <span>Get a proposal</span>
                          <ArrowRight className="w-4 h-4 text-slate-950 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </button>
                  </div>

                  {errorMessage && (
                    <p role="alert" className="text-center text-[13px] text-rose-700 dark:text-rose-300">
                      {errorMessage}
                    </p>
                  )}
                  <p className="text-[11px] text-center text-slate-500 dark:text-slate-400 pt-1">
                    No spam, ever. Everything you share stays confidential.
                  </p>
                </form>
              )}

            </div>
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
            assignedLead: submissionResponse.assignedLead || currentLead,
            totalCost: proposalEstimateData?.totalCost ?? 0,
            timelineWeeks: proposalEstimateData?.timelineWeeks || 4,
            tierName: proposalEstimateData?.tierName || 'GROWTH',
            selectedServices: proposalEstimateData?.selectedServices || [serviceCategory]
          }}
        />
      )}
    </section>
  );
};
