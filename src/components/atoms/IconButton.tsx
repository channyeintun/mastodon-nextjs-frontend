import { type ButtonHTMLAttributes, type ReactNode } from 'react';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  size?: 'small' | 'medium' | 'large';
  variant?: 'default' | 'primary' | 'danger';
}

export function IconButton({
  children,
  size = 'medium',
  variant = 'default',
  disabled,
  style,
  ...props
}: IconButtonProps) {
  const sizeMap = {
    small: 'var(--size-5)',
    medium: 'var(--size-7)',
    large: 'var(--size-9)',
  };

  const variantStyles = {
    default: {
      background: 'transparent',
      color: 'var(--text-2)',
    },
    primary: {
      background: 'var(--blue-6)',
      color: 'white',
    },
    danger: {
      background: 'var(--red-6)',
      color: 'white',
    },
  };

  const dimension = sizeMap[size];

  return (
    <button
      {...props}
      disabled={disabled}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: dimension,
        height: dimension,
        padding: '0',
        border: 'none',
        borderRadius: '50%',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s ease',
        opacity: disabled ? 0.6 : 1,
        ...variantStyles[variant],
        ...style,
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.opacity = '0.8';
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          e.currentTarget.style.opacity = '1';
        }
      }}
    >
      {children}
    </button>
  );
}
