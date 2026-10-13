import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ServicesSection } from './components/ServicesSection';
import { AiSolutionsSection } from './components/AiSolutionsSection';
import { ServiceDetailModal } from './components/ServiceDetailModal';
import { PortfolioSection } from './components/PortfolioSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { ProjectDemoModal } from './components/ProjectDemoModal';
import { CostEstimator } from './components/CostEstimator';
import { ApproachSection } from './components/ApproachSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { Reveal } from './components/Reveal';
import { ALL_SERVICES } from './data/servicesData';
import { ServiceItem, PortfolioProject } from './types';

export default function App() {
  // Global selection state for the scope/cost estimator - Starts completely empty so the client chooses
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);
  
  // Modal states
  const [activeServiceModal, setActiveServiceModal] = useState<ServiceItem | null>(null);
  const [activeDemoProject, setActiveDemoProject] = useState<PortfolioProject | null>(null);

  // Proposal auto-fill state
  const [proposalData, setProposalData] = useState<{
    totalCost: number;
    timelineWeeks: number;
    selectedServices: string[];
    tierName: string;
    assignedLead?: string;
    squadSummary?: string;
  } | null>(null);

  // Handlers
  const handleToggleService = (serviceId: string) => {
    setSelectedServiceIds((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const handleSelectServices = (ids: string[]) => {
    setSelectedServiceIds(ids);
  };

  const handleAttachToProposal = (estimateSummary: {
    totalCost: number;
    timelineWeeks: number;
    selectedServices: string[];
    tierName: string;
  }) => {
    setProposalData(estimateSummary);
    // Smooth scroll down to contact section
    const contactElem = document.getElementById('contact');
    if (contactElem) {
      contactElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleContactForSimilarProject = (projectName: string) => {
    setProposalData({
      totalCost: 45000,
      timelineWeeks: 8,
      selectedServices: [`Similar Platform to ${projectName}`, 'Full Product Architecture'],
      tierName: 'GROWTH'
    });
    const contactElem = document.getElementById('contact');
    if (contactElem) {
      contactElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToServices = () => {
    const el = document.getElementById('services');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // Adds AI Solutions to the estimate (without removing it if already chosen) and opens the estimator.
  const handleAiEstimate = () => {
    setSelectedServiceIds((prev) => (prev.includes('ai-engineering') ? prev : [...prev, 'ai-engineering']));
    scrollToEstimator();
  };

  const scrollToEstimator = () => {
    const el = document.getElementById('estimator');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col bg-white dark:bg-[#0E0E11] text-slate-900 dark:text-slate-100 selection:bg-slate-200 selection:text-slate-950 transition-colors duration-200">
        {/* Top Bar Navigation */}
        <Navbar onOpenEstimator={scrollToEstimator} />

        {/* Hero Section */}
        <main className="grow">
          <Hero
            onExploreClick={scrollToServices}
            onEstimateClick={scrollToEstimator}
          />

          {/* Services Showcase (All 16 services + categories) */}
          <Reveal>
            <ServicesSection
              selectedServiceIds={selectedServiceIds}
              onToggleService={handleToggleService}
              onOpenServiceModal={(service) => setActiveServiceModal(service)}
            />
          </Reveal>

          {/* AI Solutions spotlight */}
          <Reveal>
            <AiSolutionsSection onGetEstimate={handleAiEstimate} />
          </Reveal>

          {/* Portfolio & Interactive Prototype Demos */}
          <Reveal>
            <PortfolioSection
              onOpenDemo={(project) => setActiveDemoProject(project)}
            />
          </Reveal>

          {/* Client Success Stories & Social Proof */}
          <Reveal>
            <TestimonialsSection />
          </Reveal>

          {/* Interactive Scope & Cost Estimator */}
          <Reveal>
            <CostEstimator
              selectedServiceIds={selectedServiceIds}
              onToggleService={handleToggleService}
              onSelectServices={handleSelectServices}
              onAttachToProposal={handleAttachToProposal}
            />
          </Reveal>

          {/* Engineering Standards & Methodology */}
          <Reveal>
            <ApproachSection />
          </Reveal>

          {/* Let's Build Something Altivio - Proposal / Contact Desk */}
          <Reveal>
            <ContactSection proposalEstimateData={proposalData} />
          </Reveal>
        </main>

        {/* Footer */}
        <Footer />

        {/* Service Detail Drawer / Modal */}
        <ServiceDetailModal
          service={activeServiceModal}
          isOpen={Boolean(activeServiceModal)}
          onClose={() => setActiveServiceModal(null)}
          onAddToScope={(serviceId) => handleToggleService(serviceId)}
          isAddedToScope={
            activeServiceModal ? selectedServiceIds.includes(activeServiceModal.id) : false
          }
        />

        {/* Interactive Project Demo Modal ("Product Demo" as shown in user image) */}
        <ProjectDemoModal
          project={activeDemoProject}
          isOpen={Boolean(activeDemoProject)}
          onClose={() => setActiveDemoProject(null)}
          onContactForSimilar={handleContactForSimilarProject}
        />
      </div>
    </ThemeProvider>
  );
}
