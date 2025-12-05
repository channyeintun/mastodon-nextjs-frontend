'use client';

import { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { Button } from '../atoms/Button';
import { IconButton } from '../atoms/IconButton';

export interface PollData {
  options: string[];
  expiresIn: number; // seconds
  multiple: boolean;
}

interface PollComposerProps {
  poll: PollData | null;
  onPollChange: (poll: PollData | null) => void;
}

const EXPIRY_OPTIONS = [
  { label: '5 minutes', value: 300 },
  { label: '30 minutes', value: 1800 },
  { label: '1 hour', value: 3600 },
  { label: '6 hours', value: 21600 },
  { label: '1 day', value: 86400 },
  { label: '3 days', value: 259200 },
  { label: '7 days', value: 604800 },
];

export function PollComposer({ poll, onPollChange }: PollComposerProps) {
  const [options, setOptions] = useState<string[]>(poll?.options || ['', '']);
  const [expiresIn, setExpiresIn] = useState<number>(poll?.expiresIn || 86400);
  const [multiple, setMultiple] = useState<boolean>(poll?.multiple || false);

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
    updatePoll(newOptions, expiresIn, multiple);
  };

  const handleAddOption = () => {
    if (options.length < 4) {
      const newOptions = [...options, ''];
      setOptions(newOptions);
      updatePoll(newOptions, expiresIn, multiple);
    }
  };

  const handleRemoveOption = (index: number) => {
    if (options.length > 2) {
      const newOptions = options.filter((_, i) => i !== index);
      setOptions(newOptions);
      updatePoll(newOptions, expiresIn, multiple);
    }
  };

  const handleExpiryChange = (value: number) => {
    setExpiresIn(value);
    updatePoll(options, value, multiple);
  };

  const handleMultipleChange = (value: boolean) => {
    setMultiple(value);
    updatePoll(options, expiresIn, value);
  };

  const updatePoll = (opts: string[], exp: number, mult: boolean) => {
    onPollChange({
      options: opts,
      expiresIn: exp,
      multiple: mult,
    });
  };

  const handleRemovePoll = () => {
    onPollChange(null);
  };

  if (!poll) {
    return (
      <Button
        type="button"
        variant="ghost"
        size="small"
        onClick={() => onPollChange({ options: ['', ''], expiresIn: 86400, multiple: false })}
        title="Add poll"
      >
        <Plus size={18} />
        Add Poll
      </Button>
    );
  }

  return (
    <div style={{
      padding: 'var(--size-3)',
      background: 'var(--surface-2)',
      borderRadius: 'var(--radius-2)',
      marginBottom: 'var(--size-3)',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 'var(--size-3)',
      }}>
        <h3 style={{
          fontSize: 'var(--font-size-2)',
          fontWeight: 'var(--font-weight-6)',
          color: 'var(--text-1)',
          margin: 0,
        }}>
          Poll
        </h3>
        <IconButton size="small" onClick={handleRemovePoll} title="Remove poll">
          <X size={16} />
        </IconButton>
      </div>

      {/* Options */}
      <div style={{ marginBottom: 'var(--size-3)' }}>
        {options.map((option, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              gap: 'var(--size-2)',
              marginBottom: 'var(--size-2)',
            }}
          >
            <input
              type="text"
              value={option}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              placeholder={`Option ${index + 1}`}
              maxLength={50}
              style={{
                flex: 1,
                padding: 'var(--size-2)',
                border: '1px solid var(--surface-4)',
                borderRadius: 'var(--radius-2)',
                background: 'var(--surface-1)',
                color: 'var(--text-1)',
                fontSize: 'var(--font-size-1)',
              }}
            />
            {options.length > 2 && (
              <IconButton
                size="small"
                onClick={() => handleRemoveOption(index)}
                title="Remove option"
              >
                <X size={16} />
              </IconButton>
            )}
          </div>
        ))}

        {options.length < 4 && (
          <Button
            type="button"
            variant="ghost"
            size="small"
            onClick={handleAddOption}
          >
            <Plus size={14} />
            Add Option
          </Button>
        )}
      </div>

      {/* Settings */}
      <div style={{
        display: 'flex',
        gap: 'var(--size-3)',
        flexWrap: 'wrap',
        alignItems: 'center',
      }}>
        {/* Expiry */}
        <div style={{ flex: 1, minWidth: '150px' }}>
          <label style={{
            display: 'block',
            fontSize: 'var(--font-size-0)',
            fontWeight: 'var(--font-weight-6)',
            marginBottom: 'var(--size-1)',
            color: 'var(--text-1)',
          }}>
            Poll duration
          </label>
          <select
            value={expiresIn}
            onChange={(e) => handleExpiryChange(Number(e.target.value))}
            style={{
              width: '100%',
              padding: 'var(--size-2)',
              border: '1px solid var(--surface-4)',
              borderRadius: 'var(--radius-2)',
              background: 'var(--surface-1)',
              color: 'var(--text-1)',
              fontSize: 'var(--font-size-1)',
              cursor: 'pointer',
            }}
          >
            {EXPIRY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Multiple choice */}
        <div>
          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--size-2)',
            cursor: 'pointer',
            fontSize: 'var(--font-size-1)',
          }}>
            <input
              type="checkbox"
              checked={multiple}
              onChange={(e) => handleMultipleChange(e.target.checked)}
              style={{
                width: '18px',
                height: '18px',
                cursor: 'pointer',
              }}
            />
            <span style={{ color: 'var(--text-1)', fontWeight: 'var(--font-weight-5)' }}>
              Multiple choice
            </span>
          </label>
        </div>
      </div>
    </div>
  );
}
