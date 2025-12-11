'use client';

interface ProfileField {
    name: string;
    value: string;
    verified_at?: string | null;
}

interface ProfileFieldsProps {
    fields: ProfileField[];
}

/**
 * Presentation component for profile custom metadata fields.
 */
export function ProfileFields({ fields }: ProfileFieldsProps) {
    if (fields.length === 0) return null;

    return (
        <div style={{ marginBottom: 'var(--size-3)' }}>
            {fields.map((field, index) => (
                <div
                    key={index}
                    style={{
                        display: 'grid',
                        gridTemplateColumns: '120px 1fr',
                        gap: 'var(--size-2)',
                        padding: 'var(--size-2) 0',
                        borderBottom: index < fields.length - 1 ? '1px solid var(--surface-3)' : 'none',
                        fontSize: 'var(--font-size-1)',
                    }}
                >
                    <div style={{ fontWeight: 'var(--font-weight-6)', color: 'var(--text-2)' }}>
                        {field.name}
                    </div>
                    <div
                        dangerouslySetInnerHTML={{ __html: field.value }}
                        style={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                        }}
                    />
                </div>
            ))}
        </div>
    );
}
