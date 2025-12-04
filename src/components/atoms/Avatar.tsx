import { type CSSProperties } from 'react';

interface AvatarProps {
  src?: string | null;
  alt: string;
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  fallback?: string;
  style?: CSSProperties;
}

export function Avatar({ src, alt, size = 'medium', fallback, style }: AvatarProps) {
  const sizeMap = {
    small: 'var(--size-6)',
    medium: 'var(--size-8)',
    large: 'var(--size-10)',
    xlarge: 'var(--size-12)',
  };

  const dimension = sizeMap[size];

  const avatarStyle: CSSProperties = {
    width: dimension,
    height: dimension,
    borderRadius: '50%',
    objectFit: 'cover',
    background: 'var(--surface-3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 'var(--font-size-2)',
    fontWeight: 'var(--font-weight-6)',
    color: 'var(--text-2)',
    flexShrink: 0,
    ...style,
  };

  if (!src) {
    return (
      <div style={avatarStyle}>
        {fallback || alt.charAt(0).toUpperCase()}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      style={avatarStyle}
      onError={(e) => {
        // Replace with fallback on error
        const target = e.target as HTMLImageElement;
        target.style.display = 'none';
        const parent = target.parentElement;
        if (parent) {
          parent.textContent = fallback || alt.charAt(0).toUpperCase();
        }
      }}
    />
  );
}
