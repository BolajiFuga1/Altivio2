import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react';
import { ArrowRight, Check, Plus } from 'lucide-react';
import { ALL_SERVICES, SERVICE_CATEGORIES } from '../data/servicesData';
import { ServiceItem } from '../types';
import telemedicineImage from '../assets/images/altivio_telemedicine_case_1790419310693.jpg';
import fintechImage from '../assets/images/altivio_fintech_mobile_case_1790419324246.jpg';
import aiDashboardImage from '../assets/images/altivio_ai_engineering_dashboard_1790419350794.jpg';
import luxuryImage from '../assets/images/altivio_luxury_packaging_case_1790419338324.jpg';

interface ServicesSectionProps {
  selectedServiceIds: string[];
  onToggleService: (serviceId: string) => void;
  onOpenServiceModal: (service: ServiceItem) => void;
}

// Real Altivio project photos shown as a hover preview. Marketing has no project photo yet,
// so it falls back to a brand colour panel.
const PREVIEW_BY_SERVICE: Record<string, string> = {
  'ai-engineering': aiDashboardImage,
  'mobile-app-dev': fintechImage,
  'web-development': telemedicineImage,
  'ui-ux-design': fintechImage,
  'website-management': telemedicineImage,
};
const PREVIEW_BY_CATEGORY: Record<string, string | undefined> = {
  'digital-product': telemedicineImage,
  'brand-visual': luxuryImage,
  'packaging-physical': luxuryImage,
};

const previewFor = (service: ServiceItem) => PREVIEW_BY_SERVICE[service.id] ?? PREVIEW_BY_CATEGORY[service.category];

const formatPrice = (amount: number) => `From $${amount.toLocaleString()}`;

// Category order follows the filter tabs (skipping "all").
const CATEGORY_ORDER = SERVICE_CATEGORIES.filter((c) => c.id !== 'all');

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  selectedServiceIds,
  onToggleService,
  onOpenServiceModal,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [hovered, setHovered] = useState<ServiceItem | null>(null);
  const [canHover, setCanHover] = useState(false);
  const reduce = useReducedMotion();

  // Cursor-following preview, driven by motion values so it never re-renders the list.
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const previewX = useSpring(pointerX, { stiffness: 260, damping: 28, mass: 0.6 });
  const previewY = useSpring(pointerY, { stiffness: 260, damping: 28, mass: 0.6 });

  useEffect(() => {
    const query = window.matchMedia('(hover: hover) and (pointer: fine)');
    const update = () => setCanHover(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  const groups = CATEGORY_ORDER.filter((c) => activeCategory === 'all' || c.id === activeCategory).map((c) => ({
    ...c,
    services: ALL_SERVICES.filter((s) => s.category === c.id),
  }));

  const selectedCount = selectedServiceIds.length;

  const scrollToEstimator = () => document.getElementById('estimator')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section
      id="services"
      className="py-24 md:py-32 bg-white dark:bg-slate-950 transition-colors duration-200"
      onPointerMove={(e) => {
        pointerX.set(e.clientX);
        pointerY.set(e.clientY);
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-2xl">
          <h2 className="text-[clamp(2.25rem,5vw,3.75rem)] text-slate-900 dark:text-white">Our Services</h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400">
            Everything your business needs, from logos and packaging to websites, mobile apps and AI tools.
          </p>
        </div>

        {/* Category filter */}
        <div className="mt-10 -mx-4 px-4 sm:mx-0 sm:px-0 flex gap-2 overflow-x-auto no-scrollbar">
          {SERVICE_CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`shrink-0 h-10 px-4 rounded-full text-sm whitespace-nowrap transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                    : 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Service index, grouped by category */}
        <div className="mt-12 md:mt-16 flex flex-col gap-14 md:gap-20" onPointerLeave={() => setHovered(null)}>
          {groups.map((group) => (
            <div key={group.id}>
              <div className="flex items-baseline justify-between gap-4 pb-4 border-b border-slate-900 dark:border-slate-200">
                <h3 className="font-display text-lg sm:text-xl text-slate-900 dark:text-white">{group.label}</h3>
                <span className="text-sm text-slate-500 dark:text-slate-400 tabular-nums">
                  {group.services.length} services
                </span>
              </div>

              <ul>
                {group.services.map((service) => {
                  const isAdded = selectedServiceIds.includes(service.id);
                  return (
                    <li
                      key={service.id}
                      onPointerEnter={() => canHover && setHovered(service)}
                      className="group grid grid-cols-[minmax(0,1fr)_auto] lg:grid-cols-[minmax(0,5fr)_minmax(0,4fr)_9.5rem_auto] items-center gap-x-6 gap-y-2 py-5 md:py-6 border-b border-slate-200 dark:border-slate-800 transition-colors hover:bg-slate-50 dark:hover:bg-slate-900/60"
                    >
                      <button
                        onClick={() => onOpenServiceModal(service)}
                        className="col-span-2 lg:col-span-1 text-left font-display text-[clamp(1.5rem,2.6vw,2.25rem)] leading-[1.1] tracking-[-0.02em] text-slate-900 dark:text-white cursor-pointer decoration-1 underline-offset-[6px] hover:underline"
                      >
                        {service.name}
                      </button>

                      <p className="col-span-2 lg:col-span-1 text-[15px] leading-relaxed text-slate-600 dark:text-slate-400">
                        {service.shortDesc}
                      </p>

                      <div className="mt-2 lg:mt-0 text-sm">
                        <div className="text-slate-900 dark:text-white tabular-nums">{formatPrice(service.basePrice)}</div>
                        <div className="text-slate-500 dark:text-slate-400">{service.timeline}</div>
                      </div>

                      <button
                        onClick={() => onToggleService(service.id)}
                        aria-pressed={isAdded}
                        aria-label={isAdded ? `Remove ${service.name} from estimate` : `Add ${service.name} to estimate`}
                        title={isAdded ? 'Added to your estimate' : 'Add to your estimate'}
                        className={`mt-2 lg:mt-0 justify-self-end w-11 h-11 rounded-full flex items-center justify-center transition-[background-color,transform] active:scale-95 cursor-pointer ${
                          isAdded
                            ? 'bg-purple-600 text-white dark:bg-purple-300 dark:text-slate-900'
                            : 'border border-slate-900 dark:border-slate-300 text-slate-900 dark:text-white hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-slate-900'
                        }`}
                      >
                        {isAdded ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* Estimate summary, shown while services are added and the list is on screen */}
        <AnimatePresence>
          {selectedCount > 0 && (
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="sticky bottom-6 z-20 mt-10 flex justify-center pointer-events-none"
            >
              <div className="pointer-events-auto flex items-center gap-4 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 pl-6 pr-2 py-2 shadow-[0_18px_50px_-18px_rgba(13,26,15,0.55)]">
                <span className="text-sm whitespace-nowrap">
                  {selectedCount} {selectedCount === 1 ? 'service' : 'services'} added
                </span>
                <button
                  onClick={scrollToEstimator}
                  className="h-10 px-5 rounded-full bg-white text-slate-900 dark:bg-slate-900 dark:text-white text-sm inline-flex items-center gap-2 whitespace-nowrap cursor-pointer"
                >
                  <span>Get an estimate</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Cursor-following project preview (desktop pointers only) */}
      <AnimatePresence>
        {canHover && hovered && (
          <motion.div
            key="preview"
            aria-hidden="true"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.2 }}
            style={{ x: reduce ? pointerX : previewX, y: reduce ? pointerY : previewY }}
            className="hidden lg:block fixed left-0 top-0 z-30 pointer-events-none"
          >
            <div className="ml-6 -mt-24 w-64 aspect-[4/3] rounded-2xl overflow-hidden shadow-[0_24px_60px_-20px_rgba(13,26,15,0.5)]">
              {previewFor(hovered) ? (
                <img src={previewFor(hovered)} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full ai-glow flex items-end p-4">
                  <span className="font-display text-lg leading-tight text-white">{hovered.name}</span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
