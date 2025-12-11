interface ContentWarningSectionProps {
  spoilerText: string;
  isExpanded: boolean;
  onToggle: () => void;
}

export function ContentWarningSection({
  spoilerText,
  isExpanded,
  onToggle,
}: ContentWarningSectionProps) {
  return (
    <div
      style={{
        marginTop: 'var(--size-2)',
        padding: 'var(--size-3)',
        background: 'var(--orange-2)',
        borderRadius: 'var(--radius-2)',
      }}
    >
      <div
        style={{
          fontSize: 'var(--font-size-1)',
          fontWeight: 'var(--font-weight-6)',
          color: 'var(--text-1)',
          marginBottom: 'var(--size-2)',
        }}
      >
        Content Warning: {spoilerText}
      </div>
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onToggle();
        }}
        style={{
          padding: 'var(--size-2) var(--size-3)',
          background: 'var(--orange-6)',
          color: 'white',
          border: 'none',
          borderRadius: 'var(--radius-2)',
          cursor: 'pointer',
          fontSize: 'var(--font-size-1)',
          fontWeight: 'var(--font-weight-6)',
        }}
      >
        {isExpanded ? 'Hide content' : 'Show content'}
      </button>
    </div>
  );
}
