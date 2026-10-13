import React, { useState, useEffect } from 'react';
import { PortfolioProject } from '../types';
import {
  X,
  Smartphone,
  Monitor,
  CheckCircle2,
  Activity,
  Sparkles,
  ArrowRight,
  Play,
  RotateCcw,
  Zap,
  Shield,
  Heart,
  FileText,
  DollarSign,
  TrendingUp,
  Layers,
  Send,
  Check
} from 'lucide-react';

interface ProjectDemoModalProps {
  project: PortfolioProject | null;
  isOpen: boolean;
  onClose: () => void;
  onContactForSimilar: (projectName: string) => void;
}

export const ProjectDemoModal: React.FC<ProjectDemoModalProps> = ({
  project,
  isOpen,
  onClose,
  onContactForSimilar
}) => {
  const [deviceView, setDeviceView] = useState<'desktop' | 'mobile'>('desktop');
  const [activeTab, setActiveTab] = useState<'overview' | 'simulator' | 'features' | 'architecture'>('overview');
  const [simulationLog, setSimulationLog] = useState<string[]>([]);
  const [simStep, setSimStep] = useState<number>(0);

  // Telehealth state
  const [bpm, setBpm] = useState<number>(72);
  const [isVitalsAlert, setIsVitalsAlert] = useState<boolean>(false);
  const [rxDispatched, setRxDispatched] = useState<boolean>(false);
  const [clinicalNotes, setClinicalNotes] = useState<string>('');
  const [isTranscribing, setIsTranscribing] = useState<boolean>(false);

  // FinTech state
  const [accountBalance, setAccountBalance] = useState<number>(128450);
  const [transactions, setTransactions] = useState<{ id: string; desc: string; amount: number; time: string }[]>([
    { id: 'tx-1', desc: 'Direct Deposit: Treasury Yield APY', amount: 546.80, time: '2m ago' },
    { id: 'tx-2', desc: 'Institutional Wire: Austin, TX', amount: 12500.00, time: '1h ago' }
  ]);
  const [faceIdVerified, setFaceIdVerified] = useState<boolean>(false);

  // AI state
  const [aiPrompt, setAiPrompt] = useState<string>('Extract operational risk factors and compute EBITDA margin from Q3 filings.');
  const [aiOutput, setAiOutput] = useState<string>('');
  const [aiRunning, setAiRunning] = useState<boolean>(false);
  const [aiLatencyMs, setAiLatencyMs] = useState<number>(280);

  // Packaging state
  const [packagingColor, setPackagingColor] = useState<'black' | 'cream' | 'forest'>('black');
  const [packagingFoil, setPackagingFoil] = useState<'gold' | 'silver' | 'emboss'>('gold');
  const [dielineOverlay, setDielineOverlay] = useState<boolean>(false);

  // Reset states when opening a new project
  useEffect(() => {
    if (project) {
      setSimulationLog([`[System] Initialized sandbox environment for ${project.title}`]);
      setSimStep(0);
      setRxDispatched(false);
      setClinicalNotes('');
      setFaceIdVerified(false);
      setAiOutput('');
      setAiRunning(false);
    }
  }, [project]);

  if (!isOpen || !project) return null;

  // Handler for primary "Simulate Test User" button
  const handleStartSimulation = () => {
    setActiveTab('simulator');
    setSimStep((prev) => prev + 1);

    if (project.previewType === 'telemedicine') {
      const messages = [
        '[WebRTC] Session established with Patient #8042 (Latency: 34ms, 1080p60)',
        '[Biometrics] Heart Rate streaming: 72 bpm, SpO2: 99%, BP: 120/80 mmHg',
        '[AI Co-pilot] Ambient medical transcription active'
      ];
      setSimulationLog((prev) => [...prev, ...messages]);
    } else if (project.previewType === 'fintech') {
      const messages = [
        '[Security] Biometric Enclave authenticated via FaceID (#8821-ECDSA)',
        '[Ledger] Multi-currency WebSocket feed connected (0ms slippage)',
        '[Portfolio] Ready for 120fps animated gesture execution'
      ];
      setSimulationLog((prev) => [...prev, ...messages]);
    } else if (project.previewType === 'ai-dashboard') {
      const messages = [
        '[Vector DB] 84 document chunks indexed into high-dimensional cache',
        '[Inference] SynapseML-v3 neural pipeline primed for semantic retrieval'
      ];
      setSimulationLog((prev) => [...prev, ...messages]);
    } else if (project.previewType === 'luxury-brand') {
      const messages = [
        '[Specs] 650gsm Colorplan paper stock loaded into virtual die-cut previewer',
        '[Foil] Precision vector foil stamp matrix generated at 160°C spec'
      ];
      setSimulationLog((prev) => [...prev, ...messages]);
    }
  };

  // Specific simulation actions
  const triggerVitalsSpike = () => {
    setIsVitalsAlert(true);
    setBpm(118);
    setSimulationLog((prev) => [
      ...prev,
      '⚠️ [ALERT] Patient heart rate elevated: 118 bpm! Tachycardia advisory triggered on clinical triage dashboard.'
    ]);
  };

  const resetVitals = () => {
    setIsVitalsAlert(false);
    setBpm(72);
    setSimulationLog((prev) => [...prev, '✓ [OK] Patient vitals normalized: 72 bpm']);
  };

  const simulateTranscription = () => {
    setIsTranscribing(true);
    setTimeout(() => {
      setClinicalNotes(
        'CHIEF COMPLAINT: Patient reports mild arrhythmia following exercise.\nASSESSMENT: Sinus rhythm with transient exertion elevation.\nPLAN: 14-day ECG telemetry patch prescribed + electrolyte hydration.'
      );
      setIsTranscribing(false);
      setSimulationLog((prev) => [...prev, '✓ [AI Scribe] Generated structured SOAP clinical report in 340ms.']);
    }, 600);
  };

  const dispatchPrescription = () => {
    setRxDispatched(true);
    setSimulationLog((prev) => [
      ...prev,
      '✓ [e-Rx] 256-bit encrypted script dispatched to Lloyds Central Pharmacy (Auth: RX-2026-981).'
    ]);
  };

  const transferFunds = () => {
    const amount = 2500;
    setAccountBalance((prev) => prev - amount);
    const newTx = {
      id: `tx-${Date.now()}`,
      desc: 'Instant P2P Transfer: Seed Liquidity',
      amount: -amount,
      time: 'Just now'
    };
    setTransactions((prev) => [newTx, ...prev]);
    setSimulationLog((prev) => [
      ...prev,
      `✓ [Ledger] Debited $${amount.toLocaleString()} in 12ms. Micro-haptic response emitted.`
    ]);
  };

  const simulateFaceId = () => {
    setFaceIdVerified(true);
    setSimulationLog((prev) => [
      ...prev,
      '✓ [Biometrics] Hardware Secure Enclave FaceID verified in 18ms.'
    ]);
  };

  const runAiInference = () => {
    setAiRunning(true);
    setAiOutput('');
    const fullText =
      'ANALYSIS RESULT (SynapseML Engine):\n• Operational Risk Factor: 14.2% variance in supply-chain logistics.\n• EBITDA Margin: 38.6% (+4.2% YoY growth).\n• Primary Citation: SEC Form 10-K, Item 7 (Management Discussion), page 42, paragraph 3.\n• Verdict: Strong financial solvency with low leverage exposure.';

    let current = '';
    let index = 0;
    const interval = setInterval(() => {
      if (index < fullText.length) {
        current += fullText[index];
        setAiOutput(current);
        index++;
      } else {
        clearInterval(interval);
        setAiRunning(false);
        setAiLatencyMs(265);
        setSimulationLog((prev) => [
          ...prev,
          '✓ [LLM Core] Document parsed across 10M+ tokens with 99.1% factual extraction accuracy.'
        ]);
      }
    }, 15);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-4xl bg-slate-900 text-white rounded-2xl shadow-2xl border border-slate-700/80 overflow-hidden max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top bar with project title and close button */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/90">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <h3 className="font-display font-bold text-base sm:text-lg text-white truncate max-w-xs sm:max-w-md">
              {project.title}
            </h3>
            <span className="text-xs text-slate-400 font-mono hidden sm:inline">
              · {project.client}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Device preview toggle */}
            <div className="flex items-center p-0.5 bg-slate-800 rounded-lg text-xs">
              <button
                onClick={() => setDeviceView('desktop')}
                className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                  deviceView === 'desktop' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
                title="Desktop View"
              >
                <Monitor className="w-4 h-4" />
              </button>
              <button
                onClick={() => setDeviceView('mobile')}
                className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                  deviceView === 'mobile' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
                title="Mobile View"
              >
                <Smartphone className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              aria-label="Close demo modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Main Hero Preview Banner */}
          <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950 flex justify-center items-center min-h-[260px]">
            <img
              src={project.image}
              alt={project.title}
              referrerPolicy="no-referrer"
              className={`transition-all duration-300 object-cover ${
                deviceView === 'desktop'
                  ? 'w-full h-72 object-top'
                  : 'w-[260px] h-[340px] my-4 rounded-2xl shadow-2xl border-4 border-slate-700'
              }`}
            />

            {/* Live Interactive Overlay Badge ("Product Demo" as seen in image) */}
            <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-md p-4 bg-slate-950/95 backdrop-blur-md rounded-xl border border-slate-700/80 shadow-xl">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-lime-400 flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3" />
                  Product Demo & Live Preview
                </span>
                <span className="text-[11px] text-slate-400 font-mono">100% Production Spec</span>
              </div>
              <p className="text-xs text-slate-300 line-clamp-2">
                Launch the interactive test user journey to experience live application states, latency, and features.
              </p>
              <div className="mt-3 flex items-center gap-2">
                <button
                  onClick={handleStartSimulation}
                  className="px-4 py-2 text-xs font-bold text-slate-950 btn-ink rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Play className="w-3.5 h-3.5 fill-slate-950" />
                  <span>Simulate Test User</span>
                  {simStep > 0 && (
                    <span className="px-1.5 py-0.2 bg-slate-900 text-lime-400 text-[10px] rounded-full font-mono font-semibold">
                      Step {simStep}
                    </span>
                  )}
                </button>
                <a
                  href="#contact"
                  onClick={() => {
                    onClose();
                    onContactForSimilar(project.title);
                  }}
                  className="px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
                >
                  Request Similar App
                </a>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'overview'
                  ? 'bg-purple-900/60 text-purple-200 border border-purple-700'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Case Overview
            </button>
            <button
              onClick={() => setActiveTab('simulator')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'simulator'
                  ? 'btn-ink text-slate-950 font-bold shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Live Test User Sandbox</span>
              {simStep > 0 && (
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('features')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'features'
                  ? 'bg-purple-900/60 text-purple-200 border border-purple-700'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Deliverables & Features
            </button>
            <button
              onClick={() => setActiveTab('architecture')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'architecture'
                  ? 'bg-purple-900/60 text-purple-200 border border-purple-700'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Tech Stack & Performance
            </button>
          </div>

          {/* TAB 1: Case Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <p className="text-sm text-slate-300 leading-relaxed">
                {project.description}
              </p>
              {/* Proof metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {project.stats.map((s, idx) => (
                  <div key={idx} className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60">
                    <div className="font-display text-xl font-bold text-white tabular-nums">
                      {s.value}
                    </div>
                    <div className="text-xs text-slate-400 mt-1">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: LIVE TEST USER SIMULATOR (WHAT SIMULATE TEST USER ACTIVATES) */}
          {activeTab === 'simulator' && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-bold text-white">Interactive Sandbox Simulation:</span>
                  <span className="text-slate-400 capitalize">{project.previewType || 'production'} environment</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setSimulationLog(['[System] Sandbox logs cleared. Ready for fresh test run.']);
                      setSimStep(0);
                      resetVitals();
                      setRxDispatched(false);
                      setClinicalNotes('');
                      setFaceIdVerified(false);
                      setAiOutput('');
                    }}
                    className="px-2 py-1 text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 rounded flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset Sandbox</span>
                  </button>
                </div>
              </div>

              {/* TELEHEALTH SIMULATOR */}
              {project.previewType === 'telemedicine' && (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  {/* Left: Interactive consultation monitor (7 cols) */}
                  <div className="md:col-span-7 p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                      <div>
                        <span className="text-xs font-bold text-white block">Dr. Vance · Room #704</span>
                        <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-emerald-400" />
                          WebRTC 1080p60 · Encrypted HIPAA Tunnel
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-mono text-slate-400">Latency: 32ms</span>
                      </div>
                    </div>

                    {/* Vitals Telemetry Screen */}
                    <div className="grid grid-cols-3 gap-2">
                      <div className={`p-3 rounded-xl border transition-colors ${
                        isVitalsAlert ? 'bg-rose-950/50 border-rose-600' : 'bg-slate-900 border-slate-800'
                      }`}>
                        <div className="flex items-center justify-between text-[11px] text-slate-400">
                          <span>Heart Rate</span>
                          <Heart className={`w-3.5 h-3.5 ${isVitalsAlert ? 'text-rose-500 animate-bounce' : 'text-emerald-400'}`} />
                        </div>
                        <div className={`text-2xl font-bold font-mono mt-1 ${isVitalsAlert ? 'text-rose-400' : 'text-white'}`}>
                          {bpm} <span className="text-xs font-normal text-slate-400">bpm</span>
                        </div>
                      </div>

                      <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                        <div className="text-[11px] text-slate-400">SpO2 Oxygen</div>
                        <div className="text-2xl font-bold font-mono text-white mt-1">
                          99 <span className="text-xs font-normal text-slate-400">%</span>
                        </div>
                      </div>

                      <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                        <div className="text-[11px] text-slate-400">Blood Pressure</div>
                        <div className="text-2xl font-bold font-mono text-white mt-1">
                          120/80
                        </div>
                      </div>
                    </div>

                    {/* Clinical Note Scribe */}
                    {clinicalNotes && (
                      <div className="p-3 bg-purple-950/40 border border-purple-800/80 rounded-xl text-xs space-y-1">
                        <span className="font-bold text-purple-200 flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5 text-purple-400" />
                          AI Clinical Scribe (Auto-Transcribed):
                        </span>
                        <pre className="text-slate-300 font-mono text-[11px] whitespace-pre-wrap leading-relaxed">
                          {clinicalNotes}
                        </pre>
                      </div>
                    )}

                    {/* Rx Status */}
                    {rxDispatched && (
                      <div className="p-3 bg-emerald-950/40 border border-emerald-800/80 rounded-xl text-xs text-emerald-300 flex items-center justify-between">
                        <span className="flex items-center gap-1.5 font-medium">
                          <Check className="w-4 h-4 text-emerald-400" />
                          Prescription token signed & routed to pharmacy.
                        </span>
                        <span className="text-[10px] font-mono text-emerald-400">RX-2026-981</span>
                      </div>
                    )}

                    {/* Action buttons */}
                    <div className="flex flex-wrap gap-2 pt-2">
                      <button
                        onClick={isVitalsAlert ? resetVitals : triggerVitalsSpike}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          isVitalsAlert
                            ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                            : 'bg-rose-900/80 hover:bg-rose-800 text-rose-200 border border-rose-700'
                        }`}
                      >
                        {isVitalsAlert ? 'Normalize Vitals' : 'Simulate Vitals Surge'}
                      </button>

                      <button
                        onClick={simulateTranscription}
                        disabled={isTranscribing}
                        className="px-3 py-1.5 bg-purple-900/70 hover:bg-purple-800 text-purple-200 border border-purple-700 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                      >
                        {isTranscribing ? 'Transcribing...' : 'Run AI Scribe'}
                      </button>

                      <button
                        onClick={dispatchPrescription}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                      >
                        Dispatch e-Prescription
                      </button>
                    </div>
                  </div>

                  {/* Right: Live Telemetry Event Log (5 cols) */}
                  <div className="md:col-span-5 p-4 bg-slate-950 rounded-2xl border border-slate-800 flex flex-col justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2 font-mono">
                        Live Simulation Stream
                      </span>
                      <div className="space-y-1.5 max-h-48 overflow-y-auto font-mono text-[11px]">
                        {simulationLog.map((log, i) => (
                          <div
                            key={i}
                            className={`p-1.5 rounded ${
                              log.includes('ALERT')
                                ? 'bg-rose-950/80 text-rose-300'
                                : log.includes('✓')
                                ? 'bg-emerald-950/40 text-emerald-300'
                                : 'text-slate-400'
                            }`}
                          >
                            {log}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="text-[10px] text-slate-500 pt-3 border-t border-slate-800 font-mono">
                      Altivio Production Engine · 99.99% Consultation Uptime SLA
                    </div>
                  </div>
                </div>
              )}

              {/* FINTECH SIMULATOR */}
              {project.previewType === 'fintech' && (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  <div className="md:col-span-7 p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                      <div>
                        <span className="text-xs text-slate-400 block">Total Portfolio Value</span>
                        <div className="text-3xl font-display font-extrabold text-white tabular-nums mt-0.5">
                          ${accountBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </div>
                      </div>
                      <div className="p-2 bg-emerald-950/50 border border-emerald-800 rounded-lg text-right">
                        <span className="text-[10px] text-emerald-400 font-mono block">Yield Engine APY</span>
                        <span className="text-sm font-bold text-emerald-300">+5.12%</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={transferFunds}
                        className="px-3.5 py-2 btn-ink text-slate-950 font-bold rounded-lg text-xs cursor-pointer transition-colors flex items-center gap-1.5 shadow-sm"
                      >
                        <Send className="w-3 h-3" />
                        <span>Instant Transfer ($2,500)</span>
                      </button>

                      <button
                        onClick={simulateFaceId}
                        className={`px-3 py-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer flex items-center gap-1.5 ${
                          faceIdVerified
                            ? 'bg-purple-950/60 border-purple-500 text-purple-200'
                            : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                        }`}
                      >
                        <Shield className="w-3.5 h-3.5" />
                        <span>{faceIdVerified ? 'FaceID Verified (18ms)' : 'Simulate Biometric Auth'}</span>
                      </button>
                    </div>

                    {/* Transaction List */}
                    <div>
                      <span className="text-xs font-bold text-slate-400 block mb-2">Real-Time Ledger</span>
                      <div className="space-y-1.5">
                        {transactions.map((tx) => (
                          <div key={tx.id} className="p-2 bg-slate-900 rounded-lg flex items-center justify-between text-xs">
                            <div>
                              <div className="font-semibold text-slate-200">{tx.desc}</div>
                              <div className="text-[10px] text-slate-500">{tx.time}</div>
                            </div>
                            <div className={`font-mono font-bold ${tx.amount > 0 ? 'text-emerald-400' : 'text-slate-300'}`}>
                              {tx.amount > 0 ? `+$${tx.amount.toFixed(2)}` : `-$${Math.abs(tx.amount).toFixed(2)}`}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-5 p-4 bg-slate-950 rounded-2xl border border-slate-800 flex flex-col justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2 font-mono">
                        Hardware Gesture Telemetry
                      </span>
                      <div className="space-y-1.5 max-h-48 overflow-y-auto font-mono text-[11px]">
                        {simulationLog.map((log, i) => (
                          <div key={i} className="p-1.5 rounded bg-slate-900/60 text-slate-300">
                            {log}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="text-[10px] text-slate-500 pt-3 border-t border-slate-800 font-mono">
                      WebSocket Ticker Stream · 120fps Gesture Pipeline
                    </div>
                  </div>
                </div>
              )}

              {/* AI WORKBENCH SIMULATOR */}
              {project.previewType === 'ai-dashboard' && (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  <div className="md:col-span-7 p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                    <span className="text-xs font-bold text-white block">Enterprise Document Reasoning</span>
                    <input
                      type="text"
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder:text-slate-500 focus:outline-hidden focus:ring-1 focus:ring-purple-500"
                    />

                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-slate-400 font-mono">
                        Latency: <strong className="text-lime-400">{aiLatencyMs}ms</strong> · 10M+ filings index
                      </span>
                      <button
                        onClick={runAiInference}
                        disabled={aiRunning}
                        className="px-4 py-1.5 btn-ink text-slate-950 font-bold rounded-lg text-xs cursor-pointer transition-colors shadow-sm"
                      >
                        {aiRunning ? 'Generating...' : 'Run Inference'}
                      </button>
                    </div>

                    {aiOutput && (
                      <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs font-mono text-purple-200 whitespace-pre-wrap leading-relaxed">
                        {aiOutput}
                      </div>
                    )}
                  </div>

                  <div className="md:col-span-5 p-4 bg-slate-950 rounded-2xl border border-slate-800 flex flex-col justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2 font-mono">
                        Neural Execution Log
                      </span>
                      <div className="space-y-1.5 max-h-48 overflow-y-auto font-mono text-[11px]">
                        {simulationLog.map((log, i) => (
                          <div key={i} className="p-1.5 rounded bg-slate-900/60 text-slate-300">
                            {log}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="text-[10px] text-slate-500 pt-3 border-t border-slate-800 font-mono">
                      Sub-320ms Retrieval Pipeline · Zero-Hallucination Guardrails
                    </div>
                  </div>
                </div>
              )}

              {/* LUXURY PACKAGING & BRAND SIMULATOR */}
              {project.previewType === 'luxury-brand' && (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  <div className="md:col-span-7 p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-4">
                    <span className="text-xs font-bold text-white block">Physical Dieline & Print Finishes</span>

                    {/* Paper stock selector */}
                    <div>
                      <span className="text-[11px] text-slate-400 block mb-1.5">Paperboard Stock & Texture</span>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { id: 'black', label: '650gsm Obsidian Matte' },
                          { id: 'cream', label: '700gsm French Cotton' },
                          { id: 'forest', label: '600gsm Forest Linen' }
                        ].map((item) => (
                          <button
                            key={item.id}
                            onClick={() => {
                              setPackagingColor(item.id as any);
                              setSimulationLog((prev) => [...prev, `[Material] Loaded ${item.label}`]);
                            }}
                            className={`p-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                              packagingColor === item.id
                                ? 'bg-purple-900/70 border-purple-500 text-white'
                                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                            }`}
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Foil selector */}
                    <div>
                      <span className="text-[11px] text-slate-400 block mb-1.5">Foil Stamping Treatment</span>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { id: 'gold', label: 'Champagne Gold Foil' },
                          { id: 'silver', label: 'Chrome Silver Foil' },
                          { id: 'emboss', label: 'Deep Blind Deboss' }
                        ].map((foil) => (
                          <button
                            key={foil.id}
                            onClick={() => {
                              setPackagingFoil(foil.id as any);
                              setSimulationLog((prev) => [...prev, `[Foil] Applied ${foil.label}`]);
                            }}
                            className={`p-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                              packagingFoil === foil.id
                                ? 'btn-ink text-slate-950 font-bold border-lime-400'
                                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                            }`}
                          >
                            {foil.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Dieline inspection toggle */}
                    <div className="pt-2">
                      <button
                        onClick={() => {
                          setDielineOverlay(!dielineOverlay);
                          setSimulationLog((prev) => [
                            ...prev,
                            dielineOverlay ? '[CAD] Switched to finished render' : '[CAD] Active dieline cut & crease guides enabled'
                          ]);
                        }}
                        className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1.5"
                      >
                        <Layers className="w-3.5 h-3.5" />
                        <span>{dielineOverlay ? 'Hide CAD Cut & Crease Lines' : 'Inspect Production Dielines (180x240x70mm)'}</span>
                      </button>
                    </div>
                  </div>

                  <div className="md:col-span-5 p-4 bg-slate-950 rounded-2xl border border-slate-800 flex flex-col justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2 font-mono">
                        Manufacturing Audit Log
                      </span>
                      <div className="space-y-1.5 max-h-48 overflow-y-auto font-mono text-[11px]">
                        {simulationLog.map((log, i) => (
                          <div key={i} className="p-1.5 rounded bg-slate-900/60 text-slate-300">
                            {log}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="text-[10px] text-slate-500 pt-3 border-t border-slate-800 font-mono">
                      European Luxury Print Standards · 100% Recyclable FSC Stock
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Deliverables & Features */}
          {activeTab === 'features' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {project.deliverables.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2.5 p-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
                  <CheckCircle2 className="w-4 h-4 text-lime-400 shrink-0 mt-0.5" />
                  <span className="text-xs text-slate-200">{item}</span>
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: Tech Stack & Architecture */}
          {activeTab === 'architecture' && (
            <div className="space-y-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-2">
                  Engineered With
                </span>
                <div className="flex flex-wrap gap-2">
                  {project.techStack.map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 bg-slate-800 text-purple-300 border border-slate-700 rounded-lg text-xs font-mono font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-400">
                <span className="text-white font-semibold">Production Architecture Guarantee:</span> Altivio delivers zero-debt code with 95%+ test coverage, automated CI/CD pipelines, and high-availability cloud deployment configurations.
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="text-xs text-slate-400">
            Interested in building a platform like {project.title}?
          </div>
          <button
            onClick={() => {
              onClose();
              onContactForSimilar(project.title);
            }}
            className="px-5 py-2.5 text-xs font-bold text-slate-950 btn-ink rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Book Strategy Session for This Scope</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
