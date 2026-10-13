import React from 'react';

interface WireframeIllustrationProps {
  type: 'ui-wireframe' | 'code-browser' | 'brand-mark' | 'box-package' | 'mobile-mock' | 'neural-network' | 'chart-growth';
  isSelected?: boolean;
}

export const ServiceWireframeIllustration: React.FC<WireframeIllustrationProps> = ({
  type,
  isSelected = false
}) => {
  const accentColor = isSelected ? '#17171C' : '#94A3B8';
  const fillColor = isSelected ? '#F7FEE7' : '#F8FAFC';
  const strokeColor = isSelected ? '#33322F' : '#64748B';

  switch (type) {
    case 'ui-wireframe':
      // As shown in top-right of image: Wireframe layout notepad with sketch elements
      return (
        <svg viewBox="0 0 160 110" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
          {/* Main wireframe sheet tilted slightly */}
          <rect x="18" y="10" width="124" height="88" rx="8" fill={fillColor} stroke={strokeColor} strokeWidth="1.5" />
          {/* Header wireframe row */}
          <rect x="28" y="20" width="40" height="8" rx="2" fill={isSelected ? '#6B6862' : '#E2E8F0'} />
          <rect x="114" y="20" width="16" height="8" rx="2" fill={strokeColor} opacity="0.3" />
          {/* Image placeholder with wireframe cross */}
          <rect x="28" y="36" width="48" height="48" rx="4" fill="white" stroke={strokeColor} strokeWidth="1.2" />
          <line x1="28" y1="36" x2="76" y2="84" stroke={strokeColor} strokeWidth="0.8" strokeDasharray="2 2" />
          <line x1="76" y1="36" x2="28" y2="84" stroke={strokeColor} strokeWidth="0.8" strokeDasharray="2 2" />
          {/* Content lines on right */}
          <line x1="84" y1="42" x2="130" y2="42" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" />
          <line x1="84" y1="52" x2="124" y2="52" stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
          <line x1="84" y1="62" x2="128" y2="62" stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
          {/* Wireframe CTA button */}
          <rect x="84" y="72" width="36" height="12" rx="3" fill={isSelected ? '#17171C' : '#17171C'} opacity="0.8" />
        </svg>
      );

    case 'code-browser':
      // As shown in top-right of image: Browser window wireframe
      return (
        <svg viewBox="0 0 160 110" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
          {/* Browser frame */}
          <rect x="14" y="14" width="132" height="82" rx="6" fill={fillColor} stroke={strokeColor} strokeWidth="1.5" />
          {/* Window controls */}
          <circle cx="26" cy="24" r="3" fill="#EF4444" opacity="0.7" />
          <circle cx="34" cy="24" r="3" fill="#F59E0B" opacity="0.7" />
          <circle cx="42" cy="24" r="3" fill="#10B981" opacity="0.7" />
          {/* Address bar */}
          <rect x="52" y="20" width="70" height="8" rx="3" fill="white" stroke={strokeColor} strokeWidth="0.8" />
          <line x1="14" y1="32" x2="146" y2="32" stroke={strokeColor} strokeWidth="1" />
          {/* Code/Grid layout */}
          <rect x="24" y="42" width="46" height="42" rx="3" fill="white" stroke={strokeColor} strokeWidth="1" />
          <rect x="30" y="48" width="34" height="6" rx="2" fill={isSelected ? '#6B6862' : '#E2E8F0'} />
          <rect x="30" y="58" width="24" height="4" rx="1.5" fill={strokeColor} opacity="0.4" />
          <rect x="30" y="66" width="30" height="4" rx="1.5" fill={strokeColor} opacity="0.4" />
          {/* Code block editor on right */}
          <rect x="76" y="42" width="60" height="42" rx="3" fill="#0F172A" />
          <line x1="82" y1="52" x2="114" y2="52" stroke="#38BDF8" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="82" y1="60" x2="126" y2="60" stroke="#9A968E" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="86" y1="68" x2="118" y2="68" stroke="#34D399" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="82" y1="76" x2="98" y2="76" stroke="#F472B6" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );

    case 'mobile-mock':
      return (
        <svg viewBox="0 0 160 110" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
          {/* Phone body */}
          <rect x="52" y="8" width="56" height="94" rx="10" fill={fillColor} stroke={strokeColor} strokeWidth="1.5" />
          {/* Notch / Speaker */}
          <rect x="70" y="12" width="20" height="4" rx="2" fill={strokeColor} opacity="0.6" />
          {/* Screen content */}
          <rect x="58" y="24" width="44" height="26" rx="4" fill="white" stroke={strokeColor} strokeWidth="1" />
          <circle cx="80" cy="37" r="7" fill={isSelected ? '#6B6862' : '#CFCBC2'} />
          {/* Feed cards */}
          <rect x="58" y="56" width="44" height="12" rx="3" fill="white" stroke={strokeColor} strokeWidth="0.8" />
          <rect x="58" y="72" width="44" height="12" rx="3" fill="white" stroke={strokeColor} strokeWidth="0.8" />
          {/* Home indicator bar */}
          <line x1="72" y1="96" x2="88" y2="96" stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );

    case 'neural-network':
      return (
        <svg viewBox="0 0 160 110" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
          {/* Input layer */}
          <circle cx="30" cy="30" r="5" fill="#17171C" />
          <circle cx="30" cy="55" r="5" fill="#17171C" />
          <circle cx="30" cy="80" r="5" fill="#17171C" />
          
          {/* Hidden layer 1 */}
          <circle cx="68" cy="22" r="5" fill={isSelected ? '#17171C' : '#6B6862'} />
          <circle cx="68" cy="44" r="5" fill={isSelected ? '#17171C' : '#6B6862'} />
          <circle cx="68" cy="66" r="5" fill={isSelected ? '#17171C' : '#6B6862'} />
          <circle cx="68" cy="88" r="5" fill={isSelected ? '#17171C' : '#6B6862'} />
          
          {/* Hidden layer 2 */}
          <circle cx="106" cy="34" r="5" fill={isSelected ? '#6B6862' : '#9A968E'} />
          <circle cx="106" cy="55" r="5" fill={isSelected ? '#6B6862' : '#9A968E'} />
          <circle cx="106" cy="76" r="5" fill={isSelected ? '#6B6862' : '#9A968E'} />

          {/* Output layer */}
          <circle cx="140" cy="55" r="6" fill="#10B981" stroke="#047857" strokeWidth="1.5" />

          {/* Synapses connections */}
          <g stroke={strokeColor} strokeWidth="0.75" opacity="0.35">
            <line x1="30" y1="30" x2="68" y2="22" />
            <line x1="30" y1="30" x2="68" y2="44" />
            <line x1="30" y1="55" x2="68" y2="44" />
            <line x1="30" y1="55" x2="68" y2="66" />
            <line x1="30" y1="80" x2="68" y2="66" />
            <line x1="30" y1="80" x2="68" y2="88" />
            
            <line x1="68" y1="22" x2="106" y2="34" />
            <line x1="68" y1="44" x2="106" y2="34" />
            <line x1="68" y1="44" x2="106" y2="55" />
            <line x1="68" y1="66" x2="106" y2="55" />
            <line x1="68" y1="66" x2="106" y2="76" />
            <line x1="68" y1="88" x2="106" y2="76" />

            <line x1="106" y1="34" x2="140" y2="55" />
            <line x1="106" y1="55" x2="140" y2="55" strokeWidth="1.2" stroke={isSelected ? '#17171C' : '#17171C'} opacity="0.8" />
            <line x1="106" y1="76" x2="140" y2="55" />
          </g>
        </svg>
      );

    case 'brand-mark':
      return (
        <svg viewBox="0 0 160 110" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
          {/* Blueprint circle guides */}
          <circle cx="80" cy="55" r="42" stroke={strokeColor} strokeWidth="0.75" strokeDasharray="3 3" opacity="0.3" />
          <circle cx="80" cy="55" r="26" stroke={strokeColor} strokeWidth="0.75" strokeDasharray="2 2" opacity="0.3" />
          {/* Grid lines */}
          <line x1="20" y1="55" x2="140" y2="55" stroke={strokeColor} strokeWidth="0.5" strokeDasharray="3 3" opacity="0.25" />
          <line x1="80" y1="10" x2="80" y2="100" stroke={strokeColor} strokeWidth="0.5" strokeDasharray="3 3" opacity="0.25" />
          {/* Geometry Logo Mark */}
          <polygon points="80,24 50,82 110,82" stroke={strokeColor} strokeWidth="1.5" fill={fillColor} />
          <polygon points="80,24 64,82 96,82" fill={isSelected ? '#6B6862' : '#CFCBC2'} opacity="0.8" />
          <circle cx="80" cy="62" r="5" fill="#17171C" />
        </svg>
      );

    case 'box-package':
      return (
        <svg viewBox="0 0 160 110" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
          {/* 3D isometric box */}
          {/* Top flap */}
          <polygon points="80,18 125,38 80,58 35,38" fill={isSelected ? '#F0EEE9' : '#F1F5F9'} stroke={strokeColor} strokeWidth="1.5" />
          {/* Left panel */}
          <polygon points="35,38 80,58 80,94 35,74" fill={isSelected ? '#6B6862' : '#E2E8F0'} stroke={strokeColor} strokeWidth="1.5" />
          {/* Right panel */}
          <polygon points="80,58 125,38 125,74 80,94" fill={isSelected ? '#6B6862' : '#CBD5E1'} stroke={strokeColor} strokeWidth="1.5" />
          {/* Packaging label on side */}
          <polygon points="88,64 117,50 117,62 88,76" fill="white" opacity="0.85" />
          <line x1="92" y1="67" x2="112" y2="57" stroke="#17171C" strokeWidth="1.5" />
        </svg>
      );

    case 'chart-growth':
      return (
        <svg viewBox="0 0 160 110" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
          {/* Presentation slide frame */}
          <rect x="18" y="14" width="124" height="82" rx="6" fill={fillColor} stroke={strokeColor} strokeWidth="1.5" />
          {/* Slide title */}
          <rect x="28" y="24" width="45" height="6" rx="2" fill={strokeColor} opacity="0.5" />
          {/* Chart Axes */}
          <line x1="30" y1="84" x2="130" y2="84" stroke={strokeColor} strokeWidth="1.2" />
          <line x1="30" y1="38" x2="30" y2="84" stroke={strokeColor} strokeWidth="1.2" />
          {/* Growth Bars & Trend line */}
          <rect x="42" y="66" width="12" height="18" rx="2" fill={isSelected ? '#CFCBC2' : '#E2E8F0'} />
          <rect x="64" y="56" width="12" height="28" rx="2" fill={isSelected ? '#9A968E' : '#CBD5E1'} />
          <rect x="86" y="44" width="12" height="40" rx="2" fill={isSelected ? '#6B6862' : '#94A3B8'} />
          <rect x="108" y="32" width="12" height="52" rx="2" fill={isSelected ? '#17171C' : '#17171C'} />
          {/* Upward curved trajectory line */}
          <path d="M42 70 Q 75 60 118 30" stroke="#10B981" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <polygon points="120,27 122,34 115,32" fill="#10B981" />
        </svg>
      );

    default:
      return null;
  }
};
