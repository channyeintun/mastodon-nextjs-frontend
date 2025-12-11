'use client';

import { X } from 'lucide-react';

interface ScheduleInputProps {
    value: string;
    onChange: (value: string) => void;
    onRemove: () => void;
}

/**
 * Presentational component for scheduling a post.
 */
export function ScheduleInput({
    value,
    onChange,
    onRemove,
}: ScheduleInputProps) {
    return (
        <div>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 'var(--size-2)',
            }}>
                <label
                    htmlFor="schedule-input"
                    style={{
                        fontSize: 'var(--font-size-1)',
                        fontWeight: 'var(--font-weight-6)',
                        color: 'var(--text-2)',
                    }}
                >
                    Schedule Post
                </label>
                <button
                    aria-label="Remove schedule"
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
                id="schedule-input"
                type="datetime-local"
                value={value}
                min={new Date().toISOString().slice(0, 16)}
                onChange={(e) => onChange(e.target.value)}
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
            <div style={{ fontSize: 'var(--font-size-0)', color: 'var(--text-3)', marginTop: '4px' }}>
                Post will be published automatically at this time.
            </div>
        </div>
    );
}
