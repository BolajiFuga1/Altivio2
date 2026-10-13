export interface ArchitectProfile {
  id: string;
  name: string;
  role: string;
  discipline: 'ai' | 'mobile' | 'web' | 'design' | 'brand' | 'growth';
  specialties: string[];
  bio: string;
}

export const ARCHITECT_ROSTER: ArchitectProfile[] = [
  {
    id: 'elena-rostova',
    name: 'Dr. Elena Rostova',
    role: 'Principal AI & Neural Systems Architect',
    discipline: 'ai',
    specialties: ['AI Engineering', 'LLM Pipelines', 'RAG Retrieval', 'Autonomous Agents', 'PyTorch'],
    bio: 'Former DeepMind research fellow specializing in low-latency generative models and production embeddings.'
  },
  {
    id: 'marcus-sterling',
    name: 'Marcus Sterling',
    role: 'Principal Mobile Engineering Director',
    discipline: 'mobile',
    specialties: ['Mobile App Development', 'iOS Swift', 'Android Kotlin', 'React Native', 'WebRTC'],
    bio: '12+ years engineering high-frequency client apps with 120fps gesture choreography and offline synchronization.'
  },
  {
    id: 'alexander-vance',
    name: 'Alexander Vance',
    role: 'Principal Partner & Cloud Architect',
    discipline: 'web',
    specialties: ['Web Development', 'Cloud Infrastructure', 'Microservices', 'Distributed Databases', 'Security'],
    bio: 'Lead architect behind zero-downtime distributed systems and modern TypeScript cloud services.'
  },
  {
    id: 'clara-chen',
    name: 'Clara Chen',
    role: 'Design Systems & UX Interaction Director',
    discipline: 'design',
    specialties: ['UI/UX Design', 'App Design', 'Figma Tokens', 'Motion Physics', 'Design Systems'],
    bio: 'Former design systems lead at top-tier product studios, creator of enterprise component token libraries.'
  },
  {
    id: 'julien-moreau',
    name: 'Julien Moreau',
    role: 'Executive Creative Director & Brand Lead',
    discipline: 'brand',
    specialties: ['Brand Identity Design', 'Logo Design', 'Packaging Design', 'Dieline Engineering', 'Luxury Print'],
    bio: 'Parisian luxury packaging artisan and brand identity strategist for European prestige houses.'
  },
  {
    id: 'sora-takahashi',
    name: 'Sora Takahashi',
    role: 'Head of Growth & Digital Marketing',
    discipline: 'growth',
    specialties: ['Digital Marketing', 'Social Media Management', 'Conversion Funnel', 'SEO Telemetry'],
    bio: 'Data-driven growth engineer specializing in hyper-targeted client acquisition and analytics pipelines.'
  }
];

export function resolveAssignedSquad(
  serviceIdsOrNames: string[] = [],
  contextText: string = ''
): {
  lead: ArchitectProfile;
  squad: ArchitectProfile[];
  squadSummary: string;
} {
  const normalized = (serviceIdsOrNames || []).map((s) => s.toLowerCase());
  const context = (contextText || '').toLowerCase();

  // Score each architect based on matching services and text
  const scores: Record<string, number> = {
    'elena-rostova': 0,
    'marcus-sterling': 0,
    'alexander-vance': 0,
    'clara-chen': 0,
    'julien-moreau': 0,
    'sora-takahashi': 0
  };

  normalized.forEach((item) => {
    if (item.includes('ai') || item.includes('model') || item.includes('llm') || item.includes('neural')) {
      scores['elena-rostova'] += 3;
    }
    if (item.includes('mobile') || item.includes('ios') || item.includes('android')) {
      scores['marcus-sterling'] += 3;
    }
    if (item.includes('web') || item.includes('site') || item.includes('cloud') || item.includes('database')) {
      scores['alexander-vance'] += 2.5;
    }
    if (item.includes('ui') || item.includes('ux') || item.includes('app-design') || item.includes('interaction')) {
      scores['clara-chen'] += 2.5;
    }
    if (
      item.includes('brand') ||
      item.includes('logo') ||
      item.includes('packag') ||
      item.includes('bag') ||
      item.includes('tag') ||
      item.includes('brochure') ||
      item.includes('lookbook')
    ) {
      scores['julien-moreau'] += 3;
    }
    if (item.includes('marketing') || item.includes('social') || item.includes('growth')) {
      scores['sora-takahashi'] += 3;
    }
  });

  if (context.includes('ai') || context.includes('machine learning') || context.includes('model')) {
    scores['elena-rostova'] += 2;
  }
  if (context.includes('mobile') || context.includes('iphone') || context.includes('android')) {
    scores['marcus-sterling'] += 2;
  }
  if (context.includes('brand') || context.includes('packaging') || context.includes('luxury')) {
    scores['julien-moreau'] += 2;
  }

  // Find top scoring architect
  let highestId = 'alexander-vance';
  let highestScore = -1;
  Object.entries(scores).forEach(([id, score]) => {
    if (score > highestScore) {
      highestScore = score;
      highestId = id;
    }
  });

  const lead = ARCHITECT_ROSTER.find((a) => a.id === highestId) || ARCHITECT_ROSTER[2];

  // Squad assembly: pick all architects with score > 0, always including lead and at least one technical or design peer
  const squad = ARCHITECT_ROSTER.filter((a) => a.id === lead.id || scores[a.id] > 0);
  if (squad.length === 1) {
    // Add a balanced cross-discipline partner
    const partner = lead.discipline === 'brand' || lead.discipline === 'design'
      ? ARCHITECT_ROSTER.find((a) => a.id === 'alexander-vance')
      : ARCHITECT_ROSTER.find((a) => a.id === 'clara-chen');
    if (partner && !squad.includes(partner)) squad.push(partner);
  }

  const squadSummary = `${lead.name} (${lead.role}) with ${squad
    .filter((a) => a.id !== lead.id)
    .map((a) => a.name)
    .join(', ')}`;

  return { lead, squad, squadSummary };
}
