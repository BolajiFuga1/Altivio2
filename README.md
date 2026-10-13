<p align="center">
  <img src="public/altivio-logo.svg" alt="Altivio Logo" width="340" />
</p>

<p align="center">
  <strong>High-Velocity Digital Technology, AI Engineering & Brand Architecture Studio</strong>
</p>

<p align="center">
  <a href="#team-and-lead-developer-configuration">Team Roster</a> •
  <a href="#services-configuration">Services List</a> •
  <a href="#core-features">Features</a> •
  <a href="#architecture--tech-stack">Tech Stack</a>
</p>

---

## 👥 Team and Lead Developer Configuration

If you want to customize the names, titles, bios, or specializations of your actual developers and leads, modify the following file:

### 1. `src/utils/squadMatcher.ts`
This file defines the **`ARCHITECT_ROSTER`** containing all lead developers and specialists:

```typescript
export const ARCHITECT_ROSTER: ArchitectProfile[] = [
  {
    id: 'elena-rostova',
    name: 'Dr. Elena Rostova', // <-- Replace with your AI Lead's name
    role: 'Principal AI & Neural Systems Architect',
    discipline: 'ai',
    specialties: ['AI Engineering', 'LLM Pipelines', 'RAG Retrieval', 'Autonomous Agents'],
    bio: 'Former DeepMind research fellow specializing in low-latency generative models.'
  },
  {
    id: 'marcus-sterling',
    name: 'Marcus Sterling', // <-- Replace with your Mobile Lead's name
    role: 'Principal Mobile Engineering Director',
    discipline: 'mobile',
    specialties: ['Mobile App Development', 'iOS Swift', 'Android Kotlin', 'React Native'],
    bio: '12+ years engineering high-frequency client apps with 120fps gesture choreography.'
  },
  {
    id: 'alexander-vance',
    name: 'Alexander Vance', // <-- Replace with your Cloud / Web Lead's name
    role: 'Principal Partner & Cloud Architect',
    discipline: 'web',
    specialties: ['Web Development', 'Cloud Infrastructure', 'Microservices', 'Distributed Databases'],
    bio: 'Lead architect behind zero-downtime distributed systems and TypeScript cloud services.'
  },
  {
    id: 'clara-chen',
    name: 'Clara Chen', // <-- Replace with your UI/UX Design Lead's name
    role: 'Design Systems & UX Interaction Director',
    discipline: 'design',
    specialties: ['UI/UX Design', 'App Design', 'Figma Tokens', 'Motion Physics'],
    bio: 'Former design systems lead at top-tier product studios, creator of component token libraries.'
  },
  {
    id: 'julien-moreau',
    name: 'Julien Moreau', // <-- Replace with your Brand / Packaging Lead's name
    role: 'Executive Creative Director & Brand Lead',
    discipline: 'brand',
    specialties: ['Brand Identity Design', 'Logo Design', 'Packaging Design', 'Luxury Print'],
    bio: 'Luxury packaging artisan and brand identity strategist for prestige houses.'
  },
  {
    id: 'sora-takahashi',
    name: 'Sora Takahashi', // <-- Replace with your Growth / Marketing Lead's name
    role: 'Head of Growth & Digital Strategy',
    discipline: 'growth',
    specialties: ['Digital Marketing', 'Social Media Management', 'Conversion Funnel', 'SEO Telemetry'],
    bio: 'Data-driven growth engineer specializing in hyper-targeted client acquisition pipelines.'
  }
];
```

### 2. `server.ts`
Contains `determineAssignedSquad(services, text, category)` on lines 75–115.  
When client inquiries arrive via API, this function matches the inquiry to the appropriate lead and squad for your Slack alerts and Cloud Firestore records.

---

## 🛠️ Services Configuration

If you want to rename services, adjust base prices, change timelines, deliverables, or add new capabilities, modify:

### `src/data/servicesData.ts`
Contains **`ALL_SERVICES`** (all 21 agency offerings across 4 categories):
- **Digital Product & Technology**: AI Engineering, Web Development, Mobile App Dev, UI/UX Design, Website Management, App Design
- **Brand & Visual Identity**: Brand Identity Design, Logo Design, Brand Design, Letterhead Design, Brochure Design, Lookbook Design, Envelope Design
- **Physical Packaging & Tactile**: Packaging Design, Shopping Bag Design, Clothes Tag Design
- **Growth & Marketing**: Digital Marketing, Social Media Management

Each service item has this schema:
```typescript
{
  id: 'ai-engineering',
  name: 'AI Engineering',
  category: 'digital-product',
  categoryLabel: 'Digital Product',
  shortDesc: 'Custom neural pipelines, fine-tuned LLMs, and autonomous agent systems.',
  fullDesc: 'End-to-end artificial intelligence engineering...',
  deliverables: [
    'Fine-tuned model weights & deployment configs',
    'Semantic vector database index',
    'Sub-200ms API inference wrapper'
  ],
  timeline: '6–10 Weeks',
  basePrice: 18000,
  highlighted: true,
  wireframeType: 'neural-network'
}
```

---

## 🚀 Core Features

- **Interactive Project & Cost Estimator**: Clients freely pick services (starts at $0 with 0 pre-selections), configure MVP / Growth / Enterprise tiers, and see real-time price & timeline estimates.
- **Dynamic Developer Squad Matching**: Automatically pairs the client's chosen services with the ideal lead architect and squad roster.
- **Cloud Firestore Persistence**: All submitted proposals are stored in Firestore (`proposals` collection) with audit logs in `alerts`.
- **Real-Time Slack Webhook Alerts**: Incoming proposals post structured cards to your Slack channel with client details, budget, ref code, and matched lead.
- **Statement of Work (SOW) Engine**:
  - In-browser interactive document reader modal.
  - 1-click official vector **PDF download** compiled via `pdfkit`.
- **Live Interactive Demo Sandbox**: Click *"Simulate Test User"* on portfolio case studies (Telemedicine, FinTech, AI Engine, Luxury Packaging) to trigger real-time simulated user telemetry and actions.

---

## 💻 Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide Icons, Motion
- **Backend**: Express (Node.js/tsx)
- **Database**: Google Cloud Firestore (`firebase/firestore`)
- **Document Generation**: `pdfkit` (Vector PDF compilation)
- **Integrations**: Slack Incoming Webhooks, Google GenAI SDK (`@google/genai`)
