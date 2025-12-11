interface CheckboxFieldProps {
  id: string;
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export function CheckboxField({
  id,
  label,
  description,
  checked,
  onChange,
  disabled = false,
}: CheckboxFieldProps) {
  return (
    <div
      style={{
        display: 'flex',
        gap: 'var(--size-3)',
        alignItems: 'flex-start',
      }}
    >
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        style={{
          marginTop: '4px',
          cursor: disabled ? 'not-allowed' : 'pointer',
        }}
      />
      <div style={{ flex: 1 }}>
        <label
          htmlFor={id}
          style={{
            fontSize: 'var(--font-size-1)',
            fontWeight: 500,
            color: 'var(--text-1)',
            cursor: disabled ? 'not-allowed' : 'pointer',
            display: 'block',
          }}
        >
          {label}
        </label>
        {description && (
          <p
            style={{
              fontSize: 'var(--font-size-0)',
              color: 'var(--text-2)',
              margin: '4px 0 0 0',
            }}
          >
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
