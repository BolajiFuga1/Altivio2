import React from 'react';

interface AltivioLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showWordmark?: boolean;
  className?: string;
  theme?: 'light' | 'dark' | 'auto';
}

export const AltivioLogo: React.FC<AltivioLogoProps> = ({
  size = 'md',
  showWordmark = true,
  className = '',
  theme = 'auto'
}) => {
  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-7 h-7',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-[23px] tracking-[-0.04em]',
    lg: 'text-3xl',
    xl: 'text-4xl'
  };

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Geometric Delta / Faceted Mark matching the Altivio image */}
      <svg
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${iconSizes[size]} shrink-0 transition-transform duration-300 group-hover:scale-105 ${
          theme === 'dark' ? 'text-purple-300' : theme === 'light' ? 'text-purple-600' : 'text-purple-600 dark:text-purple-300'
        }`}
      >
        {/* Main modern delta triangle left wing */}
        <path d="M24 6L6 42H18L28 20L24 6Z" fill="currentColor" />
        {/* Right facet wing */}
        <path d="M24 6L38 30L30 30L22 14L24 6Z" fill="#D18EE2" />
        {/* Triangular anchor at bottom right */}
        <path d="M32 28L44 42H28L32 28Z" fill="#FF7759" />
      </svg>

      {showWordmark && (
        <span
          className={`font-display ${textSizes[size]} ${
            theme === 'dark'
              ? 'text-white'
              : theme === 'light'
              ? 'text-slate-900'
              : 'text-slate-900 dark:text-white'
          }`}
        >
          Altivio
        </span>
      )}
    </div>
  );
};
