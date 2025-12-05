import { useState, useEffect, RefObject } from 'react';
import { useSearch } from '@/api/queries';
import type { Account } from '@/types/mastodon';

interface UseMentionAutocompleteProps {
  content: string;
  textareaRef: RefObject<HTMLTextAreaElement>;
  onSelect: (account: Account, mentionStart: number, cursorPos: number) => void;
}

export function useMentionAutocomplete({
  content,
  textareaRef,
  onSelect,
}: UseMentionAutocompleteProps) {
  const [mentionQuery, setMentionQuery] = useState('');
  const [mentionStart, setMentionStart] = useState<number | null>(null);
  const [mentionPosition, setMentionPosition] = useState<{ top: number; left: number } | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Search for mentions
  const { data: searchResults, isLoading } = useSearch({
    q: mentionQuery,
    type: 'accounts',
  });

  const suggestions = searchResults?.accounts || [];

  // Detect @ mentions
  useEffect(() => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const cursorPos = textarea.selectionStart;
    const textBeforeCursor = content.substring(0, cursorPos);

    // Find the last @ before cursor
    const lastAtIndex = textBeforeCursor.lastIndexOf('@');

    if (lastAtIndex >= 0) {
      const textAfterAt = textBeforeCursor.substring(lastAtIndex + 1);

      // Check if there's a space after @ (if yes, stop suggestions)
      if (textAfterAt.includes(' ') || textAfterAt.includes('\n')) {
        setMentionQuery('');
        setMentionStart(null);
        setMentionPosition(null);
        return;
      }

      // Set query if text after @ is valid
      if (textAfterAt.length >= 0) {
        setMentionQuery(textAfterAt);
        setMentionStart(lastAtIndex);
        setSelectedIndex(0);

        // Calculate position for dropdown
        const lines = textBeforeCursor.split('\n');
        const currentLineIndex = lines.length - 1;
        const currentLineText = lines[currentLineIndex];
        const lineHeight = 24;
        const charWidth = 8;

        const top = (currentLineIndex + 1) * lineHeight + 80;
        const left = Math.min(currentLineText.length * charWidth, 400);

        setMentionPosition({ top, left });
      }
    } else {
      setMentionQuery('');
      setMentionStart(null);
      setMentionPosition(null);
    }
  }, [content, textareaRef.current?.selectionStart]);

  const handleSelect = (account: Account) => {
    if (mentionStart === null || !textareaRef.current) return;
    onSelect(account, mentionStart, textareaRef.current.selectionStart);
    setMentionQuery('');
    setMentionStart(null);
    setMentionPosition(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (mentionPosition && suggestions.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
      } else if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSelect(suggestions[selectedIndex]);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        setMentionQuery('');
        setMentionStart(null);
        setMentionPosition(null);
      }
    }
  };

  return {
    suggestions,
    isLoading: isLoading && mentionQuery.length > 0,
    mentionPosition,
    selectedIndex,
    handleSelect,
    handleKeyDown,
  };
}
