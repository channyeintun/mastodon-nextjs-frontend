import styled from '@emotion/styled';
import type { CSSProperties } from 'react';

interface ProfilePillSkeletonProps {
  /** Width of the name placeholder (default: 80px) */
  nameWidth?: string;
  /** Additional inline styles */
  style?: CSSProperties;
  /** Additional CSS class names */
  className?: string;
}

/**
 * ProfilePillSkeleton - Loading skeleton for profile pill component
 *
 * Displays a skeleton loader matching the profile pill component structure,
 * with an avatar circle and name placeholder.
 *
 * @example
 * ```tsx
 * <ProfilePillSkeleton />
 * <ProfilePillSkeleton nameWidth="100px" />
 * ```
 */
export const ProfilePillSkeleton = ({
  nameWidth = '80px',
  style,
  className = '',
}: ProfilePillSkeletonProps) => {
  return (
    <div
      className={`profile-pill profile-pill-static skeleton-loading ${className}`}
      style={style}
      aria-label="Loading profile..."
      role="status"
    >
      <AvatarPlaceholder className="profile-pill-avatar" />
      <NamePlaceholder className="profile-pill-name" $width={nameWidth} />
    </div>
  );
};

// Styled components
const AvatarPlaceholder = styled.div`
  background: var(--surface-3);
`;

const NamePlaceholder = styled.div<{ $width: string }>`
  width: ${props => props.$width};
  height: 1em;
  background: var(--surface-3);
  border-radius: var(--radius-1);
`;