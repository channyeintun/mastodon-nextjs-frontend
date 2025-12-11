'use client';

interface ProfileBioProps {
    note: string;
}

/**
 * Presentation component for profile bio/note.
 * Renders HTML content with emoji support.
 */
export function ProfileBio({ note }: ProfileBioProps) {
    if (!note) return null;

    return (
        <div
            style={{
                marginBottom: 'var(--size-3)',
                lineHeight: '1.5',
                color: 'var(--text-1)',
            }}
            dangerouslySetInnerHTML={{ __html: note }}
        />
    );
}
