import { ServiceItem } from '../types';

export const ALL_SERVICES: ServiceItem[] = [
  // 1. AI Solutions (Highlighted Service)
  {
    id: 'ai-engineering',
    name: 'AI Solutions',
    category: 'digital-product',
    categoryLabel: 'Apps, Websites & AI',
    shortDesc: 'Smart AI tools built for your business, like assistants that answer customer questions and helpers that handle repetitive tasks.',
    fullDesc: 'We build AI tools that save your team time and make your product smarter. That could be an assistant that answers customer questions using your own documents, a tool that reads and sorts paperwork, or a helper that takes care of routine tasks automatically. We make sure it gives reliable answers, keeps your data private, and responds quickly.',
    deliverables: ['An AI assistant that knows your business', 'Smart search that finds answers in your documents', 'Automated helpers for repetitive tasks', 'Privacy and safety controls for your data', 'Speed tuning so answers arrive quickly'],
    timeline: '4 - 8 weeks',
    basePrice: 18500,
    highlighted: true,
    wireframeType: 'neural-network'
  },
  // 2. Mobile App Development (Highlighted Service)
  {
    id: 'mobile-app-dev',
    name: 'Mobile App Development',
    category: 'digital-product',
    categoryLabel: 'Apps, Websites & AI',
    shortDesc: 'iPhone and Android apps that are fast, reliable and ready for thousands of users.',
    fullDesc: 'We build smooth, easy-to-use mobile apps for iPhone and Android. Your app can keep working without internet, let people log in with Face ID or a fingerprint, take payments, and send notifications. We also help you get it approved and published on the App Store and Google Play.',
    deliverables: ['Your app for iPhone and Android', 'Face ID or fingerprint login, and offline use', 'Payments with Apple Pay and Google Pay', 'Help getting approved on the App Store and Google Play', 'Live updates that appear instantly'],
    timeline: '6 - 12 weeks',
    basePrice: 16000,
    highlighted: true,
    wireframeType: 'mobile-mock'
  },
  // 4. Website Development (Highlighted Service)
  {
    id: 'web-development',
    name: 'Website Development',
    category: 'digital-product',
    categoryLabel: 'Apps, Websites & AI',
    shortDesc: 'Fast, modern websites and online platforms that look great on every device and are easy for you to update.',
    fullDesc: 'We build websites and online platforms that load quickly, work for everyone (including people with disabilities), and grow with your business. You can edit your own content without calling a developer, and updates go live automatically and safely.',
    deliverables: ['A complete, custom-built website or web app', 'Top marks on Google speed tests', 'An easy editor so you can update content yourself', 'Works perfectly on desktop, tablet and phone', 'Automatic, safe publishing of updates'],
    timeline: '3 - 7 weeks',
    basePrice: 11500,
    highlighted: true,
    wireframeType: 'code-browser'
  },
  // 5. UI/UX Design
  {
    id: 'ui-ux-design',
    name: 'Website & App Design (UI/UX)',
    category: 'digital-product',
    categoryLabel: 'Apps, Websites & AI',
    shortDesc: 'Websites and apps designed to be simple and enjoyable, based on research into what your users need.',
    fullDesc: 'We turn complicated processes into screens that feel simple. First we learn about your users and your competitors, then we sketch the layout, test ideas, and finish with polished designs that are easy for everyone to use.',
    deliverables: ['Research into your users and competitors', 'Rough layouts and a map of every page', 'Finished, polished screen designs', 'A consistent set of design building blocks', 'A clickable demo to test with real users'],
    timeline: '3 - 5 weeks',
    basePrice: 8500,
    highlighted: true,
    wireframeType: 'ui-wireframe'
  },
  // 6. Website Management
  {
    id: 'website-management',
    name: 'Website Care & Support',
    category: 'digital-product',
    categoryLabel: 'Apps, Websites & AI',
    shortDesc: 'We keep your website running, secure, fast and up to date, so you never have to worry about it.',
    fullDesc: 'Think of it as ongoing care for your website. We watch it around the clock, fix problems before you notice them, keep everything secure and up to date, back up your data, and set aside time each month for updates and new features.',
    deliverables: ['24/7 monitoring with guaranteed response times', 'Weekly security checks and updates', 'Regular backups so nothing gets lost', 'Monthly hours for content changes and new features', 'Monthly speed and health reports'],
    timeline: 'Monthly plan',
    basePrice: 2800,
    wireframeType: 'code-browser'
  },
  // 8. Brand Identity Design
  {
    id: 'brand-identity-design',
    name: 'Brand Identity Design',
    category: 'brand-visual',
    categoryLabel: 'Branding & Design',
    shortDesc: 'Your complete brand look: logo, colors, fonts and a guidebook showing how to use them.',
    fullDesc: 'We create a complete, consistent look for your business so people recognise you anywhere. That includes your logo, colors, fonts and other brand pieces, plus a detailed guidebook so everyone uses them the right way.',
    deliverables: ['Your main logo, plus alternate and icon versions', 'A custom color palette', 'Matching fonts for headings and text', 'A 100+ page brand guidebook', 'Ready-made files for online and print use'],
    timeline: '3 - 5 weeks',
    basePrice: 9000,
    highlighted: true,
    wireframeType: 'brand-mark'
  },
  // 11. Logo Animation
  {
    id: 'logo-animation',
    name: 'Logo Animation',
    category: 'brand-visual',
    categoryLabel: 'Branding & Design',
    shortDesc: 'Bring your logo to life with short animations for videos, websites and social media.',
    fullDesc: 'We animate your logo so it moves and grabs attention. Use it at the start of videos, on your website or app, or in social media posts, with an optional sound to match.',
    deliverables: ['High-quality video versions of your animated logo', 'Lightweight animations for your website and app', 'GIF versions for social media and email', 'A custom sound to go with your logo', 'Versions sized for wide and square screens'],
    timeline: '1 - 2 weeks',
    basePrice: 3800,
    wireframeType: 'brand-mark'
  },
  // 12. Pitch Deck Design
  {
    id: 'pitch-deck-design',
    name: 'Investor Presentation Design',
    category: 'brand-visual',
    categoryLabel: 'Branding & Design',
    shortDesc: 'Presentations for investors that tell your story clearly and make your numbers easy to understand.',
    fullDesc: 'We turn your plans and progress into a presentation that wins investors over. Our clients have raised over $180M using presentations we designed, so we know what investors look for.',
    deliverables: ['A custom investor presentation (15 to 20 slides)', 'A clear, compelling story from start to finish', 'Simple charts that make your numbers easy to read', 'Editable templates you can update yourself', 'A one-page summary to send to investors'],
    timeline: '2 - 3 weeks',
    basePrice: 5800,
    wireframeType: 'chart-growth'
  },
  // 13. Graphic Design
  {
    id: 'graphic-design',
    name: 'Graphic Design',
    category: 'brand-visual',
    categoryLabel: 'Branding & Design',
    shortDesc: 'Eye-catching ads, banners, posters, illustrations and printed materials.',
    fullDesc: 'We create striking visuals for online and print that help you stand out. Our senior designers produce ads, illustrations, posters and promotional materials that get noticed.',
    deliverables: ['Ad designs for Facebook, Instagram, LinkedIn and Google', 'Custom illustrations and infographics', 'Posters and print layouts', 'A custom set of 100+ icons', 'Banners and large displays for events'],
    timeline: '2 - 3 weeks',
    basePrice: 4200,
    wireframeType: 'brand-mark'
  },
  // 14. Packaging Design (Highlighted Service)
  {
    id: 'packaging-design',
    name: 'Packaging Design',
    category: 'packaging-physical',
    categoryLabel: 'Packaging & Printed Goods',
    shortDesc: 'Product boxes and packaging that protect your product, stand out on shelves and make unboxing special.',
    fullDesc: 'We design packaging that customers love to open and want to share. We handle the box shape, the materials (including eco-friendly options) and special finishes like shiny foil, and we work directly with your factory.',
    deliverables: ['Print-ready packaging templates for your factory', 'Details of materials, colors and finishes', 'Realistic 3D previews of your packaging', 'Direct coordination with your manufacturer', 'Correct placement of barcodes and required labels'],
    timeline: '3 - 6 weeks',
    basePrice: 8200,
    highlighted: true,
    wireframeType: 'box-package'
  },
  // 15. Shopping Bag Design
  {
    id: 'shopping-bag-design',
    name: 'Shopping Bag Design',
    category: 'packaging-physical',
    categoryLabel: 'Packaging & Printed Goods',
    shortDesc: 'Stylish branded shopping bags in paper or fabric, with custom handles and special finishes.',
    fullDesc: 'A great shopping bag is free advertising every time a customer walks down the street. We design premium paper bags and cotton totes with custom handles and finishes like shiny foil or raised logos.',
    deliverables: ['Exact templates for small, medium and large bags', 'Handle and reinforcement details', 'Guides for logos, foil and colors', 'Realistic previews with material samples', 'Everything your manufacturer needs to start production'],
    timeline: '1 - 2 weeks',
    basePrice: 3200,
    wireframeType: 'box-package'
  },
  // 16. Clothes Tag Design
  {
    id: 'clothes-tag-design',
    name: 'Clothing Tag & Label Design',
    category: 'packaging-physical',
    categoryLabel: 'Packaging & Printed Goods',
    shortDesc: 'Hang tags, sewn-in labels and care tags that give your clothing a premium finish.',
    fullDesc: 'The small details that make clothing feel premium. We design thick card hang tags, custom shapes, metal details, woven labels, and care tags that meet legal requirements.',
    deliverables: ['Front and back designs for your hang tags', 'Designs for woven or printed neck labels', 'Care and fabric labels, correctly formatted', 'Choice of strings, pins and fasteners', 'A checklist for reviewing samples before production'],
    timeline: '1 - 2 weeks',
    basePrice: 2800,
    wireframeType: 'box-package'
  },
  // 17. LookBook Design
  {
    id: 'lookbook-design',
    name: 'Lookbook & Catalog Design',
    category: 'packaging-physical',
    categoryLabel: 'Packaging & Printed Goods',
    shortDesc: 'Beautiful fashion lookbooks and product catalogs, in print and online.',
    fullDesc: 'We arrange your photos and products into stunning lookbooks that show off your collection. You get a glossy print version and an online version that store buyers can click through.',
    deliverables: ['A 24 to 48 page designed lookbook', 'An online flipbook with clickable links', 'Print-ready files for your printer', 'An order form page for store buyers', 'Advice on paper and binding'],
    timeline: '2 - 4 weeks',
    basePrice: 5400,
    wireframeType: 'box-package'
  },
  // 18. Brochure Design
  {
    id: 'brochure-design',
    name: 'Brochure Design',
    category: 'marketing-growth',
    categoryLabel: 'Marketing & Growth',
    shortDesc: 'Professional brochures that explain what you do and help you win new clients.',
    fullDesc: 'Brochures that make a strong impression in meetings, at trade shows and in presentations. We pair clear, short writing with a polished design.',
    deliverables: ['Folded or multi-page brochure design', 'Print-ready files for your printer', 'A clickable online version', 'Help editing your text and headlines', 'Custom charts and diagrams'],
    timeline: '1 - 3 weeks',
    basePrice: 3400,
    wireframeType: 'box-package'
  },
  // 19. Digital Marketing (Highlighted Service)
  {
    id: 'digital-marketing',
    name: 'Online Marketing & Ads',
    category: 'marketing-growth',
    categoryLabel: 'Marketing & Growth',
    shortDesc: 'Online ads and Google search improvements that bring you more customers.',
    fullDesc: 'We help more of the right people find you online. We run ads on Google, Facebook, Instagram and LinkedIn, improve how you show up in Google search, and adjust your pages so more visitors become customers. Every decision is backed by real results.',
    deliverables: ['Ad campaigns on Google and social media', 'A review of how you appear in Google search, with a plan to improve it', 'Page improvements that turn more visitors into customers', 'A live dashboard showing which ads bring results', 'Testing different ad designs to find what works best'],
    timeline: 'Ongoing / Monthly',
    basePrice: 4500,
    highlighted: true,
    wireframeType: 'chart-growth'
  },
  // 20. Social Media Management
  {
    id: 'social-media-management',
    name: 'Social Media Management',
    category: 'marketing-growth',
    categoryLabel: 'Marketing & Growth',
    shortDesc: 'We create your posts, plan your calendar and reply to your followers across all your social channels.',
    fullDesc: 'We grow your presence on Instagram, LinkedIn, X and TikTok. We create short videos, image posts and captions, and reply to comments and messages every day.',
    deliverables: ['A monthly content plan (16 to 24 posts)', 'Custom image posts and short videos', 'Captions and post writing', 'Daily replies to comments and messages', 'Monthly reports on what is working'],
    timeline: 'Monthly plan',
    basePrice: 3600,
    wireframeType: 'chart-growth'
  }
];

export const SERVICE_CATEGORIES = [
  { id: 'all', label: 'All Services (16)' },
  { id: 'digital-product', label: 'Apps, Websites & AI' },
  { id: 'brand-visual', label: 'Branding & Design' },
  { id: 'marketing-growth', label: 'Marketing & Growth' },
  { id: 'packaging-physical', label: 'Packaging & Printed Goods' }
];
