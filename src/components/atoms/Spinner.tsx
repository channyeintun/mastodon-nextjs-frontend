import { type CSSProperties } from 'react';

interface SpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  style?: CSSProperties;
}

export function Spinner({ size = 'medium', color, style }: SpinnerProps) {
  const sizeMap = {
    small: 'var(--size-4)',
    medium: 'var(--size-6)',
    large: 'var(--size-8)',
  };

  const dimension = sizeMap[size];

  return (
    <div
      className="spinner"
      style={{
        width: dimension,
        height: dimension,
        borderTopColor: color || 'var(--blue-6)',
        ...style,
      }}
    />
  );
}
