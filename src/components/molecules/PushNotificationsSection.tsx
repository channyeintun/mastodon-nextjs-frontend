'use client';

import { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { Bell, BellRing, Heart, Repeat2, AtSign, BarChart2 } from 'lucide-react';
import { Card } from '@/components/atoms';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import type { PushAlerts } from '@/types';

/**
 * Push Notifications Settings Section
 * Allows users to enable/disable push notifications and configure alert types
 */
export function PushNotificationsSection() {
    const {
        isSupported,
        permissionState,
        isSubscribed,
        alerts,
        isLoading,
        isSubscribing,
        isUpdating,
        isUnsubscribing,
        error,
        subscribe,
        unsubscribe,
        updateAlerts,
    } = usePushNotifications();

    const [localAlerts, setLocalAlerts] = useState<Partial<PushAlerts>>({
        follow: true,
        favourite: true,
        reblog: true,
        mention: true,
        poll: true,
    });

    // Sync local alerts with server state
    useEffect(() => {
        if (alerts) {
            setLocalAlerts(alerts);
        }
    }, [alerts]);

    const handleToggle = async () => {
        try {
            if (isSubscribed) {
                await unsubscribe();
            } else {
                await subscribe(localAlerts);
            }
        } catch (err) {
            console.error('Push notification toggle failed:', err);
        }
    };

    const handleAlertChange = async (key: keyof PushAlerts, value: boolean) => {
        const newAlerts = { ...localAlerts, [key]: value };
        setLocalAlerts(newAlerts);
        if (isSubscribed) {
            try {
                await updateAlerts(newAlerts);
            } catch (err) {
                console.error('Push notification update failed:', err);
            }
        }
    };

    if (!isSupported) {
        return (
            <Card padding="medium" style={{ marginBottom: 'var(--size-4)' }}>
                <PushHeader>
                    <PushIcon $disabled>
                        <BellRing size={20} />
                    </PushIcon>
                    <PushText>
                        <PushTitle>Push Notifications</PushTitle>
                        <PushDescription>Not supported in this browser</PushDescription>
                    </PushText>
                </PushHeader>
            </Card>
        );
    }

    if (permissionState === 'denied') {
        return (
            <Card padding="medium" style={{ marginBottom: 'var(--size-4)' }}>
                <PushHeader>
                    <PushIcon $disabled>
                        <BellRing size={20} />
                    </PushIcon>
                    <PushText>
                        <PushTitle>Push Notifications</PushTitle>
                        <PushDescription>Permission denied. Enable notifications in your browser settings.</PushDescription>
                    </PushText>
                </PushHeader>
            </Card>
        );
    }

    const alertOptions = [
        { key: 'mention' as const, label: 'Mentions', icon: <AtSign size={16} /> },
        { key: 'favourite' as const, label: 'Favorites', icon: <Heart size={16} /> },
        { key: 'reblog' as const, label: 'Boosts', icon: <Repeat2 size={16} /> },
        { key: 'follow' as const, label: 'Follows', icon: <Bell size={16} /> },
        { key: 'poll' as const, label: 'Polls', icon: <BarChart2 size={16} /> },
    ];

    return (
        <Card padding="medium" style={{ marginBottom: 'var(--size-4)' }}>
            <PushHeader>
                <PushIcon $disabled={false}>
                    <BellRing size={20} />
                </PushIcon>
                <PushText>
                    <PushTitle>Push Notifications</PushTitle>
                    <PushDescription>
                        {isSubscribed ? 'Enabled - receive notifications even when the app is closed' : 'Receive notifications even when the app is closed'}
                    </PushDescription>
                </PushText>
                <PushToggle>
                    <ToggleButton
                        type="button"
                        onClick={handleToggle}
                        disabled={isLoading || isSubscribing || isUnsubscribing}
                        $active={isSubscribed}
                        aria-label={isSubscribed ? 'Disable push notifications' : 'Enable push notifications'}
                    >
                        {isSubscribing || isUnsubscribing ? '...' : isSubscribed ? 'On' : 'Off'}
                    </ToggleButton>
                </PushToggle>
            </PushHeader>

            {error && (
                <ErrorMessage>{error.message}</ErrorMessage>
            )}

            {isSubscribed && (
                <AlertsSection>
                    <AlertsSectionTitle>Alert Types</AlertsSectionTitle>
                    {alertOptions.map(option => (
                        <AlertRow key={option.key}>
                            <AlertInfo>
                                <AlertIcon>{option.icon}</AlertIcon>
                                <AlertLabel>{option.label}</AlertLabel>
                            </AlertInfo>
                            <AlertCheckbox
                                type="checkbox"
                                checked={localAlerts[option.key] ?? true}
                                onChange={(e) => handleAlertChange(option.key, e.target.checked)}
                                disabled={isUpdating}
                            />
                        </AlertRow>
                    ))}
                </AlertsSection>
            )}
        </Card>
    );
}

// Styled components
const PushHeader = styled.div`
    display: flex;
    align-items: center;
    gap: var(--size-3);
`;

const PushIcon = styled.div<{ $disabled: boolean }>`
    color: ${props => props.$disabled ? 'var(--text-3)' : 'var(--blue-7)'};
    flex-shrink: 0;
`;

const PushText = styled.div`
    flex: 1;
    min-width: 0;
`;

const PushTitle = styled.div`
    font-weight: var(--font-weight-6);
    color: var(--text-1);
    margin-bottom: var(--size-1);
`;

const PushDescription = styled.div`
    font-size: var(--font-size-0);
    color: var(--text-2);
`;

const PushToggle = styled.div`
    flex-shrink: 0;
`;

const ToggleButton = styled.button<{ $active: boolean }>`
    padding: var(--size-1) var(--size-3);
    border-radius: var(--radius-round);
    font-size: var(--font-size-0);
    font-weight: var(--font-weight-6);
    cursor: pointer;
    transition: all 0.2s ease;
    min-width: 48px;
    
    ${props => props.$active ? `
        background: var(--blue-6);
        color: white;
        border: none;
    ` : `
        background: var(--surface-3);
        color: var(--text-2);
        border: 1px solid var(--surface-4);
    `}

    &:hover:not(:disabled) {
        ${props => props.$active ? `
            background: var(--blue-7);
        ` : `
            background: var(--surface-4);
        `}
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
`;

const ErrorMessage = styled.div`
    margin-top: var(--size-2);
    padding: var(--size-2);
    background: var(--red-2);
    color: var(--red-9);
    border-radius: var(--radius-2);
    font-size: var(--font-size-0);
`;

const AlertsSection = styled.div`
    margin-top: var(--size-4);
    padding-top: var(--size-3);
    border-top: 1px solid var(--surface-3);
`;

const AlertsSectionTitle = styled.div`
    font-size: var(--font-size-0);
    font-weight: var(--font-weight-6);
    color: var(--text-2);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: var(--size-2);
`;

const AlertRow = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--size-2) 0;
`;

const AlertInfo = styled.div`
    display: flex;
    align-items: center;
    gap: var(--size-2);
`;

const AlertIcon = styled.div`
    color: var(--text-2);
`;

const AlertLabel = styled.div`
    font-size: var(--font-size-1);
    color: var(--text-1);
`;

const AlertCheckbox = styled.input`
    width: 18px;
    height: 18px;
    cursor: pointer;
    accent-color: var(--blue-6);

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
`;
