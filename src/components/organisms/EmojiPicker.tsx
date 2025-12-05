'use client';

import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { useCustomEmojis } from '@/api/queries';
import type { Emoji } from '@/types/mastodon';

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
  onClose: () => void;
}

interface EmojiMartEmoji {
  id: string;
  name: string;
  keywords: string[];
  skins: { src: string }[];
}

interface EmojiMartCategory {
  id: string;
  name: string;
  emojis: EmojiMartEmoji[];
}

type CustomEmojis = EmojiMartCategory[];

const convertToEmojiMartCustomWithCategories = (
  mastodonEmojis: Emoji[]
): CustomEmojis => {
  if (!Array.isArray(mastodonEmojis)) {
    return [];
  }

  const categoryMap: { [key: string]: EmojiMartEmoji[] } = {};

  mastodonEmojis
    .filter((emoji) => emoji.visible_in_picker && emoji.url)
    .forEach((emoji) => {
      const category = 'Custom';
      if (!categoryMap[category]) {
        categoryMap[category] = [];
      }
      categoryMap[category].push({
        id: emoji.shortcode,
        name: emoji.shortcode,
        keywords: [emoji.shortcode],
        skins: [{ src: emoji.url }],
      });
    });

  return Object.entries(categoryMap).map(([id, emojis]) => ({
    id,
    name: id,
    emojis,
  }));
};

export function EmojiPicker({ onEmojiSelect, onClose }: EmojiPickerProps) {
  const { data: customEmojis } = useCustomEmojis();

  const handleEmojiSelect = (emoji: any) => {
    // Handle standard emoji (has native property)
    if (emoji.native) {
      onEmojiSelect(emoji.native);
    } else {
      // Handle custom emoji (has id which is the shortcode)
      onEmojiSelect(`:${emoji.id}:`);
    }
    onClose();
  };

  const customEmojiCategories: CustomEmojis = customEmojis
    ? convertToEmojiMartCustomWithCategories(customEmojis)
    : [];

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
        <Picker
          data={data}
          custom={customEmojiCategories}
          onEmojiSelect={handleEmojiSelect}
          theme="auto"
          previewPosition="none"
          skinTonePosition="search"
          maxFrequentRows={2}
        />
      </div>
    </>
  );
}
