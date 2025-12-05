import { Mark } from '@tiptap/core';

// Hashtag extension
export const Hashtag = Mark.create({
  name: 'hashtag',

  parseHTML() {
    return [
      {
        tag: 'span[data-type="hashtag"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['span', { ...HTMLAttributes, 'data-type': 'hashtag', style: 'color: var(--blue-6); font-weight: var(--font-weight-6);' }, 0];
  },

  addInputRules() {
    return [];
  },
});

// Mention extension
export const Mention = Mark.create({
  name: 'mention',

  parseHTML() {
    return [
      {
        tag: 'span[data-type="mention"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['span', { ...HTMLAttributes, 'data-type': 'mention', style: 'color: var(--purple-6); font-weight: var(--font-weight-6);' }, 0];
  },

  addInputRules() {
    return [];
  },
});
