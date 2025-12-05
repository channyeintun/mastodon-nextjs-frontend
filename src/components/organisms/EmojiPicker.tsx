'use client';

import { useState } from 'react';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { useCustomEmojis } from '@/api/queries';

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
  onClose: () => void;
}

export function EmojiPicker({ onEmojiSelect, onClose }: EmojiPickerProps) {
  const [activeTab, setActiveTab] = useState<'standard' | 'custom'>('standard');
  const [searchQuery, setSearchQuery] = useState('');
  const { data: customEmojis, isLoading } = useCustomEmojis();

  const handleEmojiSelect = (emoji: any) => {
    // emoji-mart returns emoji object with native property
    onEmojiSelect(emoji.native);
    onClose();
  };

  const handleCustomEmojiClick = (shortcode: string) => {
    onEmojiSelect(`:${shortcode}:`);
    onClose();
  };

  // Filter custom emojis by search
  const filteredCustomEmojis = customEmojis?.filter((emoji) =>
    emoji.shortcode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Backdrop */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 40,
        }}
        onClick={onClose}
      />

      {/* Picker */}
      <div
        style={{
          position: 'absolute',
          bottom: '100%',
          left: 0,
          marginBottom: 'var(--size-2)',
          zIndex: 50,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{
          background: 'var(--surface-2)',
          borderRadius: 'var(--radius-3)',
          boxShadow: 'var(--shadow-4)',
          overflow: 'hidden',
        }}>
          {/* Tabs */}
          <div style={{
            display: 'flex',
            borderBottom: '1px solid var(--surface-3)',
            background: 'var(--surface-2)',
          }}>
            <button
              onClick={() => setActiveTab('standard')}
              style={{
                flex: 1,
                padding: 'var(--size-2)',
                border: 'none',
                background: activeTab === 'standard' ? 'var(--surface-3)' : 'transparent',
                color: 'var(--text-1)',
                cursor: 'pointer',
                fontSize: 'var(--font-size-1)',
                fontWeight: 'var(--font-weight-6)',
              }}
            >
              😀 Standard
            </button>
            <button
              onClick={() => setActiveTab('custom')}
              style={{
                flex: 1,
                padding: 'var(--size-2)',
                border: 'none',
                background: activeTab === 'custom' ? 'var(--surface-3)' : 'transparent',
                color: 'var(--text-1)',
                cursor: 'pointer',
                fontSize: 'var(--font-size-1)',
                fontWeight: 'var(--font-weight-6)',
              }}
            >
              ✨ Custom ({customEmojis?.length || 0})
            </button>
          </div>

          {/* Content */}
          {activeTab === 'standard' ? (
            <Picker
              data={data}
              onEmojiSelect={handleEmojiSelect}
              theme="auto"
              previewPosition="none"
              skinTonePosition="search"
              maxFrequentRows={2}
            />
          ) : (
            <>
              {/* Search for custom emojis */}
              <div style={{ padding: 'var(--size-2)', borderBottom: '1px solid var(--surface-3)', background: 'var(--surface-2)' }}>
                <input
                  type="text"
                  placeholder="Search custom emojis..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: 'var(--size-2)',
                    border: '1px solid var(--surface-4)',
                    borderRadius: 'var(--radius-2)',
                    background: 'var(--surface-1)',
                    color: 'var(--text-1)',
                    fontSize: 'var(--font-size-1)',
                  }}
                />
              </div>

              {/* Custom emojis grid */}
              <div style={{
                maxHeight: '400px',
                overflowY: 'auto',
                padding: 'var(--size-3)',
                background: 'var(--surface-2)',
                minWidth: '352px',
              }}>
                {isLoading ? (
                  <div style={{ textAlign: 'center', padding: 'var(--size-4)', color: 'var(--text-2)' }}>
                    Loading custom emojis...
                  </div>
                ) : filteredCustomEmojis && filteredCustomEmojis.length > 0 ? (
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(8, 1fr)',
                    gap: 'var(--size-1)',
                  }}>
                    {filteredCustomEmojis.map((emoji) => (
                      <button
                        key={emoji.shortcode}
                        onClick={() => handleCustomEmojiClick(emoji.shortcode)}
                        title={`:${emoji.shortcode}:`}
                        style={{
                          padding: 'var(--size-2)',
                          border: 'none',
                          background: 'transparent',
                          cursor: 'pointer',
                          borderRadius: 'var(--radius-2)',
                          transition: 'background 0.2s',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'var(--surface-3)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent';
                        }}
                      >
                        <img
                          src={emoji.url}
                          alt={`:${emoji.shortcode}:`}
                          style={{
                            width: '28px',
                            height: '28px',
                            objectFit: 'contain',
                          }}
                        />
                      </button>
                    ))}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: 'var(--size-4)', color: 'var(--text-2)' }}>
                    {searchQuery ? 'No emojis found' : 'No custom emojis available'}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
