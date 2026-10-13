import React from 'react';
import { X, Download, Printer, CheckCircle2, Shield, Calendar, DollarSign, Sparkles } from 'lucide-react';

interface StatementOfWorkModalProps {
  isOpen: boolean;
  onClose: () => void;
  proposalData: {
    referenceCode: string;
    proposalId: string;
    clientName: string;
    clientEmail: string;
    estimatedSprintStart: string;
    assignedLead: string;
    totalCost: number;
    timelineWeeks: number;
    tierName: string;
    selectedServices: string[];
  } | null;
  onDownloadPdf: () => void;
}

export const StatementOfWorkModal: React.FC<StatementOfWorkModalProps> = ({
  isOpen,
  onClose,
  proposalData,
  onDownloadPdf
}) => {
  if (!isOpen || !proposalData) return null;

  const totalCost = proposalData.totalCost || 39900;
  const m1 = Math.round(totalCost * 0.4);
  const m2 = Math.round(totalCost * 0.3);
  const m3 = Math.round(totalCost * 0.3);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-4xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Action Header (Not printed) */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-bold bg-purple-900 text-purple-200 px-2.5 py-0.5 rounded-full">
              {proposalData.referenceCode}
            </span>
            <span className="font-display font-bold text-sm sm:text-base text-white">
              Project Outline (Statement of Work)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onDownloadPdf}
              className="px-3.5 py-1.5 btn-ink text-slate-950 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
              title="Print Document"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              aria-label="Close SOW preview"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Document Body */}
        <div className="p-6 sm:p-10 overflow-y-auto space-y-8 bg-[#FCFCFD] dark:bg-slate-950">
          
          {/* Document Header Letterhead */}
          <div className="p-6 bg-slate-950 text-white rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm border border-transparent dark:border-slate-800">
            <div>
              <div className="font-display font-black text-2xl tracking-wider text-white">
                ALTIVIO
              </div>
              <div className="text-[10px] text-lime-300 font-mono tracking-widest uppercase mt-0.5">
                Elevating Ideas into Digital Reality
              </div>
            </div>
            <div className="sm:text-right text-xs">
              <span className="text-white font-mono font-bold block">
                MASTER SCOPE SPECIFICATION
              </span>
              <span className="text-slate-400 font-mono text-[11px]">
                CONFIDENTIAL · REF: {proposalData.referenceCode}
              </span>
            </div>
          </div>

          {/* Title & Description */}
          <div>
            <h2 className="text-2xl font-black font-display text-slate-950 dark:text-white tracking-tight">
              STATEMENT OF WORK & SCOPE OF SERVICES
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              What we will deliver, key milestones, our guarantees, and who owns what.
            </p>
          </div>

          {/* Sponsor & Engagement Metadata Card */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 bg-slate-50 dark:bg-slate-900/80 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500 block mb-1">
                Client:
              </span>
              <div className="font-bold text-slate-900 dark:text-white text-sm">{proposalData.clientName}</div>
              <div className="text-slate-500 dark:text-slate-400 font-mono text-[11px]">{proposalData.clientEmail}</div>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500 block mb-1">
                Timeline:
              </span>
              <div className="font-bold text-slate-900 dark:text-white text-sm">
                {proposalData.timelineWeeks} weeks
              </div>
              <div className="text-purple-700 dark:text-purple-400 font-semibold text-[11px]">
                Start date: {proposalData.estimatedSprintStart}
              </div>
            </div>
          </div>

          {/* 1. Executive Summary */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-1">
              1. Executive Summary & Engagement Objective
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Altivio is commissioned by <strong className="text-slate-900 dark:text-white">{proposalData.clientName}</strong> to design, architect, engineer, and deploy high-velocity digital capabilities to elevate the sponsor's strategic product roadmap into digital reality. All deliverables shall conform to strict enterprise code standards, sub-second web performance, responsive UI ergonomics, and zero-debt system design.
            </p>
          </div>

          {/* 2. Approved Scope Modules & Deliverables */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-1">
              2. Approved Scope Modules & Deliverables Included
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {proposalData.selectedServices.map((service, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-white dark:bg-slate-900/80 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-2xs"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{service}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">Module 0{idx + 1}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Financial Allocation & Milestones */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                3. Financial Investment & Milestone Schedule
              </h3>
              <span className="text-sm font-extrabold font-display text-purple-900 dark:text-purple-300">
                Total price: ${totalCost.toLocaleString()} USD
              </span>
            </div>

            <div className="space-y-2">
              <div className="p-3.5 bg-white dark:bg-slate-900/80 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">Milestone 1: Kickoff & Technical Architecture Blueprint</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">Figma design system tokens, database schemas, and wireframe prototypes.</div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold font-mono text-slate-900 dark:text-white">${m1.toLocaleString()}</div>
                  <div className="text-[10px] text-purple-700 dark:text-purple-400 font-semibold">40% upon signing</div>
                </div>
              </div>

              <div className="p-3.5 bg-white dark:bg-slate-900/80 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">Milestone 2: Interactive Prototype & Core Engine</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">Full-stack backend endpoints, API authentication, and fluid UI choreo.</div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold font-mono text-slate-900 dark:text-white">${m2.toLocaleString()}</div>
                  <div className="text-[10px] text-purple-700 dark:text-purple-400 font-semibold">30% upon alpha approval</div>
                </div>
              </div>

              <div className="p-3.5 bg-white dark:bg-slate-900/80 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">Milestone 3: QA Hardening, Deployment & 100% IP Handover</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">Automated test suites, production rollout, and complete repository handover.</div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold font-mono text-slate-900 dark:text-white">${m3.toLocaleString()}</div>
                  <div className="text-[10px] text-purple-700 dark:text-purple-400 font-semibold">30% upon launch</div>
                </div>
              </div>
            </div>
          </div>

          {/* 4. Intellectual Property & Commercial Warranties */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-1">
              4. Intellectual Property Transfer & Commercial Warranties
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Upon final milestone disbursement, all custom source code repositories, design tokens, Figma libraries, vectorized brand assets, neural model fine-tuning weights, and print dielines created exclusively by Altivio transfer <strong>100% irrevocably and perpetually</strong> to <strong className="text-slate-900 dark:text-white">{proposalData.clientName}</strong>. Altivio includes a 60-day post-launch warranty covering defect remediation and deployment stability.
            </p>
          </div>

          {/* 5. Execution Signature Blocks */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
            <div className="p-4 bg-slate-50 dark:bg-slate-900/80 rounded-xl border border-slate-200 dark:border-slate-800 text-xs space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                On Behalf of Altivio, Inc.
              </span>
              <div className="font-bold text-purple-950 dark:text-purple-300 font-display text-sm">{proposalData.assignedLead}</div>
              <div className="text-slate-500 dark:text-slate-400 text-[11px]">Principal Partner & Solutions Architect</div>
              <div className="text-[10px] text-emerald-700 dark:text-emerald-400 font-mono font-semibold pt-1">
                ✓ Cryptographically Verified & Executed
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-900/80 rounded-xl border border-slate-200 dark:border-slate-800 text-xs space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                On Behalf of Client / Sponsor
              </span>
              <div className="font-bold text-slate-900 dark:text-white font-display text-sm">{proposalData.clientName}</div>
              <div className="text-slate-500 dark:text-slate-400 text-[11px]">{proposalData.clientEmail}</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono pt-1">
                To be signed after our intro call
              </div>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-100 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shrink-0">
          <span className="text-slate-500 dark:text-slate-400">
            Prepared by Altivio · Ref: {proposalData.referenceCode}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-lg font-semibold cursor-pointer transition-colors"
            >
              Close
            </button>
            <button
              onClick={onDownloadPdf}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white dark:text-slate-950 rounded-lg font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF File</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
