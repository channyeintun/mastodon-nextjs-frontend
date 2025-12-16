'use client';

import styled from '@emotion/styled';
import Link from 'next/link';
import { ArrowLeft, Info, X, Check } from 'lucide-react';
import { observer } from 'mobx-react-lite';
import { useSuggestions, useDeleteSuggestion, useRelationships, useFollowAccount, useUnfollowAccount } from '@/api';
import { Avatar, Button, EmojiText, EmptyState } from '@/components/atoms';
import { AccountCardSkeleton } from '@/components/molecules';
import { useAuthStore } from '@/hooks/useStores';
import type { Field } from '@/types';

// Get localized source label based on suggestion source
const getSourceLabel = (sources: string[]): { label: string; hint: string } | null => {
    const source = sources[0];
    switch (source) {
        case 'friends_of_friends':
        case 'similar_to_recently_followed':
            return {
                label: 'Personalized suggestion',
                hint: 'Based on accounts you follow'
            };
        case 'featured':
            return {
                label: 'Staff pick',
                hint: 'Hand-picked by the team'
            };
        case 'most_followed':
        case 'most_interactions':
            return {
                label: 'Popular suggestion',
                hint: 'Popular on this instance'
            };
        default:
            return null;
    }
};

// Get first verified field from account fields
const getVerifiedField = (fields?: Field[]): Field | null => {
    if (!fields) return null;
    return fields.find(field => field.verified_at !== null) ?? null;
};

// Extract display URL from HTML value
const extractLinkText = (html: string): string => {
    const text = html.replace(/<[^>]*>/g, '').replace(/&amp;/g, '&');
    return text.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
};

const SuggestionsPage = observer(() => {
    const authStore = useAuthStore();
    const { data: suggestions, isLoading, isError } = useSuggestions({ limit: 40 });
    const deleteSuggestion = useDeleteSuggestion();
    const followMutation = useFollowAccount();
    const unfollowMutation = useUnfollowAccount();

    // Get relationships for all suggested accounts
    const accountIds = suggestions?.map(s => s.account.id) ?? [];
    const { data: relationships } = useRelationships(accountIds);

    // Build a map of accountId -> relationship for quick lookup
    const relationshipMap = new Map(relationships?.map(r => [r.id, r]));

    if (!authStore.isAuthenticated) {
        return (
            <Container>
                <Header>
                    <BackLink href="/explore">
                        <ArrowLeft size={20} />
                    </BackLink>
                    <Title>Suggestions</Title>
                </Header>
                <EmptyState title="Sign in to see suggestions" />
            </Container>
        );
    }

    return (
        <Container>
            <Header>
                <BackLink href="/explore">
                    <ArrowLeft size={20} />
                </BackLink>
                <Title>Suggestions</Title>
            </Header>

            <Content>
                {isLoading ? (
                    <SuggestionsList>
                        {Array.from({ length: 8 }).map((_, i) => (
                            <AccountCardSkeleton key={i} />
                        ))}
                    </SuggestionsList>
                ) : isError ? (
                    <EmptyState title="Failed to load suggestions" />
                ) : !suggestions || suggestions.length === 0 ? (
                    <EmptyState title="No suggestions available" />
                ) : (
                    <SuggestionsList>
                        {suggestions.map((suggestion) => {
                            const relationship = relationshipMap.get(suggestion.account.id);
                            const isFollowing = relationship?.following || relationship?.requested;
                            const isLoading = followMutation.isPending || unfollowMutation.isPending;
                            const sourceInfo = getSourceLabel(suggestion.sources);

                            return (
                                <SuggestionCard key={suggestion.account.id}>
                                    <DismissButton
                                        onClick={() => deleteSuggestion.mutate(suggestion.account.id)}
                                        title="Don't show again"
                                        disabled={deleteSuggestion.isPending}
                                    >
                                        <X size={16} />
                                    </DismissButton>

                                    <CardContent href={`/@${suggestion.account.acct}`}>
                                        <Avatar
                                            src={suggestion.account.avatar}
                                            alt={suggestion.account.display_name || suggestion.account.username}
                                            size="large"
                                        />
                                        <AccountInfo>
                                            <AccountName>
                                                <EmojiText
                                                    text={suggestion.account.display_name || suggestion.account.username}
                                                    emojis={suggestion.account.emojis}
                                                />
                                            </AccountName>
                                            <AccountHandle>@{suggestion.account.acct}</AccountHandle>
                                            {(() => {
                                                const verifiedField = getVerifiedField(suggestion.account.fields);
                                                return verifiedField ? (
                                                    <VerifiedBadge title={`Verified ${verifiedField.name}`}>
                                                        <Check size={12} />
                                                        {extractLinkText(verifiedField.value)}
                                                    </VerifiedBadge>
                                                ) : sourceInfo ? (
                                                    <SourceLabel title={sourceInfo.hint}>
                                                        <Info size={12} />
                                                        {sourceInfo.label}
                                                    </SourceLabel>
                                                ) : null;
                                            })()}
                                        </AccountInfo>
                                    </CardContent>

                                    <Actions>
                                        <Button
                                            variant={isFollowing ? 'secondary' : 'primary'}
                                            size="small"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                if (isFollowing) {
                                                    unfollowMutation.mutate(suggestion.account.id);
                                                } else {
                                                    followMutation.mutate(suggestion.account.id);
                                                }
                                            }}
                                            disabled={isLoading}
                                            isLoading={isLoading}
                                        >
                                            {relationship?.requested ? 'Requested' : isFollowing ? 'Following' : 'Follow'}
                                        </Button>
                                    </Actions>
                                </SuggestionCard>
                            );
                        })}
                    </SuggestionsList>
                )}
            </Content>
        </Container>
    );
});

export default SuggestionsPage;

// Styled components
const Container = styled.div`
    max-width: 600px;
    margin: 0 auto;
`;

const Header = styled.header`
    display: flex;
    align-items: center;
    gap: var(--size-3);
    padding: var(--size-4);
    border-bottom: 1px solid var(--surface-3);
    position: sticky;
    top: 0;
    background: var(--surface-1);
    z-index: 10;
`;

const BackLink = styled(Link)`
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-1);
    padding: var(--size-2);
    margin: calc(-1 * var(--size-2));
    border-radius: var(--radius-round);
    transition: background 0.2s;

    &:hover {
        background: var(--surface-2);
    }
`;

const Title = styled.h1`
    font-size: var(--font-size-4);
    font-weight: 600;
    margin: 0;
`;

const Content = styled.div`
    padding: var(--size-4);
`;

const SuggestionsList = styled.div`
    display: flex;
    flex-direction: column;
    gap: var(--size-3);
`;

const SuggestionCard = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    gap: var(--size-3);
    padding: var(--size-3);
    background: var(--surface-2);
    border-radius: var(--radius-3);
`;

const CardContent = styled(Link)`
    display: flex;
    align-items: center;
    gap: var(--size-3);
    flex: 1;
    text-decoration: none;
    color: inherit;
    min-width: 0;
`;

const AccountInfo = styled.div`
    flex: 1;
    min-width: 0;
`;

const AccountName = styled.div`
    font-weight: 600;
    font-size: var(--font-size-2);
    color: var(--text-1);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

const AccountHandle = styled.div`
    font-size: var(--font-size-1);
    color: var(--text-3);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

const SourceLabel = styled.div`
    display: flex;
    align-items: center;
    gap: var(--size-1);
    font-size: var(--font-size-0);
    color: var(--blue-6);
    margin-top: var(--size-1);
    cursor: help;

    svg {
        flex-shrink: 0;
    }
`;

const VerifiedBadge = styled.div`
    display: flex;
    align-items: center;
    gap: var(--size-1);
    font-size: var(--font-size-0);
    color: var(--green-6);
    margin-top: var(--size-1);
    cursor: help;

    svg {
        flex-shrink: 0;
    }
`;

const Actions = styled.div`
    flex-shrink: 0;
`;

const DismissButton = styled.button`
    position: absolute;
    top: var(--size-2);
    right: var(--size-2);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--size-1);
    border: none;
    background: transparent;
    color: var(--text-3);
    cursor: pointer;
    border-radius: var(--radius-2);
    transition: background 0.2s, color 0.2s;

    &:hover {
        background: var(--surface-3);
        color: var(--text-1);
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
`;
