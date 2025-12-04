import { type CSSProperties, type ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  style?: CSSProperties;
}

export function Badge({ children, variant = 'primary', style }: BadgeProps) {
  const variantStyles = {
    primary: {
      background: 'var(--blue-2)',
      color: 'var(--blue-9)',
    },
    secondary: {
      background: 'var(--gray-2)',
      color: 'var(--gray-9)',
    },
    success: {
      background: 'var(--green-2)',
      color: 'var(--green-9)',
    },
    warning: {
      background: 'var(--orange-2)',
      color: 'var(--orange-9)',
    },
    danger: {
      background: 'var(--red-2)',
      color: 'var(--red-9)',
    },
  };

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: 'var(--size-1) var(--size-2)',
        fontSize: 'var(--font-size-0)',
        fontWeight: 'var(--font-weight-6)',
        borderRadius: 'var(--radius-2)',
        ...variantStyles[variant],
        ...style,
      }}
    >
      {children}
    </span>
  );
}
