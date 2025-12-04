import { type TextareaHTMLAttributes, forwardRef } from 'react';

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, error, fullWidth = false, style, ...props }, ref) => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--size-1)', width: fullWidth ? '100%' : 'auto' }}>
        {label && (
          <label
            htmlFor={props.id}
            style={{
              fontSize: 'var(--font-size-1)',
              fontWeight: 'var(--font-weight-6)',
              color: 'var(--text-1)',
            }}
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          {...props}
          style={{
            padding: 'var(--size-2) var(--size-3)',
            fontSize: 'var(--font-size-1)',
            border: `1px solid ${error ? 'var(--red-6)' : 'var(--surface-4)'}`,
            borderRadius: 'var(--radius-2)',
            background: 'var(--surface-1)',
            color: 'var(--text-1)',
            outline: 'none',
            transition: 'border-color 0.2s ease',
            width: fullWidth ? '100%' : 'auto',
            resize: 'vertical',
            fontFamily: 'inherit',
            minHeight: 'var(--size-12)',
            ...style,
          }}
          onFocus={(e) => {
            e.target.style.borderColor = error ? 'var(--red-6)' : 'var(--blue-6)';
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            e.target.style.borderColor = error ? 'var(--red-6)' : 'var(--surface-4)';
            props.onBlur?.(e);
          }}
        />
        {error && (
          <span style={{ fontSize: 'var(--font-size-0)', color: 'var(--red-7)' }}>
            {error}
          </span>
        )}
      </div>
    );
  }
);

TextArea.displayName = 'TextArea';
