'use client';

import { X } from 'lucide-react';

interface ContentWarningInputProps {
    value: string;
    onChange: (value: string) => void;
    onRemove: () => void;
}

/**
 * Presentational component for content warning/spoiler input.
 */
export function ContentWarningInput({
    value,
    onChange,
    onRemove,
}: ContentWarningInputProps) {
    return (
        <div style={{ marginBottom: 'var(--size-2)' }}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 'var(--size-2)',
            }}>
                <label
                    htmlFor="cw-input"
                    style={{
                        fontSize: 'var(--font-size-1)',
                        fontWeight: 'var(--font-weight-6)',
                        color: 'var(--text-2)',
                    }}
                >
                    Content Warning
                </label>
                <button
                    aria-label="Remove content warning"
                    onClick={onRemove}
                    style={{
                        padding: 'var(--size-1)',
                        border: 'none',
                        background: 'transparent',
                        cursor: 'pointer',
                        color: 'var(--text-2)',
                    }}
                >
                    <X size={16} />
                </button>
            </div>
            <input
                id="cw-input"
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Write your warning here..."
                style={{
                    width: '100%',
                    padding: 'var(--size-2) var(--size-3)',
                    border: '1px solid var(--surface-3)',
                    borderRadius: 'var(--radius-2)',
                    background: 'var(--surface-1)',
                    color: 'var(--text-1)',
                    fontSize: 'var(--font-size-2)',
                }}
            />
        </div>
    );
}
