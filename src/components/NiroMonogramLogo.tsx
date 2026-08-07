import React from 'react';

interface NiroMonogramLogoProps {
  className?: string;
  variant?: 'dark' | 'light' | 'gold' | 'outline';
  showText?: boolean;
  subtext?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const NiroMonogramLogo: React.FC<NiroMonogramLogoProps> = ({
  className = '',
  variant = 'dark',
  showText = true,
  subtext = 'Nikola Rohlová | Interior Architecture',
  size = 'md',
}) => {
  const isLight = variant === 'light';
  const isGold = variant === 'gold';

  const strokeColor = isLight ? '#FAF9F6' : isGold ? '#C5A059' : '#1C1B1A';
  const textColor = isLight ? '#FAF9F6' : '#1C1B1A';
  const subtextColor = isLight ? '#D8D2C4' : '#8E8D8A';

  const sizeClasses = {
    sm: 'h-6',
    md: 'h-9',
    lg: 'h-12',
    xl: 'h-16',
  };

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      {/* Monogram SVG Icon: Interlocking geometric N & R representing Nikola Rohlová */}
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${sizeClasses[size]} w-auto aspect-square shrink-0`}
      >
        {/* Outer Minimalist Architectural Square */}
        <rect
          x="6"
          y="6"
          width="88"
          height="88"
          rx="2"
          stroke={strokeColor}
          strokeWidth="3"
          strokeDasharray="88 8"
        />

        {/* Diagonal architectural axis line */}
        <line
          x1="18"
          y1="82"
          x2="82"
          y2="18"
          stroke={strokeColor}
          strokeWidth="1.2"
          strokeOpacity="0.3"
        />

        {/* Stem for N & R (Left pillar) */}
        <path
          d="M26 22V78"
          stroke={strokeColor}
          strokeWidth="5"
          strokeLinecap="square"
        />

        {/* N Diagonal stroke */}
        <path
          d="M26 22L54 78"
          stroke={strokeColor}
          strokeWidth="4"
          strokeLinecap="square"
        />

        {/* Right Pillar for N */}
        <path
          d="M54 22V78"
          stroke={strokeColor}
          strokeWidth="5"
          strokeLinecap="square"
        />

        {/* R Loop overlay merging N with R */}
        <path
          d="M54 22H72C78.6274 22 84 27.3726 84 34C84 40.6274 78.6274 46 72 46H54"
          stroke={strokeColor}
          strokeWidth="4.5"
          strokeLinecap="square"
        />

        {/* R Leg stroke extending down to bottom right */}
        <path
          d="M62 46L82 78"
          stroke={strokeColor}
          strokeWidth="4.5"
          strokeLinecap="square"
        />

        {/* Fine precision corner ticks */}
        <circle cx="26" cy="22" r="2.5" fill={strokeColor} />
        <circle cx="82" cy="78" r="2.5" fill={strokeColor} />
      </svg>

      {/* Brand Typography */}
      {showText && (
        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-2 leading-none">
            <span
              className="font-serif font-bold tracking-[0.25em] text-lg sm:text-xl"
              style={{ color: textColor }}
            >
              N I R O
            </span>
            <span
              className={`text-[9px] font-mono px-1.5 py-0.5 rounded-xs uppercase tracking-widest font-semibold ${
                isLight ? 'bg-[#FAF9F6] text-[#1C1B1A]' : 'bg-[#1C1B1A] text-[#FAF9F6]'
              }`}
            >
              Studio
            </span>
          </div>

          {subtext && (
            <span
              className="text-[9.5px] uppercase tracking-[0.18em] font-medium mt-1 truncate"
              style={{ color: subtextColor }}
            >
              {subtext}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
