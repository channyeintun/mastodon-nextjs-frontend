import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { Decoration, DecorationSet } from '@tiptap/pm/view';
import type { Emoji } from '@/types/mastodon';

export interface CustomEmojiOptions {
  emojis: Emoji[];
}

export const CustomEmoji = Extension.create<CustomEmojiOptions>({
  name: 'customEmoji',

  addOptions() {
    return {
      emojis: [],
    };
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('customEmoji'),
        props: {
          decorations: (state) => {
            // Only render in read-only mode
            if (this.editor.isEditable) {
              return DecorationSet.empty;
            }

            const { doc } = state;
            const decorations: Decoration[] = [];

            // Pattern to match :emoji: syntax
            const emojiPattern = /:([a-zA-Z0-9_]+):/g;

            // Process all text nodes
            doc.descendants((node, pos) => {
              if (node.isText) {
                const text = node.text || '';
                let match;

                while ((match = emojiPattern.exec(text)) !== null) {
                  const [fullMatch, shortcode] = match;
                  const from = pos + match.index;
                  const to = from + fullMatch.length;

                  // Find matching custom emoji - read from this.options dynamically
                  const emoji = this.options.emojis.find((e: Emoji) => e.shortcode === shortcode);

                  if (emoji) {
                    // Create widget to show image
                    const decoration = Decoration.widget(from, () => {
                      const img = document.createElement('img');
                      img.src = emoji.url;
                      img.alt = `:${shortcode}:`;
                      img.title = `:${shortcode}:`;
                      img.className = 'custom-emoji';
                      img.style.width = '1.2em';
                      img.style.height = '1.2em';
                      img.style.verticalAlign = 'middle';
                      img.style.objectFit = 'contain';
                      img.style.display = 'inline-block';
                      return img;
                    }, { side: -1 });

                    // Hide original text
                    const hideDecoration = Decoration.inline(from, to, {
                      style: 'display: none',
                    });

                    decorations.push(decoration, hideDecoration);
                  }
                }
              }

              return true;
            });

            return DecorationSet.create(doc, decorations);
          },
        },
      }),
    ];
  },
});
