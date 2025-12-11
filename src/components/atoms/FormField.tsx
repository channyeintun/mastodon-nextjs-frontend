import type { ReactNode } from 'react';

interface FormFieldProps {
  label: string;
  htmlFor?: string;
  required?: boolean;
  error?: string;
  description?: string;
  children: ReactNode;
}

export function FormField({
  label,
  htmlFor,
  required = false,
  error,
  description,
  children,
}: FormFieldProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--size-2)',
      }}
    >
      <label
        htmlFor={htmlFor}
        style={{
          fontSize: 'var(--font-size-1)',
          fontWeight: 600,
          color: 'var(--text-1)',
        }}
      >
        {label}
        {required && (
          <span style={{ color: 'var(--red-6)', marginLeft: '4px' }}>*</span>
        )}
      </label>

      {description && (
        <p
          style={{
            fontSize: 'var(--font-size-0)',
            color: 'var(--text-2)',
            margin: 0,
          }}
        >
          {description}
        </p>
      )}

      {children}

      {error && (
        <span
          style={{
            fontSize: 'var(--font-size-0)',
            color: 'var(--red-6)',
          }}
        >
          {error}
        </span>
      )}
    </div>
  );
}
