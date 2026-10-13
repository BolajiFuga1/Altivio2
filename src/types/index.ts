export type ServiceCategory = 
  | 'digital-product' 
  | 'brand-visual' 
  | 'marketing-growth' 
  | 'packaging-physical';

export interface ServiceItem {
  id: string;
  name: string;
  category: ServiceCategory;
  categoryLabel: string;
  shortDesc: string;
  fullDesc: string;
  deliverables: string[];
  timeline: string;
  basePrice: number;
  highlighted?: boolean;
  wireframeType: 'ui-wireframe' | 'code-browser' | 'brand-mark' | 'box-package' | 'mobile-mock' | 'neural-network' | 'chart-growth';
}

export interface PortfolioProject {
  id: string;
  title: string;
  category: string;
  client: string;
  image: string;
  headline: string;
  description: string;
  stats: { label: string; value: string }[];
  deliverables: string[];
  techStack: string[];
  liveUrl?: string;
  previewType: 'telemedicine' | 'fintech' | 'luxury-brand' | 'ai-dashboard';
}

export interface ProjectScopeOption {
  id: string;
  name: string;
  price: number;
  category: string;
  complexityModifier: number;
  estimatedWeeks: number;
}

export interface EstimatorCalculation {
  selectedServiceIds: string[];
  projectScale: 'mvp' | 'growth' | 'enterprise';
  platforms: ('web' | 'ios' | 'android' | 'cloud')[];
  deliverySpeed: 'standard' | 'accelerated' | 'blitz';
  includeMaintenance: boolean;
}
