'use client';

import styled from '@emotion/styled';

/**
 * Skeleton loading placeholder for Account Profile section
 */
export function AccountProfileSkeleton() {
  return (
    <Container>
      {/* Profile Header Image */}
      <HeaderImage />

      {/* Profile Info */}
      <ProfileInfo>
        <HeaderRow>
          {/* Avatar skeleton */}
          <AvatarSkeleton />
          {/* Follow button skeleton */}
          <FollowButtonSkeleton />
        </HeaderRow>

        {/* Display name and username */}
        <NameSection>
          <DisplayNameSkeleton />
          <UsernameSkeleton />
        </NameSection>

        {/* Bio */}
        <BioSection>
          <BioLine $width="100%" $marginBottom />
          <BioLine $width="90%" $marginBottom />
          <BioLine $width="70%" />
        </BioSection>

        {/* Fields (metadata) */}
        <FieldsSection>
          {[1, 2].map((i) => (
            <FieldRow key={i} $showBorder={i < 2}>
              <FieldLabelSkeleton />
              <FieldValueSkeleton />
            </FieldRow>
          ))}
        </FieldsSection>

        {/* Joined date */}
        <JoinedDateSkeleton />

        {/* Stats */}
        <StatsRow>
          {[1, 2].map((i) => (
            <StatSkeleton key={i} />
          ))}
        </StatsRow>

        {/* External link */}
        <ExternalLinkSkeleton />
      </ProfileInfo>
    </Container>
  );
}

// Base skeleton styles
const skeletonBase = `
  background: var(--surface-3);
  animation: var(--animation-blink);
`;

// Styled components
const Container = styled.div``;

const HeaderImage = styled.div`
  width: 100%;
  height: 200px;
  ${skeletonBase}
  border-radius: var(--radius-3);
  margin-bottom: calc(-1 * var(--size-8));
`;

const ProfileInfo = styled.div`
  padding: var(--size-4);
  padding-top: var(--size-2);
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--size-3);
`;

const AvatarSkeleton = styled.div`
  width: var(--size-12);
  height: var(--size-12);
  border-radius: 50%;
  ${skeletonBase}
  border: 4px solid var(--surface-1);
`;

const FollowButtonSkeleton = styled.div`
  width: 100px;
  height: 36px;
  ${skeletonBase}
  border-radius: var(--radius-2);
`;

const NameSection = styled.div`
  margin-bottom: var(--size-3);
`;

const DisplayNameSkeleton = styled.div`
  width: 50%;
  height: 28px;
  ${skeletonBase}
  border-radius: var(--radius-1);
  margin-bottom: var(--size-2);
`;

const UsernameSkeleton = styled.div`
  width: 35%;
  height: 20px;
  ${skeletonBase}
  border-radius: var(--radius-1);
`;

const BioSection = styled.div`
  margin-bottom: var(--size-3);
`;

const BioLine = styled.div<{ $width: string; $marginBottom?: boolean }>`
  width: ${props => props.$width};
  height: 16px;
  ${skeletonBase}
  border-radius: var(--radius-1);
  margin-bottom: ${props => props.$marginBottom ? 'var(--size-2)' : '0'};
`;

const FieldsSection = styled.div`
  margin-bottom: var(--size-3);
`;

const FieldRow = styled.div<{ $showBorder: boolean }>`
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: var(--size-2);
  padding: var(--size-2) 0;
  border-bottom: ${props => props.$showBorder ? '1px solid var(--surface-3)' : 'none'};
`;

const FieldLabelSkeleton = styled.div`
  width: 80%;
  height: 16px;
  ${skeletonBase}
  border-radius: var(--radius-1);
`;

const FieldValueSkeleton = styled.div`
  width: 60%;
  height: 16px;
  ${skeletonBase}
  border-radius: var(--radius-1);
`;

const JoinedDateSkeleton = styled.div`
  width: 40%;
  height: 16px;
  ${skeletonBase}
  border-radius: var(--radius-1);
  margin-bottom: var(--size-3);
`;

const StatsRow = styled.div`
  display: flex;
  gap: var(--size-4);
  margin-bottom: var(--size-4);
`;

const StatSkeleton = styled.div`
  width: 100px;
  height: 20px;
  ${skeletonBase}
  border-radius: var(--radius-1);
`;

const ExternalLinkSkeleton = styled.div`
  width: 150px;
  height: 16px;
  ${skeletonBase}
  border-radius: var(--radius-1);
`;