'use client';

import { useEffect, useRef } from 'react';
import styled from '@emotion/styled';
import data from '@emoji-mart/data';
import { Picker } from 'emoji-mart';
import { useCustomEmojis } from '@/api';
import type { Emoji } from '@/types';

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
  onClose: () => void;
}

interface EmojiMartCustomEmoji {
  id: string;
  name: string;
  keywords: string[];
  skins: Array<{ src: string }>;
}

interface EmojiMartCustomCategory {
  id: string;
  name: string;
  emojis: EmojiMartCustomEmoji[];
}

/**
 * Transform Mastodon emojis into emoji-mart format with categories
 */
const formatCustomEmojis = (mastodonEmojis: Emoji[]): EmojiMartCustomCategory[] => {
  if (!Array.isArray(mastodonEmojis)) {
    return [];
  }

  // Group emojis by category
  const categories = new Map<string, Emoji[]>();

  for (const emoji of mastodonEmojis) {
    if (!emoji.visible_in_picker || !emoji.url) continue;
    const category = emoji.category || 'Custom';
    if (!categories.has(category)) {
      categories.set(category, []);
    }
    categories.get(category)!.push(emoji);
  }

  // Transform to emoji-mart format
  return Array.from(categories.entries()).map(([name, emojis]) => ({
    id: name.toLowerCase().replace(/\s+/g, '-'),
    name,
    emojis: emojis.map((e) => ({
      id: e.shortcode,
      name: e.shortcode,
      keywords: [e.shortcode],
      skins: [{ src: e.url }],
    })),
  }));
};

export function EmojiPicker({ onEmojiSelect, onClose }: EmojiPickerProps) {
  const pickerRef = useRef<HTMLDivElement>(null);
  const callbackRef = useRef({ onEmojiSelect, onClose });
  const { data: customEmojis } = useCustomEmojis();

  // Keep callback ref updated
  callbackRef.current = { onEmojiSelect, onClose };

  useEffect(() => {
    const container = pickerRef.current;
    if (!container) return;

    // Clear any existing content first
    container.innerHTML = '';

    const customCategories = customEmojis
      ? formatCustomEmojis(customEmojis)
      : [];

    // Create the picker instance with stable callback
    const picker = new Picker({
      data,
      onEmojiSelect: (emojiData: any) => {
        // Custom emojis from emoji-mart have a 'src' property in their skin
        if (emojiData.src) {
          // It's a custom emoji - insert as :shortcode:
          callbackRef.current.onEmojiSelect(`:${emojiData.id}:`);
        } else {
          // It's a native unicode emoji
          callbackRef.current.onEmojiSelect(emojiData.native);
        }
        callbackRef.current.onClose();
      },
      theme: 'auto',
      skinTonePosition: 'none',
      previewPosition: 'none',
      custom: customCategories,
      dynamicWidth: true,
    });

    container.appendChild(picker as unknown as Node);

    return () => {
      container.innerHTML = '';
    };
  }, [customEmojis]);

  return (
    <>
      <Backdrop onClick={onClose} />
      <PickerContainer
        className="emoji-picker"
        onClick={(e) => e.stopPropagation()}
      >
        <div ref={pickerRef} />
      </PickerContainer>
    </>
  );
}

// Styled components
const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 40;
`;

const PickerContainer = styled.div`
  z-index: 50;
`;