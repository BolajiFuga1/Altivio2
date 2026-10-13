import { PortfolioProject } from '../types';

export const PORTFOLIO_PROJECTS: PortfolioProject[] = [
  {
    id: 'telemedicine-platform',
    title: 'PulseCare Telemedicine Platform',
    category: 'Website & Mobile App',
    client: 'PulseCare Health Inc.',
    image: '/src/assets/images/altivio_telemedicine_case_1790419310693.jpg',
    headline: 'An online doctor service where patients can see a specialist by secure video call.',
    description: 'Altivio designed and built a complete online clinic that connects more than 40,000 patients with licensed specialists. Patients book a visit, share their health details, see a doctor on a private, smooth video call, and get prescriptions sent straight to their pharmacy.',
    stats: [
      { label: 'Patient appointments held', value: '142,000+' },
      { label: 'Faster for patients to get seen', value: '68%' },
      { label: 'Patient satisfaction rating', value: '4.9 / 5.0' }
    ],
    deliverables: [
      'A website that works on any device',
      'iPhone and Android apps for patients and doctors',
      'Private, secure video call rooms',
      'Connection to existing patient medical records',
      'A clear, calm design built for healthcare'
    ],
    techStack: ['Next.js', 'React Native', 'WebRTC', 'FastAPI', 'PostgreSQL', 'Tailwind CSS'],
    previewType: 'telemedicine',
    liveUrl: 'https://pulsecare.altivio-showcase.com'
  },
  {
    id: 'mobile-app-fintech',
    title: 'Aura Wealth & FinTech Mobile Platform',
    category: 'Mobile App Design & Development',
    client: 'Aura Financial Technologies',
    image: '/src/assets/images/altivio_fintech_mobile_case_1790419324246.jpg',
    headline: 'A smooth, modern banking app for saving, sending money and growing savings automatically.',
    description: 'We built a fast banking app for iPhone and Android that handled more than $450M in its first 9 months. Users log in with Face ID or a fingerprint, send money to friends instantly, and feel a gentle vibration to confirm every payment.',
    stats: [
      { label: 'People using it every month', value: '88,000+' },
      { label: 'App Store Rating', value: '4.9 ★ (12k reviews)' },
      { label: 'Money handled through the app', value: '$450M+' }
    ],
    deliverables: [
      'iPhone and Android apps',
      'More than 120 finished screen designs',
      'Extra-secure login with Face ID or fingerprint',
      'Live charts that update in real time',
      'Light and dark modes that are easy on the eyes'
    ],
    techStack: ['React Native', 'Swift', 'Kotlin', 'Go microservices', 'WebSockets', 'Tailwind'],
    previewType: 'fintech',
    liveUrl: 'https://aura.altivio-showcase.com'
  },
  {
    id: 'ai-engineering-synapse',
    title: 'SynapseML AI Research Assistant',
    category: 'AI Solutions & Website',
    client: 'Cognitive Dynamics Global',
    image: '/src/assets/images/altivio_ai_engineering_dashboard_1790419350794.jpg',
    headline: 'An AI assistant that reads thousands of financial documents and answers questions in seconds.',
    description: 'Altivio built an AI assistant for financial analysts. It searches more than 10 million company reports, finds the right answer in under half a second, and shows exactly where each fact came from so it can be checked.',
    stats: [
      { label: 'Time to answer a question', value: 'Under 0.4s' },
      { label: 'Analyst time saved', value: '74%' },
      { label: 'Accuracy of answers', value: '99.1%' }
    ],
    deliverables: [
      'AI helpers that split up and finish complex tasks',
      'Smart search that understands what you mean',
      'An interactive dashboard for exploring results',
      'Access controls that hide sensitive information',
      'Ongoing testing to keep answers accurate'
    ],
    techStack: ['Python', 'FastAPI', 'React 19', 'Qdrant Vector DB', 'Claude & Gemini API', 'Tailwind'],
    previewType: 'ai-dashboard',
    liveUrl: 'https://synapseml.altivio-showcase.com'
  },
  {
    id: 'luxury-packaging-brand',
    title: 'Aethelgard Haute Couture & Packaging',
    category: 'Brand Identity & Packaging Design',
    client: 'Aethelgard Paris',
    image: '/src/assets/images/altivio_luxury_packaging_case_1790419338324.jpg',
    headline: 'A complete luxury brand look: logo, shopping bags, clothing tags and a seasonal lookbook.',
    description: 'A complete brand look, in print and online, for an independent Paris fashion house. We designed thick, premium shopping bags with raised logos, metallic clothing tags, woven labels, and a 56-page lookbook for the new collection.',
    stats: [
      { label: 'Magazine and runway features', value: '34' },
      { label: 'Stores selling the brand worldwide', value: '18' },
      { label: 'Stock sold in stores', value: '96%' }
    ],
    deliverables: [
      'Full brand look and style guide',
      'Custom shopping bags with rope handles',
      'Raised-logo clothing tags and woven labels',
      'Seasonal lookbook in print and online',
      'Gift boxes and tissue-paper wrapping'
    ],
    techStack: ['Figma', 'Adobe Illustrator', 'Cinema 4D', 'InDesign', 'Pantone Formula Guide'],
    previewType: 'luxury-brand',
    liveUrl: 'https://aethelgard.altivio-showcase.com'
  }
];
