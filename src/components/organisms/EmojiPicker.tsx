'use client';

import { useState, useEffect, useRef } from 'react';
import { animate } from 'motion';
import { Search, Smile } from 'lucide-react';
import { useCustomEmojis } from '@/api/queries';
import { Card } from '../atoms/Card';
import { Input } from '../atoms/Input';

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
  onClose: () => void;
}

// Common emoji categories
const STANDARD_EMOJIS = {
  'Smileys & People': ['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '😚', '😙', '🥲', '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔', '🤐', '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥', '😌', '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕', '🤢', '🤮', '🤧', '🥵', '🥶', '😵', '🤯', '🤠', '🥳', '😎', '🤓', '🧐'],
  'Animals & Nature': ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐽', '🐸', '🐵', '🙈', '🙉', '🙊', '🐒', '🐔', '🐧', '🐦', '🐤', '🐣', '🐥', '🦆', '🦅', '🦉', '🦇', '🐺', '🐗', '🐴', '🦄', '🐝', '🐛', '🦋', '🐌', '🐞', '🐜', '🦟', '🦗', '🕷', '🕸', '🦂', '🐢', '🐍', '🦎', '🦖', '🦕'],
  'Food & Drink': ['🍇', '🍈', '🍉', '🍊', '🍋', '🍌', '🍍', '🥭', '🍎', '🍏', '🍐', '🍑', '🍒', '🍓', '🥝', '🍅', '🥥', '🥑', '🍆', '🥔', '🥕', '🌽', '🌶', '🥒', '🥬', '🥦', '🧄', '🧅', '🍄', '🥜', '🌰', '🍞', '🥐', '🥖', '🥨', '🥯', '🥞', '🧇', '🧀', '🍖', '🍗', '🥩', '🥓', '🍔', '🍟', '🍕', '🌭', '🥪', '🌮', '🌯'],
  'Activity & Sports': ['⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🥏', '🎱', '🪀', '🏓', '🏸', '🏒', '🏑', '🥍', '🏏', '🥅', '⛳', '🪁', '🏹', '🎣', '🤿', '🥊', '🥋', '🎽', '🛹', '🛷', '⛸', '🥌', '🎿', '⛷', '🏂', '🪂', '🏋', '🤼', '🤸', '🤺', '⛹', '🤾', '🏌', '🏇', '🧘', '🏊', '🤽', '🚣', '🧗', '🚴', '🚵'],
  'Travel & Places': ['🚗', '🚕', '🚙', '🚌', '🚎', '🏎', '🚓', '🚑', '🚒', '🚐', '🚚', '🚛', '🚜', '🛴', '🚲', '🛵', '🏍', '🛺', '🚨', '🚔', '🚍', '🚘', '🚖', '🚡', '🚠', '🚟', '🚃', '🚋', '🚞', '🚝', '🚄', '🚅', '🚈', '🚂', '🚆', '🚇', '🚊', '🚉', '✈', '🛫', '🛬', '🛩', '💺', '🛰', '🚀', '🛸', '🚁', '🛶', '⛵'],
  'Objects': ['⌚', '📱', '📲', '💻', '⌨', '🖥', '🖨', '🖱', '🖲', '🕹', '🗜', '💽', '💾', '💿', '📀', '📼', '📷', '📸', '📹', '🎥', '📽', '🎞', '📞', '☎', '📟', '📠', '📺', '📻', '🎙', '🎚', '🎛', '🧭', '⏱', '⏲', '⏰', '🕰', '⌛', '⏳', '📡', '🔋', '🔌', '💡', '🔦', '🕯', '🪔', '🧯', '🛢', '💸', '💵', '💴'],
  'Symbols': ['❤', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '☮', '✝', '☪', '🕉', '☸', '✡', '🔯', '🕎', '☯', '☦', '🛐', '⛎', '♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓', '🆔', '⚛', '🉑', '☢', '☣', '📴', '📳'],
};

export function EmojiPicker({ onEmojiSelect, onClose }: EmojiPickerProps) {
  const [activeTab, setActiveTab] = useState<'standard' | 'custom'>('standard');
  const [searchQuery, setSearchQuery] = useState('');
  const { data: customEmojis, isLoading } = useCustomEmojis();
  const pickerRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  // Animate entrance
  useEffect(() => {
    if (pickerRef.current && backdropRef.current) {
      animate(backdropRef.current, { opacity: [0, 1] }, { duration: 0.15 });
      animate(
        pickerRef.current,
        { opacity: [0, 1], scale: [0.95, 1], y: [10, 0] },
        { duration: 0.2, easing: [0.22, 1, 0.36, 1] }
      );
    }
  }, []);

  const handleEmojiClick = (emoji: string) => {
    onEmojiSelect(emoji);
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
        ref={backdropRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 40,
          opacity: 0,
        }}
        onClick={onClose}
      />

      {/* Picker */}
      <div
        ref={pickerRef}
        style={{
          position: 'absolute',
          bottom: '100%',
          left: 0,
          marginBottom: 'var(--size-2)',
          zIndex: 50,
          width: '350px',
          maxHeight: '400px',
          opacity: 0,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <Card padding="none">
          {/* Tabs */}
          <div style={{
            display: 'flex',
            borderBottom: '1px solid var(--surface-3)',
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
              <Smile size={16} style={{ verticalAlign: 'middle', marginRight: 'var(--size-1)' }} />
              Standard
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
              Custom ({customEmojis?.length || 0})
            </button>
          </div>

          {/* Search for custom emojis */}
          {activeTab === 'custom' && (
            <div style={{ padding: 'var(--size-2)', borderBottom: '1px solid var(--surface-3)' }}>
              <div style={{ position: 'relative' }}>
                <Search
                  size={16}
                  style={{
                    position: 'absolute',
                    left: 'var(--size-2)',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-3)',
                  }}
                />
                <Input
                  type="text"
                  placeholder="Search emojis..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    paddingLeft: 'var(--size-6)',
                    fontSize: 'var(--font-size-1)',
                  }}
                />
              </div>
            </div>
          )}

          {/* Emoji Grid */}
          <div style={{
            maxHeight: '300px',
            overflowY: 'auto',
            padding: 'var(--size-2)',
          }}>
            {activeTab === 'standard' ? (
              <div>
                {Object.entries(STANDARD_EMOJIS).map(([category, emojis]) => (
                  <div key={category} style={{ marginBottom: 'var(--size-3)' }}>
                    <div style={{
                      fontSize: 'var(--font-size-0)',
                      fontWeight: 'var(--font-weight-6)',
                      color: 'var(--text-2)',
                      marginBottom: 'var(--size-2)',
                    }}>
                      {category}
                    </div>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(8, 1fr)',
                      gap: 'var(--size-1)',
                    }}>
                      {emojis.map((emoji, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleEmojiClick(emoji)}
                          style={{
                            padding: 'var(--size-2)',
                            border: 'none',
                            background: 'transparent',
                            cursor: 'pointer',
                            fontSize: 'var(--font-size-4)',
                            borderRadius: 'var(--radius-2)',
                            transition: 'background 0.2s',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'var(--surface-3)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'transparent';
                          }}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div>
                {isLoading ? (
                  <div style={{ textAlign: 'center', padding: 'var(--size-4)', color: 'var(--text-2)' }}>
                    Loading custom emojis...
                  </div>
                ) : filteredCustomEmojis && filteredCustomEmojis.length > 0 ? (
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(6, 1fr)',
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
                            width: '24px',
                            height: '24px',
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
            )}
          </div>
        </Card>
      </div>
    </>
  );
}
