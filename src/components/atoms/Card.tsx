import { type CSSProperties, type ReactNode, forwardRef, type ElementType } from 'react';

interface CardProps {
  children: ReactNode;
  padding?: 'none' | 'small' | 'medium' | 'large';
  hoverable?: boolean;
  style?: CSSProperties;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  as?: ElementType;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { children, padding = 'medium', hoverable = false, style, className, onClick, as: Component = 'div' },
  ref
) {
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

  return (
    <Component
      ref={ref}
      style={cardStyle}
      className={className}
      onClick={onClick}
      onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => {
        if (hoverable) {
          e.currentTarget.style.boxShadow = 'var(--shadow-4)';
          e.currentTarget.style.transform = 'translateY(-2px)';
        }
      }}
      onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => {
        if (hoverable) {
          e.currentTarget.style.boxShadow = 'var(--shadow-2)';
          e.currentTarget.style.transform = 'translateY(0)';
        }
      }}
    >
      {children}
    </Component>
  );
});
