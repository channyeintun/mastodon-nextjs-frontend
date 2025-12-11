'use client';

import { Button } from '@/components/atoms';
import type { Poll } from '@/types';

interface PostPollProps {
    poll: Poll;
    selectedChoices: number[];
    isVoting: boolean;
    canVote: boolean;
    onChoiceToggle: (index: number) => void;
    onVote: () => void;
}

/**
 * Presentation component for poll display and voting.
 * Handles both voting interface (when canVote is true) and results display.
 */
export function PostPoll({
    poll,
    selectedChoices,
    isVoting,
    canVote,
    onChoiceToggle,
    onVote,
}: PostPollProps) {
    return (
        <div
            onClick={(e) => e.stopPropagation()}
            style={{
                marginTop: 'var(--size-3)',
                padding: 'var(--size-3)',
                background: 'var(--surface-3)',
                borderRadius: 'var(--radius-2)',
            }}
        >
            {canVote ? (
                <>
                    {/* Voting interface */}
                    {poll.options.map((option, index) => (
                        <label
                            key={index}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 'var(--size-2)',
                                padding: 'var(--size-2)',
                                marginBottom: 'var(--size-2)',
                                background: selectedChoices.includes(index)
                                    ? 'var(--blue-2)'
                                    : 'var(--surface-2)',
                                borderRadius: 'var(--radius-2)',
                                cursor: 'pointer',
                                border: selectedChoices.includes(index)
                                    ? '2px solid var(--blue-6)'
                                    : '2px solid transparent',
                                transition: 'all 0.2s ease',
                            }}
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                            }}
                        >
                            <input
                                type={poll.multiple ? 'checkbox' : 'radio'}
                                name={`poll-${poll.id}`}
                                checked={selectedChoices.includes(index)}
                                onChange={() => onChoiceToggle(index)}
                                onClick={(e) => e.stopPropagation()}
                                style={{
                                    width: '18px',
                                    height: '18px',
                                    cursor: 'pointer',
                                }}
                            />
                            <span style={{
                                flex: 1,
                                color: 'var(--text-1)',
                                fontSize: 'var(--font-size-1)',
                            }}>
                                {option.title}
                            </span>
                        </label>
                    ))}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: 'var(--size-3)',
                    }}>
                        <div style={{
                            fontSize: 'var(--font-size-0)',
                            color: 'var(--text-2)',
                        }}>
                            {poll.votes_count} votes · {poll.multiple ? 'Multiple choice' : 'Single choice'}
                        </div>
                        <Button
                            size="small"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                onVote();
                            }}
                            disabled={selectedChoices.length === 0 || isVoting}
                            isLoading={isVoting}
                        >
                            Vote
                        </Button>
                    </div>
                </>
            ) : (
                <>
                    {/* Results display */}
                    {poll.options.map((option, index) => {
                        const percentage = poll.votes_count > 0
                            ? ((option.votes_count || 0) / poll.votes_count) * 100
                            : 0;
                        const isOwnVote = poll.own_votes?.includes(index);

                        return (
                            <div
                                key={index}
                                style={{
                                    marginBottom: 'var(--size-2)',
                                    padding: 'var(--size-2)',
                                    background: 'var(--surface-2)',
                                    borderRadius: 'var(--radius-2)',
                                    position: 'relative',
                                    border: isOwnVote ? '2px solid var(--blue-6)' : '2px solid transparent',
                                }}
                            >
                                <div style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    height: '100%',
                                    background: isOwnVote ? 'var(--blue-4)' : 'var(--blue-3)',
                                    borderRadius: 'var(--radius-2)',
                                    width: `${percentage}%`,
                                    transition: 'width 0.5s ease',
                                }} />
                                <div style={{
                                    position: 'relative',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    gap: 'var(--size-2)',
                                }}>
                                    <span style={{
                                        flex: 1,
                                        color: 'var(--text-1)',
                                        fontWeight: isOwnVote ? 'var(--font-weight-6)' : 'normal',
                                    }}>
                                        {option.title}
                                        {isOwnVote && (
                                            <span style={{
                                                marginLeft: 'var(--size-2)',
                                                fontSize: 'var(--font-size-0)',
                                                color: 'var(--blue-6)',
                                            }}>
                                                ✓
                                            </span>
                                        )}
                                    </span>
                                    <span style={{
                                        color: 'var(--text-2)',
                                        fontSize: 'var(--font-size-0)',
                                        fontWeight: 'var(--font-weight-6)',
                                    }}>
                                        {percentage.toFixed(1)}%
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                    <div style={{
                        marginTop: 'var(--size-2)',
                        fontSize: 'var(--font-size-0)',
                        color: 'var(--text-2)',
                    }}>
                        {poll.votes_count.toLocaleString()} votes
                        {poll.voters_count !== null &&
                            ` · ${poll.voters_count.toLocaleString()} voters`}
                        {' · '}
                        {poll.expired ? (
                            <span style={{ color: 'var(--red-6)' }}>Closed</span>
                        ) : (
                            `Closes ${new Date(poll.expires_at!).toLocaleString()}`
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
