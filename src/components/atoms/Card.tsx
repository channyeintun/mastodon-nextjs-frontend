import { type CSSProperties, type ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  padding?: 'none' | 'small' | 'medium' | 'large';
  hoverable?: boolean;
  style?: CSSProperties;
  onClick?: () => void;
}

export function Card({ children, padding = 'medium', hoverable = false, style, onClick }: CardProps) {
  const paddingMap = {
    none: '0',
    small: 'var(--size-2)',
    medium: 'var(--size-4)',
    large: 'var(--size-6)',
  };

  const cardStyle: CSSProperties = {
    background: 'var(--surface-2)',
    borderRadius: 'var(--radius-3)',
    padding: paddingMap[padding],
    boxShadow: 'var(--shadow-2)',
    transition: 'all 0.2s ease',
    cursor: onClick ? 'pointer' : 'default',
    ...style,
  };

  const hoverStyle: CSSProperties = hoverable
    ? {
        ':hover': {
          boxShadow: 'var(--shadow-4)',
          transform: 'translateY(-2px)',
        },
      }
    : {};

  return (
    <div
      style={cardStyle}
      onClick={onClick}
      onMouseEnter={(e) => {
        if (hoverable) {
          e.currentTarget.style.boxShadow = 'var(--shadow-4)';
          e.currentTarget.style.transform = 'translateY(-2px)';
        }
      }}
      onMouseLeave={(e) => {
        if (hoverable) {
          e.currentTarget.style.boxShadow = 'var(--shadow-2)';
          e.currentTarget.style.transform = 'translateY(0)';
        }
      }}
    >
      {children}
    </div>
  );
}
