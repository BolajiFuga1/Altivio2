import React from 'react';
import { ServiceItem } from '../types';
import { ServiceWireframeIllustration } from './ServiceWireframeIllustration';
import { X, Check, Clock, DollarSign, Layers, ArrowRight } from 'lucide-react';

interface ServiceDetailModalProps {
  service: ServiceItem | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToScope: (serviceId: string) => void;
  isAddedToScope: boolean;
}

export const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({
  service,
  isOpen,
  onClose,
  onAddToScope,
  isAddedToScope
}) => {
  if (!isOpen || !service) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200/90 dark:border-slate-800 overflow-hidden max-h-[90vh] flex flex-col text-slate-900 dark:text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header bar */}
        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-950/70">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-purple-700 dark:text-purple-400 tracking-wide uppercase">
              {service.categoryLabel}
            </span>
            <span className="text-slate-300 dark:text-slate-600">·</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">Altivio Spec</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable content body */}
        <div className="p-6 overflow-y-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-display">
                {service.name}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                {service.fullDesc}
              </p>
            </div>
            <div className="w-36 h-28 shrink-0 bg-slate-50 dark:bg-slate-950 p-2 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center justify-center self-center sm:self-auto">
              <ServiceWireframeIllustration type={service.wireframeType} isSelected={true} />
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 gap-3 py-3 px-4 bg-slate-50 dark:bg-slate-950/80 rounded-xl border border-slate-200/60 dark:border-slate-800 text-xs">
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <Clock className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
              <span>Usual time to finish: <strong className="text-slate-900 dark:text-white">{service.timeline}</strong></span>
            </div>
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <DollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>Starting price: <strong className="text-slate-900 dark:text-white font-mono">${service.basePrice.toLocaleString()}</strong></span>
            </div>
          </div>

          {/* Standard Deliverables */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              What you get
            </h4>
            <div className="space-y-2">
              {service.deliverables.map((item, index) => (
                <div key={index} className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-300">
                  <div className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0 mt-0.5 border border-transparent dark:border-emerald-800/60">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Altivio Quality Standard */}
          <div className="p-4 bg-purple-50/70 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900/60 rounded-xl text-xs text-purple-900 dark:text-purple-200">
            <strong className="font-semibold block mb-1">Our promise</strong>
            You fully own everything we make for you: all code, designs and files. You also get clear instructions and support so your team can take it from there.
          </div>
        </div>

        {/* Modal Footer actions */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
          >
            Back to Services
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onAddToScope(service.id);
              }}
              className={`px-5 py-2.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                isAddedToScope
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                  : 'btn-ink text-slate-950 border border-transparent'
              }`}
            >
              {isAddedToScope ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Added to estimate</span>
                </>
              ) : (
                <>
                  <span>Add to my estimate</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
