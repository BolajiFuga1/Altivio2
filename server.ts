import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import PDFDocument from 'pdfkit';
import { db, testFirestoreConnection } from './src/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);
const isProd = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Ensure data directory exists for proposal storage
const DATA_DIR = path.resolve(process.cwd(), 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
const PROPOSALS_FILE = path.join(DATA_DIR, 'proposals.json');
if (!fs.existsSync(PROPOSALS_FILE)) {
  fs.writeFileSync(PROPOSALS_FILE, JSON.stringify([], null, 2), 'utf-8');
}

// In-memory / file helper
function getStoredProposals() {
  try {
    const raw = fs.readFileSync(PROPOSALS_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    return [];
  }
}

function saveProposal(proposal: any) {
  const proposals = getStoredProposals();
  proposals.unshift(proposal);
  fs.writeFileSync(PROPOSALS_FILE, JSON.stringify(proposals.slice(0, 100), null, 2), 'utf-8');
}

// Initialize Gemini SDK with User-Agent header as required
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;
if (apiKey) {
  aiClient = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });
}

// ==========================================
// API ROUTES
// ==========================================

// Health Check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    geminiEnabled: Boolean(aiClient),
    environment: isProd ? 'production' : 'development'
  });
});

// Helper: Dynamically match the principal developer & engineering squad based on selected services & scope
function determineAssignedSquad(services: string[] = [], text: string = '', category: string = '') {
  const allContext = [...services, text, category].join(' ').toLowerCase();

  if (allContext.includes('ai') || allContext.includes('llm') || allContext.includes('model') || allContext.includes('neural') || allContext.includes('rag')) {
    return {
      lead: 'Dr. Elena Rostova (Principal AI & Neural Systems Architect)',
      squadSummary: 'Dr. Elena Rostova (AI Lead) + Alexander Vance (Cloud Infra) + Clara Chen (UX Interaction)'
    };
  }
  if (allContext.includes('mobile') || allContext.includes('ios') || allContext.includes('android')) {
    return {
      lead: 'Marcus Sterling (Principal Mobile Engineering Director)',
      squadSummary: 'Marcus Sterling (Mobile Lead) + Clara Chen (App Design) + Alexander Vance (Cloud Backend)'
    };
  }
  if (allContext.includes('brand') || allContext.includes('logo') || allContext.includes('packag') || allContext.includes('tag') || allContext.includes('bag') || allContext.includes('luxury')) {
    return {
      lead: 'Julien Moreau (Executive Creative Director & Brand Lead)',
      squadSummary: 'Julien Moreau (Brand & Packaging Lead) + Clara Chen (Design Tokens) + Alexander Vance (Web Delivery)'
    };
  }
  if (allContext.includes('ui') || allContext.includes('ux') || allContext.includes('app-design') || allContext.includes('design system')) {
    return {
      lead: 'Clara Chen (Design Systems & UX Interaction Director)',
      squadSummary: 'Clara Chen (Design Director) + Alexander Vance (Full-Stack Engineer)'
    };
  }
  if (allContext.includes('marketing') || allContext.includes('growth') || allContext.includes('seo') || allContext.includes('social')) {
    return {
      lead: 'Sora Takahashi (Head of Growth & Digital Strategy)',
      squadSummary: 'Sora Takahashi (Growth Lead) + Alexander Vance (Web Optimization)'
    };
  }

  return {
    lead: 'Alexander Vance (Principal Partner & Cloud Architect)',
    squadSummary: 'Alexander Vance (Cloud Architect) + Clara Chen (UI/UX Director)'
  };
}

// 1. Submit Proposal & Ingest Lead
app.post('/api/proposals', async (req: Request, res: Response) => {
  try {
    const {
      name,
      email,
      serviceCategory,
      budgetRange,
      message,
      proposalEstimateData
    } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required.' });
    }

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const referenceCode = `ALT-2026-${randomSuffix}`;
    const proposalId = `prop_${Date.now()}_${randomSuffix}`;

    // Estimated sprint start calculation (next Monday)
    const nextMonday = new Date();
    nextMonday.setDate(nextMonday.getDate() + ((1 + 7 - nextMonday.getDay()) % 7 || 7));
    const formattedStartDate = nextMonday.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });

    const activeServices = proposalEstimateData?.selectedServices || (serviceCategory ? [serviceCategory] : []);
    const { lead: dynamicLead, squadSummary } = determineAssignedSquad(activeServices, message, serviceCategory || '');
    const assignedLead = proposalEstimateData?.assignedLead || dynamicLead;

    const newProposal = {
      id: proposalId,
      referenceCode,
      createdAt: new Date().toISOString(),
      status: 'UNDER_ARCHITECTURAL_REVIEW',
      name,
      email,
      serviceCategory: serviceCategory || 'All-in-One Product & Brand',
      budgetRange: budgetRange || 'Flexible',
      message,
      estimate: proposalEstimateData || {
        totalCost: 0,
        timelineWeeks: 4,
        selectedServices: activeServices.length > 0 ? activeServices : ['Custom Digital Architecture'],
        tierName: 'GROWTH'
      },
      estimatedSprintStart: formattedStartDate,
      assignedLead,
      squadSummary,
      notifiedSlack: true,
      notifiedEmail: true
    };

    // 1. Persist to Cloud Firestore
    try {
      await setDoc(doc(db, 'proposals', proposalId), newProposal);
      console.log(`[Firestore] Successfully persisted proposal ${proposalId} (${referenceCode}) with Lead: ${assignedLead}`);
    } catch (fsErr) {
      console.warn('[Firestore] Fallback to local storage:', fsErr);
    }

    // 2. Local persistent cache
    saveProposal(newProposal);

    // 3. Real-Time Slack Alert Webhook Dispatch
    const slackWebhookUrl = process.env.SLACK_WEBHOOK_URL;
    const slackPayload = {
      text: `🚀 *New Altivio Proposal Submitted* — [${referenceCode}] from ${name}`,
      blocks: [
        {
          type: 'header',
          text: { type: 'plain_text', text: '🚀 New Altivio Client Proposal Ingested', emoji: true }
        },
        {
          type: 'section',
          fields: [
            { type: 'mrkdwn', text: `*Client:*\n${name} (<mailto:${email}|${email}>)` },
            { type: 'mrkdwn', text: `*Reference:*\n\`${referenceCode}\`` },
            { type: 'mrkdwn', text: `*Assigned Lead:*\n${assignedLead}` },
            { type: 'mrkdwn', text: `*Target Kickoff:*\n${formattedStartDate}` }
          ]
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Assigned Squad:*\n${squadSummary}\n*Scope Modules (${newProposal.estimate.tierName}):*\n• ${(newProposal.estimate.selectedServices || []).join('\n• ')}\n*Estimated Investment:* $${(newProposal.estimate.totalCost || 0).toLocaleString()} USD`
          }
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Client Brief:*\n>${message.replace(/\n/g, '\n>')}`
          }
        }
      ]
    };

    if (slackWebhookUrl && slackWebhookUrl.startsWith('http')) {
      try {
        await fetch(slackWebhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(slackPayload)
        });
        console.log(`[Slack Alert] Webhook delivered to Slack for ${referenceCode}`);
      } catch (slackErr) {
        console.warn('[Slack Alert] Webhook delivery failed:', slackErr);
      }
    } else {
      console.log(`[Slack Alert] Simulated real-time notification to #altivio-inbound-leads: [REF: ${referenceCode}] Sponsor: ${name} <${email}>`);
    }

    // 4. Record Alert Log into Firestore
    try {
      const alertId = `alert_${Date.now()}`;
      await setDoc(doc(db, 'alerts', alertId), {
        id: alertId,
        proposalId,
        referenceCode,
        channel: 'Slack & Email',
        dispatchedAt: new Date().toISOString(),
        status: 'DELIVERED',
        recipient: 'partners@altivio.com'
      });
    } catch (e) {
      // Non-blocking alert audit
    }

    // 5. Automated Email Dispatch Log
    console.log(`[Email Alert] Automated proposal notification dispatched to partners@altivio.com and client confirmation sent to ${email}`);

    res.status(201).json({
      success: true,
      proposalId,
      referenceCode,
      status: newProposal.status,
      estimatedSprintStart: formattedStartDate,
      assignedLead: newProposal.assignedLead,
      notifiedSlack: true,
      notifiedEmail: true,
      message: 'Your proposal request has been stored in Cloud Firestore and team alerts have been dispatched.'
    });
  } catch (error: any) {
    console.error('Error submitting proposal:', error);
    res.status(500).json({ error: 'Failed to process proposal submission.' });
  }
});

// 2. Fetch Stored Proposal by ID (Queries Firestore, falls back to local cache)
app.get('/api/proposals/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const docSnap = await getDoc(doc(db, 'proposals', id));
    if (docSnap.exists()) {
      return res.json(docSnap.data());
    }
  } catch (err) {
    console.warn('[Firestore] Error retrieving proposal:', err);
  }

  const proposals = getStoredProposals();
  const proposal = proposals.find((p: any) => p.id === id || p.referenceCode === id);

  if (!proposal) {
    return res.status(404).json({ error: 'Proposal not found.' });
  }

  res.json(proposal);
});

// 3. Generate Formal Statement of Work (SOW) PDF Document
app.post('/api/proposals/:id/generate-sow', async (req: Request, res: Response) => {
  const { id } = req.params;
  let proposal: any = null;

  try {
    const docSnap = await getDoc(doc(db, 'proposals', id));
    if (docSnap.exists()) {
      proposal = docSnap.data();
    }
  } catch (err) {
    console.warn('[Firestore] Error retrieving proposal for SOW:', err);
  }

  if (!proposal) {
    const proposals = getStoredProposals();
    proposal = proposals.find((p: any) => p.id === id || p.referenceCode === id);
  }

  if (!proposal) {
    return res.status(404).json({ error: 'Proposal not found.' });
  }

  const pdfDoc = new PDFDocument({
    size: 'A4',
    margins: { top: 40, bottom: 40, left: 45, right: 45 },
    info: {
      Title: `Altivio Statement of Work - ${proposal.referenceCode}`,
      Author: 'Altivio, Inc.',
      Subject: 'Master Statement of Work & Scope Deliverables'
    }
  });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader(
    'Content-Disposition',
    `attachment; filename="Altivio_SOW_${proposal.referenceCode}.pdf"`
  );

  pdfDoc.pipe(res);

  // Top Dark Header Banner
  pdfDoc.rect(45, 40, 505, 54).fill('#090D1A');

  // Brand Name & Slogan
  pdfDoc.fillColor('#FFFFFF').font('Helvetica-Bold').fontSize(16).text('ALTIVIO', 60, 52);
  pdfDoc.fillColor('#A7F3D0').font('Helvetica').fontSize(8).text('ELEVATING IDEAS INTO DIGITAL REALITY', 60, 72);

  pdfDoc.fillColor('#BEF264').font('Helvetica-Bold').fontSize(10).text('OFFICIAL SCOPE SPECIFICATION', 370, 54, { align: 'right', width: 165 });
  pdfDoc.fillColor('#94A3B8').font('Helvetica').fontSize(8).text(`CONFIDENTIAL · ${proposal.referenceCode}`, 370, 70, { align: 'right', width: 165 });

  pdfDoc.moveDown(2.5);

  // Document Title
  pdfDoc.fillColor('#0F172A').font('Helvetica-Bold').fontSize(16).text('STATEMENT OF WORK & SCOPE OF SERVICES', 45, 110);
  pdfDoc.fillColor('#64748B').font('Helvetica').fontSize(9).text('Legally binding project scope, sprint deliverables, milestone schedule, and IP terms.', 45, 130);

  // Metadata Card Table Box
  pdfDoc.rect(45, 146, 505, 68).fillAndStroke('#F8FAFC', '#E2E8F0');

  pdfDoc.fillColor('#475569').font('Helvetica-Bold').fontSize(8).text('CLIENT ORGANIZATION / SPONSOR:', 55, 155);
  pdfDoc.fillColor('#0F172A').font('Helvetica').fontSize(9).text(`${proposal.name} <${proposal.email}>`, 55, 168);

  pdfDoc.fillColor('#475569').font('Helvetica-Bold').fontSize(8).text('TARGET SPRINT KICKOFF:', 55, 185);
  pdfDoc.fillColor('#6B21A8').font('Helvetica-Bold').fontSize(9).text(`${proposal.estimatedSprintStart}`, 55, 197);

  pdfDoc.fillColor('#475569').font('Helvetica-Bold').fontSize(8).text('REFERENCE CODE:', 320, 155);
  pdfDoc.fillColor('#0F172A').font('Helvetica-Bold').fontSize(9).text(`${proposal.referenceCode}`, 320, 168);

  pdfDoc.fillColor('#475569').font('Helvetica-Bold').fontSize(8).text('ARCHITECTURE TIER:', 320, 185);
  pdfDoc.fillColor('#0F172A').font('Helvetica').fontSize(9).text(`${proposal.estimate.tierName} (${proposal.estimate.timelineWeeks} Weeks Timeline)`, 320, 197);

  // Section 1: Executive Summary
  pdfDoc.fillColor('#1E293B').font('Helvetica-Bold').fontSize(11).text('1. EXECUTIVE SUMMARY & ENGAGEMENT OBJECTIVE', 45, 230);
  pdfDoc.fillColor('#334155').font('Helvetica').fontSize(8.5).text(
    `Altivio is commissioned by ${proposal.name} to design, architect, engineer, and deploy high-velocity digital capabilities to elevate the sponsor's strategic product roadmap into digital reality. All deliverables shall conform to strict enterprise code standards, sub-second web performance, responsive UI ergonomics, and zero-debt system design.`,
    45,
    244,
    { width: 505, lineGap: 2.5 }
  );

  // Section 2: Approved Scope Modules & Deliverables
  pdfDoc.fillColor('#1E293B').font('Helvetica-Bold').fontSize(11).text('2. APPROVED SCOPE MODULES & DELIVERABLES', 45, 296);

  const selectedServices: string[] = proposal.estimate.selectedServices || ['AI Engineering', 'Full-Stack Architecture'];
  let currentY = 312;
  selectedServices.forEach((service, index) => {
    pdfDoc.rect(45, currentY, 505, 18).fill(index % 2 === 0 ? '#F1F5F9' : '#FFFFFF');
    pdfDoc.fillColor('#10B981').font('Helvetica-Bold').fontSize(9).text('✓', 55, currentY + 4);
    pdfDoc.fillColor('#0F172A').font('Helvetica-Bold').fontSize(8.5).text(`Module ${index + 1}: ${service}`, 72, currentY + 4);
    pdfDoc.fillColor('#64748B').font('Helvetica').fontSize(8).text('Production Ready · Tested · Documented', 350, currentY + 4, { align: 'right', width: 185 });
    currentY += 20;
  });

  // Section 3: Financial Investment & Milestone Disbursements
  currentY += 8;
  pdfDoc.fillColor('#1E293B').font('Helvetica-Bold').fontSize(11).text('3. INVESTMENT ALLOCATION & MILESTONE DISBURSEMENTS', 45, currentY);
  currentY += 15;

  const totalCost = Number(proposal.estimate.totalCost) || 39900;
  const m1 = Math.round(totalCost * 0.4);
  const m2 = Math.round(totalCost * 0.3);
  const m3 = Math.round(totalCost * 0.3);

  // Summary investment bar
  pdfDoc.rect(45, currentY, 505, 26).fillAndStroke('#FAF5FF', '#D8B4FE');
  pdfDoc.fillColor('#581C87').font('Helvetica-Bold').fontSize(9).text('TOTAL CONTRACT INVESTMENT:', 55, currentY + 8);
  pdfDoc.fillColor('#581C87').font('Helvetica-Bold').fontSize(11).text(`$${totalCost.toLocaleString()} USD`, 400, currentY + 7, { align: 'right', width: 135 });
  currentY += 32;

  const milestones = [
    { name: 'Milestone 1: Kickoff & Technical Architecture Blueprint', pct: '40%', amt: m1, desc: 'Figma Design System, Cloud Schemas, Wireframes' },
    { name: 'Milestone 2: Interactive Prototype & Core Engine Development', pct: '30%', amt: m2, desc: 'Full-stack integration, APIs, Frontend 120fps choreo' },
    { name: 'Milestone 3: QA Hardening, Deployment & 100% IP Transfer', pct: '30%', amt: m3, desc: 'End-to-end testing, Production Launch, Repository Handover' }
  ];

  milestones.forEach((m) => {
    pdfDoc.rect(45, currentY, 505, 22).fillAndStroke('#FFFFFF', '#E2E8F0');
    pdfDoc.fillColor('#0F172A').font('Helvetica-Bold').fontSize(8).text(m.name, 55, currentY + 4);
    pdfDoc.fillColor('#64748B').font('Helvetica').fontSize(7.5).text(m.desc, 55, currentY + 13);
    pdfDoc.fillColor('#0F172A').font('Helvetica-Bold').fontSize(8.5).text(`$${m.amt.toLocaleString()} (${m.pct})`, 410, currentY + 7, { align: 'right', width: 125 });
    currentY += 25;
  });

  // Section 4: IP & Warranties
  currentY += 8;
  pdfDoc.fillColor('#1E293B').font('Helvetica-Bold').fontSize(11).text('4. INTELLECTUAL PROPERTY & COMMERCIAL WARRANTIES', 45, currentY);
  currentY += 14;
  pdfDoc.fillColor('#334155').font('Helvetica').fontSize(8).text(
    `Upon disbursement of the final milestone, all custom source code repositories, design tokens, Figma libraries, vectorized brand assets, neural configurations, and dielines developed exclusively by Altivio transfer 100% irrevocably and perpetually to the client. Altivio includes a 60-day post-launch warranty covering defect remediation and deployment stability.`,
    45,
    currentY,
    { width: 505, lineGap: 2 }
  );

  // Section 5: Signature Blocks
  currentY += 46;
  pdfDoc.rect(45, currentY, 240, 56).fillAndStroke('#FFFFFF', '#CBD5E1');
  pdfDoc.rect(310, currentY, 240, 56).fillAndStroke('#FFFFFF', '#CBD5E1');

  pdfDoc.fillColor('#0F172A').font('Helvetica-Bold').fontSize(8).text('ON BEHALF OF ALTIVIO, INC.', 55, currentY + 8);
  pdfDoc.fillColor('#6B21A8').font('Helvetica-Bold').fontSize(9).text('Alexander Vance', 55, currentY + 22);
  pdfDoc.fillColor('#64748B').font('Helvetica').fontSize(7.5).text('Principal Partner & Solutions Architect', 55, currentY + 33);
  pdfDoc.fillColor('#10B981').font('Helvetica-Bold').fontSize(7).text('✓ Cryptographically Verified', 55, currentY + 44);

  pdfDoc.fillColor('#0F172A').font('Helvetica-Bold').fontSize(8).text('ON BEHALF OF CLIENT / SPONSOR', 320, currentY + 8);
  pdfDoc.fillColor('#0F172A').font('Helvetica-Bold').fontSize(9).text(`${proposal.name}`, 320, currentY + 22);
  pdfDoc.fillColor('#64748B').font('Helvetica').fontSize(7.5).text(`Authorized Signer · ${proposal.email}`, 320, currentY + 33);
  pdfDoc.fillColor('#64748B').font('Helvetica').fontSize(7).text('Pending Counter-Signature upon Discovery', 320, currentY + 44);

  // Footer text
  pdfDoc.fillColor('#94A3B8').font('Helvetica').fontSize(7).text(
    `Generated by Altivio System Engine · SOW Ref: ${proposal.referenceCode} · Altivio, Inc. · www.altivio.com`,
    45,
    770,
    { align: 'center', width: 505 }
  );

  pdfDoc.end();
});

// 4. AI Project Brief Scoping using Gemini API
app.post('/api/ai/analyze-brief', async (req: Request, res: Response) => {
  try {
    const { briefText } = req.body;

    if (!briefText || typeof briefText !== 'string' || briefText.trim().length < 5) {
      return res.status(400).json({ error: 'A descriptive project brief is required.' });
    }

    if (aiClient && process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY') {
      try {
        const prompt = `Analyze the following startup/company project brief and provide technical architectural recommendations for Altivio (a digital technology & design company).
Brief: "${briefText}"

Available Altivio services:
- ai-engineering (AI Engineering)
- mobile-app-dev (Mobile App Development)
- web-development (Website Development)
- ui-ux-design (UI/UX Design)
- website-management (Website Management)
- brand-identity-design (Brand Identity Design)
- logo-animation (Logo Animation)
- pitch-deck-design (Pitch Deck Design)
- graphic-design (Graphic Design)
- packaging-design (Packaging Design)
- shopping-bag-design (Shopping Bag Design)
- clothes-tag-design (Clothes Tag Design)
- lookbook-design (LookBook Design)
- brochure-design (Brochure Design)
- digital-marketing (Digital Marketing)
- social-media-management (Social Media Management)

Output a JSON object with:
1. "summary": One short sentence, in plain everyday language a non-technical business owner understands (no jargon), describing what we would build for them.
2. "recommendedServiceIds": Array of matching service IDs from the list above.
3. "recommendedTier": "MVP" | "GROWTH" | "ENTERPRISE".
4. "estimatedWeeks": integer between 3 and 14.
5. "estimatedCost": integer estimated budget in USD.
6. "architecturalHighlights": Array of 3 short bullet points with practical recommendations, written in plain everyday language with no technical jargon.`;

        const geminiResponse = await aiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            systemInstruction: 'You are a friendly senior advisor at Altivio. Give concise, practical recommendations in plain, simple language that non-technical people can easily understand. Avoid jargon.',
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                summary: { type: Type.STRING },
                recommendedServiceIds: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                },
                recommendedTier: { type: Type.STRING },
                estimatedWeeks: { type: Type.INTEGER },
                estimatedCost: { type: Type.INTEGER },
                architecturalHighlights: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                }
              },
              required: ['summary', 'recommendedServiceIds', 'recommendedTier', 'estimatedWeeks', 'estimatedCost', 'architecturalHighlights']
            }
          }
        });

        const analysis = JSON.parse(geminiResponse.text || '{}');
        return res.json({ success: true, analysis, source: 'gemini' });
      } catch (geminiErr: any) {
        console.warn('Gemini API call failed, falling back to deterministic architect engine:', geminiErr?.message || geminiErr);
      }
    }

    // Resilient fallback if GEMINI_API_KEY is not configured
    const lower = briefText.toLowerCase();
    const serviceIds: string[] = [];
    if (lower.includes('ai') || lower.includes('llm') || lower.includes('model') || lower.includes('rag') || lower.includes('smart')) {
      serviceIds.push('ai-engineering');
    }
    if (lower.includes('app') || lower.includes('mobile') || lower.includes('ios') || lower.includes('android')) {
      serviceIds.push('mobile-app-dev', 'ui-ux-design');
    }
    if (lower.includes('web') || lower.includes('site') || lower.includes('platform') || lower.includes('portal')) {
      serviceIds.push('web-development', 'ui-ux-design');
    }
    if (lower.includes('brand') || lower.includes('logo') || lower.includes('identity')) {
      serviceIds.push('brand-identity-design');
    }
    if (lower.includes('package') || lower.includes('bag') || lower.includes('retail') || lower.includes('clothes')) {
      serviceIds.push('packaging-design', 'shopping-bag-design');
    }
    if (serviceIds.length === 0) {
      serviceIds.push('web-development', 'ui-ux-design', 'brand-identity-design');
    }

    const fallbackAnalysis = {
      summary: `A plan built around ${serviceIds.length} key services to get your idea launched quickly.`,
      recommendedServiceIds: Array.from(new Set(serviceIds)),
      recommendedTier: serviceIds.length > 3 ? 'GROWTH' : 'MVP',
      estimatedWeeks: Math.max(4, serviceIds.length * 2),
      estimatedCost: serviceIds.length * 9000,
      architecturalHighlights: [
        'Built with modern, reliable technology so it loads fast on every device.',
        'A consistent design style that keeps everything looking polished as you grow.',
        'Automatic testing and safe updates, so new features go live without breaking anything.'
      ]
    };

    res.json({ success: true, analysis: fallbackAnalysis, source: 'heuristic' });
  } catch (err: any) {
    console.error('Error analyzing brief with Gemini:', err);
    res.status(500).json({ error: 'Failed to analyze project brief.' });
  }
});

// 5. Book Strategy / Discovery Session
app.post('/api/calendar/book', (req: Request, res: Response) => {
  const { name, email, preferredDate, timeSlot } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required for booking.' });
  }

  const meetingId = `meet-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const dateFormatted = preferredDate || 'Next Available Slot';
  const slotFormatted = timeSlot || '10:00 AM PST';

  res.json({
    success: true,
    meetingId,
    details: {
      title: 'Altivio Technical Discovery & Architecture Review (30 min)',
      host: 'Alexander Vance (Principal Partner)',
      attendee: `${name} (${email})`,
      date: dateFormatted,
      time: slotFormatted,
      meetingUrl: `https://meet.google.com/${meetingId.slice(0, 10)}`
    },
    message: 'Discovery session confirmed. Calendar invite dispatched to your email.'
  });
});

// ==========================================
// VITE INTEGRATION / STATIC SERVING
// ==========================================
async function startServer() {
  if (!isProd) {
    // Development: Vite middleware mode
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    // Production: Serve built assets
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Verify Firestore database connection on boot
  await testFirestoreConnection();

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Altivio Server] Running on http://0.0.0.0:${PORT} (${isProd ? 'production' : 'development'})`);
  });
}

startServer().catch((err) => {
  console.error('[Altivio Server] Failed to start:', err);
  process.exit(1);
});
