import React from 'react';

export type CampusButtonVariant = 'primary' | 'dark' | 'outline' | 'lime' | 'lightBlue';
export type CampusButtonSize = 'sm' | 'lg';

export interface CampusButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: CampusButtonVariant;
  size?: CampusButtonSize;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

export const CampusButton = React.forwardRef<HTMLButtonElement, CampusButtonProps>(
  (
    {
      variant = 'primary',
      size = 'lg',
      icon,
      iconPosition = 'left',
      fullWidth = false,
      className = '',
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    // Sizing
    const sizeClasses =
      size === 'sm'
        ? 'h-9 px-3.5 text-sm font-medium'
        : 'h-10 px-5 text-sm font-medium';

    // Variant classes
    const variantClasses: Record<CampusButtonVariant, string> = {
      primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
      dark: 'bg-foreground text-background hover:bg-foreground/90',
      outline: 'bg-card text-foreground border border-input hover:bg-secondary',
      lime: 'bg-secondary text-foreground hover:bg-secondary/70',
      lightBlue: 'bg-accent text-accent-foreground hover:bg-accent/70',
    };

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={`inline-flex items-center justify-center gap-2 rounded-md transition-colors select-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none ${sizeClasses} ${variantClasses[variant]} ${
 fullWidth ? 'w-full' : ''
 } ${className}`}
        {...props}
      >
        {icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>}
        {children}
        {icon && iconPosition === 'right' && <span className="shrink-0">{icon}</span>}
      </button>
    );
  }
);

CampusButton.displayName = 'CampusButton';
