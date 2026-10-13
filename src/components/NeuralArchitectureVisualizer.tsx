import React, { useState, useEffect } from 'react';

interface NeuralVisualizerProps {
  selectedServiceCount: number;
  hasAi: boolean;
  hasMobile: boolean;
  hasWeb: boolean;
  hasBrand: boolean;
}

export const NeuralArchitectureVisualizer: React.FC<NeuralVisualizerProps> = ({
  selectedServiceCount,
  hasAi,
  hasMobile,
  hasWeb,
  hasBrand
}) => {
  const [activeNode, setActiveNode] = useState<string>('node-2-2');
  const [pulseIndex, setPulseIndex] = useState<number>(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setPulseIndex((prev) => (prev + 1) % 5);
    }, 1800);
    return () => clearInterval(timer);
  }, []);

  // Layers matching the neural diagram in the user's image
  const layers = [
    { id: 'input', label: 'Inputs / Requests', count: 5, x: 50 },
    { id: 'hidden1', label: 'Processing & Logic', count: 6, x: 120 },
    { id: 'hidden2', label: 'AI & Data Flow', count: 6, x: 190 },
    { id: 'hidden3', label: 'Inference Layer', count: 6, x: 260 },
    { id: 'output', label: 'Client Delivery', count: 2, x: 330 }
  ];

  return (
    <div className="w-full bg-white dark:bg-slate-900/90 rounded-2xl p-4 sm:p-5 border border-purple-100 dark:border-purple-900/40 flex flex-col items-center justify-center relative overflow-hidden transition-colors">
      <div className="w-full flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2 font-mono">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-purple-600 animate-ping" />
          How your project comes together
        </span>
        <span className="text-[11px] text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/80 px-2 py-0.5 rounded font-semibold border border-transparent dark:border-purple-800/80">
          {selectedServiceCount} services selected
        </span>
      </div>

      {/* SVG Neural Graph matching the mockup */}
      <svg
        viewBox="0 0 380 230"
        className="w-full max-w-[380px] h-auto select-none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="neural-edge-glow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4D4B47" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#6B6862" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#17171C" stopOpacity="0.9" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Dynamic connection lines */}
        <g stroke="#CBD5E1" strokeWidth="0.8" opacity="0.6">
          {/* Layer 1 to 2 */}
          {[20, 55, 90, 125, 160].map((y1, i) =>
            [15, 45, 75, 105, 135, 165].map((y2, j) => (
              <line
                key={`l1-${i}-${j}`}
                x1={50}
                y1={y1 + 25}
                x2={120}
                y2={y2 + 20}
                stroke={i === pulseIndex ? 'url(#neural-edge-glow)' : '#CBD5E1'}
                strokeWidth={i === pulseIndex ? '1.5' : '0.6'}
                className="transition-all duration-500"
              />
            ))
          )}

          {/* Layer 2 to 3 */}
          {[15, 45, 75, 105, 135, 165].map((y1, i) =>
            [15, 45, 75, 105, 135, 165].map((y2, j) => (
              <line
                key={`l2-${i}-${j}`}
                x1={120}
                y1={y1 + 20}
                x2={190}
                y2={y2 + 20}
                stroke={hasAi && (i + j) % 3 === 0 ? '#9A968E' : '#CBD5E1'}
                strokeWidth={hasAi && (i + j) % 3 === 0 ? '1.2' : '0.6'}
              />
            ))
          )}

          {/* Layer 3 to 4 */}
          {[15, 45, 75, 105, 135, 165].map((y1, i) =>
            [15, 45, 75, 105, 135, 165].map((y2, j) => (
              <line
                key={`l3-${i}-${j}`}
                x1={190}
                y1={y1 + 20}
                x2={260}
                y2={y2 + 20}
                stroke="#CBD5E1"
                strokeWidth="0.6"
              />
            ))
          )}

          {/* Layer 4 to Output */}
          {[15, 45, 75, 105, 135, 165].map((y1, i) =>
            [65, 125].map((y2, j) => (
              <line
                key={`l4-${i}-${j}`}
                x1={260}
                y1={y1 + 20}
                x2={330}
                y2={y2 + 20}
                stroke={j === 0 ? '#17171C' : '#6B6862'}
                strokeWidth="1.2"
                opacity="0.8"
              />
            ))
          )}
        </g>

        {/* Input Layer Nodes (Rectangular inputs as in mockup) */}
        {[20, 55, 90, 125, 160].map((y, idx) => (
          <rect
            key={`in-${idx}`}
            x="38"
            y={y + 16}
            width="24"
            height="16"
            rx="4"
            fill={idx === pulseIndex ? '#17171C' : '#F0EEE9'}
            stroke="#17171C"
            strokeWidth="1.2"
            className="cursor-pointer transition-colors duration-300"
            onClick={() => setActiveNode(`input-${idx}`)}
          />
        ))}

        {/* Layer 2 Nodes (Circles) */}
        {[15, 45, 75, 105, 135, 165].map((y, idx) => (
          <circle
            key={`l2-${idx}`}
            cx="120"
            cy={y + 20}
            r="8"
            fill="#F0EEE9"
            stroke="#33322F"
            strokeWidth="1.5"
            className="cursor-pointer hover:fill-purple-300 transition-colors"
            onClick={() => setActiveNode(`l2-${idx}`)}
          />
        ))}

        {/* Layer 3 Nodes (Circles) */}
        {[15, 45, 75, 105, 135, 165].map((y, idx) => (
          <circle
            key={`l3-${idx}`}
            cx="190"
            cy={y + 20}
            r="8"
            fill={hasAi ? '#FAF9F6' : '#F1F5F9'}
            stroke="#6B6862"
            strokeWidth="1.5"
            className="cursor-pointer hover:fill-purple-300 transition-colors"
            onClick={() => setActiveNode(`l3-${idx}`)}
          />
        ))}

        {/* Layer 4 Nodes (Circles) */}
        {[15, 45, 75, 105, 135, 165].map((y, idx) => (
          <circle
            key={`l4-${idx}`}
            cx="260"
            cy={y + 20}
            r="8"
            fill="#FAF9F6"
            stroke="#17171C"
            strokeWidth="1.5"
            className="cursor-pointer hover:fill-purple-300 transition-colors"
            onClick={() => setActiveNode(`l4-${idx}`)}
          />
        ))}

        {/* Output Node (Lime accent node as in user mockup image) */}
        <circle
          cx="330"
          cy="85"
          r="11"
          fill="#6B6862"
          stroke="#33322F"
          strokeWidth="2"
          filter="url(#glow)"
          className="cursor-pointer hover:scale-110 transition-transform"
        />
        <circle cx="330" cy="85" r="4" fill="#15803D" />

        <circle
          cx="330"
          cy="145"
          r="9"
          fill="#F0EEE9"
          stroke="#17171C"
          strokeWidth="1.8"
          className="cursor-pointer"
        />
        <circle cx="330" cy="145" r="3" fill="#6D28D9" />

        {/* Labels below */}
        <text x="50" y="215" textAnchor="middle" fill="#64748B" fontSize="9" fontFamily="sans-serif">
          Your idea
        </text>
        <text x="190" y="215" textAnchor="middle" fill="#64748B" fontSize="9" fontFamily="sans-serif">
          Design & build
        </text>
        <text x="330" y="215" textAnchor="middle" fill="#15803D" fontSize="9" fontWeight="bold" fontFamily="sans-serif">
          Launch
        </text>
      </svg>
    </div>
  );
};
