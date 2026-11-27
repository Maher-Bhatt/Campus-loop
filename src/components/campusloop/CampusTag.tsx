import React from 'react';

export type CampusTagVariant = 'blue' | 'lime' | 'pink' | 'slate' | 'live' | 'dark';

export interface CampusTagProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: CampusTagVariant;
  icon?: React.ReactNode;
}

export const CampusTag: React.FC<CampusTagProps> = ({
  variant = 'blue',
  icon,
  children,
  className = '',
  ...props
}) => {
  const variantClasses: Record<CampusTagVariant, string> = {
    blue: 'bg-accent text-accent-foreground',
    lime: 'bg-secondary text-foreground',
    pink: 'bg-destructive/10 text-destructive',
    slate: 'bg-secondary text-muted-foreground',
    live: 'bg-success/10 text-success',
    dark: 'bg-foreground text-background',
  };

  return (
    <span
      className={`h-6 px-2 rounded-md text-xs font-medium inline-flex items-center gap-1.5 select-none shrink-0 ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {variant === 'live' && !icon && (
        <span className="w-1.5 h-1.5 rounded-full bg-success" />
      )}
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};
