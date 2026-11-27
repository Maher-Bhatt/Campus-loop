import React from 'react';

export interface CampusFilterChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  count?: number | string;
  icon?: React.ReactNode;
}

export const CampusFilterChip = React.forwardRef<HTMLButtonElement, CampusFilterChipProps>(
  ({ active = false, count, icon, children, className = '', ...props }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        className={`h-8 px-3 rounded-md text-[13px] font-medium inline-flex items-center gap-1.5 transition-colors select-none cursor-pointer shrink-0 ${
 active
 ? 'bg-foreground text-background'
 : 'bg-card text-muted-foreground border border-border hover:text-foreground hover:border-foreground/25'
 } ${className}`}
        {...props}
      >
        {icon && <span className="shrink-0">{icon}</span>}
        <span>{children}</span>
        {count !== undefined && (
          <span
            className={`text-xs px-1 rounded font-medium tabular-nums ${
 active
 ? 'bg-background/20 text-background'
 : 'bg-secondary text-muted-foreground'
 }`}
          >
            {count}
          </span>
        )}
      </button>
    );
  }
);

CampusFilterChip.displayName = 'CampusFilterChip';
