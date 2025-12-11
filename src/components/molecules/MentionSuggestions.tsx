'use client';

import styled from '@emotion/styled';
import { Avatar } from '../atoms/Avatar';
import { Card } from '../atoms/Card';
import { EmojiText } from '../atoms/EmojiText';
import type { Account } from '@/types/mastodon';

interface MentionSuggestionsProps {
  accounts: Account[];
  isLoading: boolean;
  onSelect: (account: Account) => void;
  position: { top: number; left: number } | null;
  selectedIndex: number;
}

export function MentionSuggestions({
  accounts,
  isLoading,
  onSelect,
  position,
  selectedIndex,
}: MentionSuggestionsProps) {
  const shouldShow = !!position && (isLoading || accounts.length > 0);

  if (!shouldShow) return null;

  return (
    <Container $top={position?.top || 0} $left={position?.left || 0}>
      <Card padding="none">
        <ScrollContainer>
          {isLoading && (
            <LoadingMessage>Searching...</LoadingMessage>
          )}

          {!isLoading && accounts.length > 0 && accounts.map((account, index) => (
            <SuggestionButton
              key={account.id}
              onClick={() => onSelect(account)}
              $isSelected={selectedIndex === index}
            >
              <Avatar
                src={account.avatar}
                alt={account.display_name || account.username}
                size="small"
              />
              <InfoWrapper>
                <DisplayName>
                  <EmojiText
                    text={account.display_name || account.username}
                    emojis={account.emojis}
                  />
                </DisplayName>
                <Handle>@{account.acct}</Handle>
              </InfoWrapper>
            </SuggestionButton>
          ))}

          {!isLoading && accounts.length === 0 && (
            <EmptyMessage>No users found</EmptyMessage>
          )}
        </ScrollContainer>
      </Card>
    </Container>
  );
}

// Styled components
const Container = styled.div<{ $top: number; $left: number }>`
  position: absolute;
  top: ${props => props.$top}px;
  left: ${props => props.$left}px;
  z-index: 100;
  min-width: 300px;
  max-width: 400px;
  animation: fadeInUp 0.2s ease-out;
`;

const ScrollContainer = styled.div`
  max-height: 300px;
  overflow-y: auto;
`;

const LoadingMessage = styled.div`
  padding: var(--size-3);
  text-align: center;
  color: var(--text-2);
  font-size: var(--font-size-1);
`;

const SuggestionButton = styled.button<{ $isSelected: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  gap: var(--size-2);
  padding: var(--size-3);
  border: none;
  background: ${props => props.$isSelected ? 'var(--surface-3)' : 'transparent'};
  cursor: pointer;
  text-align: left;
  transition: background 0.15s;

  &:hover {
    background: var(--surface-3);
  }
`;

const InfoWrapper = styled.div`
  flex: 1;
  min-width: 0;
`;

const DisplayName = styled.div`
  font-weight: var(--font-weight-6);
  color: var(--text-1);
  font-size: var(--font-size-1);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Handle = styled.div`
  font-size: var(--font-size-0);
  color: var(--text-2);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const EmptyMessage = styled.div`
  padding: var(--size-3);
  text-align: center;
  color: var(--text-2);
  font-size: var(--font-size-1);
`;