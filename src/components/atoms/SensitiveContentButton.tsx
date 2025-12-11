import { useState } from 'react';

interface SensitiveContentButtonProps {
  onClick: (e: React.MouseEvent) => void;
  label?: string;
}

export function SensitiveContentButton({
  onClick,
  label = 'Click to view sensitive content',
}: SensitiveContentButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick(e);
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        padding: 'var(--size-3) var(--size-4)',
        background: isHovered ? 'var(--surface-3)' : 'var(--surface-2)',
        border: `2px solid ${isHovered ? 'var(--blue-6)' : 'var(--surface-4)'}`,
        borderRadius: 'var(--radius-2)',
        color: 'var(--text-1)',
        fontSize: 'var(--font-size-1)',
        fontWeight: 'var(--font-weight-6)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--size-2)',
        boxShadow: 'var(--shadow-3)',
        transition: 'all 0.2s ease',
      }}
    >
      {label}
    </button>
  );
}
