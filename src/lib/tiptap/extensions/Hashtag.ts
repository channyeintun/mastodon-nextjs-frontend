import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { Decoration, DecorationSet } from '@tiptap/pm/view';

export interface HashtagOptions {
  HTMLAttributes: Record<string, any>;
}

export const Hashtag = Extension.create<HashtagOptions>({
  name: 'hashtag',

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('hashtagHighlight'),
        props: {
          decorations(state) {
            const decorations: Decoration[] = [];
            const doc = state.doc;

            doc.descendants((node, pos) => {
              if (node.isText) {
                const text = node.text || '';
                const regex = /#[a-zA-Z0-9_]+/g;
                let match;

                // Skip if node has a link mark
                const hasLinkMark = node.marks && node.marks.some(mark => mark.type.name === 'link');
                if (hasLinkMark) return;

                while ((match = regex.exec(text)) !== null) {
                  const startIndex = pos + match.index;
                  const endIndex = startIndex + match[0].length;

                  const decoration = Decoration.inline(startIndex, endIndex, {
                    class: 'hashtag',
                    style: 'color: var(--indigo-6); font-weight: var(--font-weight-6); cursor: pointer;',
                    'data-hashtag': match[0].substring(1), // Store hashtag without #
                  });
                  decorations.push(decoration);
                }
              }
            });

            return DecorationSet.create(state.doc, decorations);
          },
        },
      }),
    ];
  },

});
