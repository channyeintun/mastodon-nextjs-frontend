import type { ReactNode } from 'react';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--size-8) var(--size-4)',
        textAlign: 'center',
        color: 'var(--text-2)',
      }}
    >
      {icon && (
        <div
          style={{
            fontSize: 'var(--font-size-6)',
            marginBottom: 'var(--size-4)',
            opacity: 0.5,
          }}
        >
          {icon}
        </div>
      )}

      <h3
        style={{
          margin: 0,
          fontSize: 'var(--font-size-3)',
          fontWeight: 600,
          color: 'var(--text-1)',
          marginBottom: description ? 'var(--size-2)' : 0,
        }}
      >
        {title}
      </h3>

      {description && (
        <p
          style={{
            margin: 0,
            fontSize: 'var(--font-size-1)',
            maxWidth: '400px',
          }}
        >
          {description}
        </p>
      )}

      {action && (
        <div style={{ marginTop: 'var(--size-4)' }}>
          {action}
        </div>
      )}
    </div>
  );
}
