'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styled from '@emotion/styled';
import { ArrowLeft, Bell, Filter, UserX, Clock, Mail, AlertTriangle } from 'lucide-react';
import { useNotificationPolicy, useUpdateNotificationPolicy } from '@/api';
import { Button, IconButton, Card, CircleSkeleton, TextSkeleton } from '@/components/atoms';
import { useAuthStore } from '@/hooks/useStores';
import type { NotificationPolicyValue } from '@/types';

interface PolicyOption {
    value: NotificationPolicyValue;
    label: string;
    description: string;
}

const policyOptions: PolicyOption[] = [
    { value: 'accept', label: 'Accept', description: 'Show these notifications normally' },
    { value: 'filter', label: 'Filter', description: 'Send to filtered notifications for review' },
    { value: 'drop', label: 'Drop', description: 'Silently discard these notifications' },
];

interface PolicyCategory {
    key: keyof PolicyState;
    label: string;
    description: string;
    icon: React.ReactNode;
}

const policyCategories: PolicyCategory[] = [
    {
        key: 'for_not_following',
        label: 'People you don\'t follow',
        description: 'Notifications from accounts you don\'t follow',
        icon: <UserX size={20} />,
    },
    {
        key: 'for_not_followers',
        label: 'People not following you',
        description: 'Notifications from accounts that don\'t follow you',
        icon: <UserX size={20} />,
    },
    {
        key: 'for_new_accounts',
        label: 'New accounts',
        description: 'Notifications from accounts created in the last 30 days',
        icon: <Clock size={20} />,
    },
    {
        key: 'for_private_mentions',
        label: 'Unsolicited private mentions',
        description: 'Private mentions from people you don\'t follow',
        icon: <Mail size={20} />,
    },
    {
        key: 'for_limited_accounts',
        label: 'Moderated accounts',
        description: 'Notifications from accounts limited by moderators',
        icon: <AlertTriangle size={20} />,
    },
];

interface PolicyState {
    for_not_following: NotificationPolicyValue;
    for_not_followers: NotificationPolicyValue;
    for_new_accounts: NotificationPolicyValue;
    for_private_mentions: NotificationPolicyValue;
    for_limited_accounts: NotificationPolicyValue;
}

export default function NotificationPolicyPage() {
    const router = useRouter();
    const authStore = useAuthStore();
    const { data: policy, isLoading } = useNotificationPolicy();
    const updateMutation = useUpdateNotificationPolicy();

    const [state, setState] = useState<PolicyState>({
        for_not_following: 'accept',
        for_not_followers: 'accept',
        for_new_accounts: 'accept',
        for_private_mentions: 'filter',
        for_limited_accounts: 'filter',
    });
    const [hasChanges, setHasChanges] = useState(false);

    // Initialize state from policy
    useEffect(() => {
        if (policy) {
            setState({
                for_not_following: policy.for_not_following,
                for_not_followers: policy.for_not_followers,
                for_new_accounts: policy.for_new_accounts,
                for_private_mentions: policy.for_private_mentions,
                for_limited_accounts: policy.for_limited_accounts,
            });
        }
    }, [policy]);

    // Check for changes
    useEffect(() => {
        if (policy) {
            const changed =
                state.for_not_following !== policy.for_not_following ||
                state.for_not_followers !== policy.for_not_followers ||
                state.for_new_accounts !== policy.for_new_accounts ||
                state.for_private_mentions !== policy.for_private_mentions ||
                state.for_limited_accounts !== policy.for_limited_accounts;
            setHasChanges(changed);
        }
    }, [state, policy]);

    // Redirect if not authenticated
    useEffect(() => {
        if (!authStore.isAuthenticated) {
            router.push('/');
        }
    }, [authStore.isAuthenticated, router]);

    if (!authStore.isAuthenticated) {
        return null;
    }

    const handleChange = (key: keyof PolicyState, value: NotificationPolicyValue) => {
        setState(prev => ({ ...prev, [key]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await updateMutation.mutateAsync(state);
            setHasChanges(false);
        } catch (error) {
            console.error('Failed to update notification policy:', error);
        }
    };

    if (isLoading) {
        return (
            <div style={{ maxWidth: '600px', margin: '0 auto', padding: 'var(--size-4) var(--size-2)' }}>
                <Header>
                    <CircleSkeleton size="40px" />
                    <TextSkeleton width={200} height={24} />
                </Header>
                <Card padding="medium">
                    {[1, 2, 3, 4, 5].map(i => (
                        <TextSkeleton key={i} width="100%" height={60} style={{ marginBottom: 'var(--size-3)' }} />
                    ))}
                </Card>
            </div>
        );
    }

    const pendingCount = policy?.summary?.pending_requests_count ?? 0;

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: 'var(--size-4) var(--size-2)' }}>
            <Header>
                <IconButton onClick={() => router.back()} aria-label="Go back">
                    <ArrowLeft size={20} />
                </IconButton>
                <h1>
                    <Bell size={24} />
                    Notification filtering
                </h1>
            </Header>

            <Description>
                Control how notifications from certain accounts are handled. Filtered notifications can be reviewed separately.
            </Description>

            {pendingCount > 0 && (
                <PendingBanner href="/notifications/requests">
                    <Filter size={16} />
                    <span>
                        {pendingCount} filtered {pendingCount === 1 ? 'notification' : 'notifications'} pending review
                    </span>
                </PendingBanner>
            )}

            <form onSubmit={handleSubmit}>
                <Card padding="medium" style={{ marginBottom: 'var(--size-4)' }}>
                    {policyCategories.map((category, index) => (
                        <PolicyRow key={category.key} $isLast={index === policyCategories.length - 1}>
                            <PolicyInfo>
                                <PolicyIcon>{category.icon}</PolicyIcon>
                                <PolicyText>
                                    <PolicyLabel>{category.label}</PolicyLabel>
                                    <PolicyDescription>{category.description}</PolicyDescription>
                                </PolicyText>
                            </PolicyInfo>
                            <PolicySelect
                                value={state[category.key]}
                                onChange={(e) => handleChange(category.key, e.target.value as NotificationPolicyValue)}
                            >
                                {policyOptions.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </PolicySelect>
                        </PolicyRow>
                    ))}
                </Card>

                <ButtonRow>
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={() => router.back()}
                        disabled={updateMutation.isPending}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={!hasChanges || updateMutation.isPending}
                        isLoading={updateMutation.isPending}
                    >
                        Save changes
                    </Button>
                </ButtonRow>
            </form>
        </div>
    );
}

// Styled components
const Header = styled.div`
    display: flex;
    align-items: center;
    gap: var(--size-3);
    margin-bottom: var(--size-5);

    h1 {
        font-size: var(--font-size-4);
        font-weight: var(--font-weight-6);
        color: var(--text-1);
        display: flex;
        align-items: center;
        gap: var(--size-2);
        margin: 0;
    }
`;

const Description = styled.p`
    font-size: var(--font-size-1);
    color: var(--text-2);
    margin-bottom: var(--size-4);
    line-height: 1.5;
`;

const PendingBanner = styled(Link)`
    display: flex;
    align-items: center;
    gap: var(--size-2);
    padding: var(--size-3) var(--size-4);
    margin-bottom: var(--size-4);
    background: var(--blue-2);
    border-radius: var(--radius-2);
    color: var(--blue-9);
    text-decoration: none;
    font-size: var(--font-size-1);
    font-weight: var(--font-weight-5);

    &:hover {
        background: var(--blue-3);
    }
`;

const PolicyRow = styled.div<{ $isLast: boolean }>`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--size-4);
    padding: var(--size-3) 0;
    border-bottom: ${props => props.$isLast ? 'none' : '1px solid var(--surface-3)'};

    @media (max-width: 500px) {
        flex-direction: column;
        align-items: flex-start;
        gap: var(--size-2);
    }
`;

const PolicyInfo = styled.div`
    display: flex;
    align-items: flex-start;
    gap: var(--size-3);
    flex: 1;
    min-width: 0;
`;

const PolicyIcon = styled.div`
    color: var(--text-2);
    flex-shrink: 0;
    margin-top: 2px;
`;

const PolicyText = styled.div`
    min-width: 0;
`;

const PolicyLabel = styled.div`
    font-weight: var(--font-weight-6);
    color: var(--text-1);
    margin-bottom: var(--size-1);
`;

const PolicyDescription = styled.div`
    font-size: var(--font-size-0);
    color: var(--text-2);
`;

const PolicySelect = styled.select`
    padding: var(--size-2) var(--size-3);
    border: 1px solid var(--surface-4);
    border-radius: var(--radius-2);
    background: var(--surface-2);
    color: var(--text-1);
    font-size: var(--font-size-1);
    min-width: 120px;
    cursor: pointer;

    &:focus {
        outline: none;
        border-color: var(--blue-6);
    }

    @media (max-width: 500px) {
        width: 100%;
    }
`;

const ButtonRow = styled.div`
    display: flex;
    gap: var(--size-3);
    justify-content: flex-end;
`;
