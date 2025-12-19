'use client';

import styled from '@emotion/styled';
import Link from 'next/link';
import { useFamiliarFollowers } from '@/api';
import { Avatar } from '@/components/atoms';
import type { Account } from '@/types';

interface FamiliarFollowersProps {
    accountId: string | undefined;
    isOwnProfile?: boolean;
}

/**
 * Displays familiar followers (accounts the user follows who also follow this account)
 * with stacked avatars and "Followed by X and Y" text.
 */
export function FamiliarFollowers({ accountId, isOwnProfile }: FamiliarFollowersProps) {
    const { data: familiarFollowersData, isLoading } = useFamiliarFollowers(accountId);

    // Don't show for own profile
    if (isOwnProfile) return null;

    // Get accounts from the response (API returns array with one item containing the accounts)
    const accounts = familiarFollowersData?.[0]?.accounts || [];

    // Don't show if loading or no familiar followers
    if (isLoading || accounts.length === 0) return null;

    return (
        <Container>
            <AvatarStack>
                {accounts.slice(0, 3).map((account, index) => (
                    <AvatarWrapper key={account.id} $index={index}>
                        <Link href={`/@${account.acct}`}>
                            <Avatar
                                src={account.avatar}
                                alt={account.display_name || account.username}
                                size="small"
                                style={{ border: '2px solid var(--surface-1)' }}
                            />
                        </Link>
                    </AvatarWrapper>
                ))}
            </AvatarStack>
            <Text>
                <FamiliarFollowersText accounts={accounts} />
            </Text>
        </Container>
    );
}

function FamiliarFollowersText({ accounts }: { accounts: Account[] }) {
    if (accounts.length === 1) {
        return (
            <>
                Followed by <AccountLink account={accounts[0]} />
            </>
        );
    } else if (accounts.length === 2) {
        return (
            <>
                Followed by <AccountLink account={accounts[0]} /> and{' '}
                <AccountLink account={accounts[1]} />
            </>
        );
    } else {
        const othersCount = accounts.length - 2;
        return (
            <>
                Followed by <AccountLink account={accounts[0]} />,{' '}
                <AccountLink account={accounts[1]} />, and{' '}
                {othersCount === 1 ? '1 other you follow' : `${othersCount} others you follow`}
            </>
        );
    }
}

function AccountLink({ account }: { account: Account }) {
    const displayName = account.display_name || account.username;
    return (
        <StyledLink href={`/@${account.acct}`}>
            {displayName}
        </StyledLink>
    );
}

const Container = styled.div`
    display: flex;
    align-items: center;
    gap: var(--size-2);
    font-size: var(--font-size-0);
    color: var(--text-2);
    margin-top: var(--size-1);
`;

const AvatarStack = styled.div`
    display: flex;
    flex-direction: row-reverse;
    align-items: center;
`;

const AvatarWrapper = styled.div<{ $index: number }>`
    margin-right: ${({ $index }) => ($index === 0 ? '0' : '-8px')};
    z-index: ${({ $index }) => 3 - $index};
    
    a {
        display: block;
    }
`;

const Text = styled.span`
    line-height: 1.4;
`;

const StyledLink = styled(Link)`
    color: var(--text-1);
    font-weight: var(--font-weight-5);
    text-decoration: none;
    
    &:hover {
        text-decoration: underline;
    }
`;
