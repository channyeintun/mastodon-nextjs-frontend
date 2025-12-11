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
      <div
        className="profile-pill-avatar"
        style={{ background: 'var(--surface-3)' }}
      />
      <div
        className="profile-pill-name"
        style={{
          width: nameWidth,
          height: '1em',
          background: 'var(--surface-3)',
          borderRadius: 'var(--radius-1)',
        }}
      />
    </div>
  );
};
