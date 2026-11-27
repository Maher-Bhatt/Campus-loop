import React from 'react';

export interface CampusLoopLogoProps {
  size?: 'sm' | 'md' | 'lg' | number;
  /** Kept for API compatibility; the subtitle is no longer shown. */
  showSubtitle?: boolean;
  className?: string;
}

const MARK = { sm: 22, md: 24, lg: 30 } as const;
const TEXT = { sm: 'text-[15px]', md: 'text-base', lg: 'text-xl' } as const;

/** Plain wordmark: a small open-loop mark and the product name in one ink colour. */
export const CampusLoopLogo: React.FC<CampusLoopLogoProps> = ({ size: rawSize = 'md', className = '' }) => {
  const size: 'sm' | 'md' | 'lg' =
    typeof rawSize === 'number' ? (rawSize <= 28 ? 'sm' : rawSize <= 34 ? 'md' : 'lg') : rawSize;
  const px = MARK[size];

  return (
    <span className={`inline-flex items-center gap-2 select-none ${className}`}>
      <svg width={px} height={px} viewBox="0 0 24 24" aria-hidden className="shrink-0">
        <rect width="24" height="24" rx="6" className="fill-foreground" />
        <path
          d="M15.5 8.2A5 5 0 1 0 17 12"
          fill="none"
          strokeWidth="2.4"
          strokeLinecap="round"
          className="stroke-background"
        />
        <circle cx="17" cy="8" r="1.6" className="fill-primary" />
      </svg>
      <span className={`font-semibold tracking-tight text-foreground ${TEXT[size]}`}>CampusLoop</span>
    </span>
  );
};
