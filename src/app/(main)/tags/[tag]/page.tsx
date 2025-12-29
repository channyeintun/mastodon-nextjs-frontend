'use client';

import { useInfiniteHashtagTimeline } from '@/hooks/useInfiniteHashtagTimeline';
import { PostCard } from '@/components/PostCard';
import { PostCardSkeletonList } from '@/components/PostCardSkeletonList';
import { useInView } from 'react-intersection-observer';
import { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface PageProps {
  params: {
    tag: string;
  };
}

export default function HashtagPage({ params }: PageProps) {
  const { tag } = params;
  const decodedTag = decodeURIComponent(tag);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteHashtagTimeline(decodedTag);

  const { ref, inView } = useInView({
    threshold: 0,
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const posts = data?.pages.flatMap((page) => page) ?? [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div
        style={{
          padding: 'var(--size-4)',
          borderBottom: '1px solid var(--border-color)',
          position: 'sticky',
          top: 0,
          backgroundColor: 'var(--background)',
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--size-4)',
        }}
      >
        <Link href="/" style={{ display: 'flex', alignItems: 'center' }}>
          <ArrowLeft size={20} />
        </Link>
        <h1 style={{ margin: 0, fontSize: 'var(--font-size-xl)' }}>
          #{decodedTag}
        </h1>
      </div>

      {error && (
        <div
          style={{
            padding: 'var(--size-4)',
            color: 'var(--color-error)',
            textAlign: 'center',
          }}
        >
          Error loading posts
        </div>
      )}

      {isLoading ? (
        <div className="virtualized-list-container" style={{ flex: 1, overflow: 'auto' }}>
          <PostCardSkeletonList count={5} />
        </div>
      ) : (
        <div
          className="virtualized-list-container"
          style={{ flex: 1, overflow: 'auto' }}
        >
          {posts.length === 0 ? (
            <div
              style={{
                padding: 'var(--size-8)',
                textAlign: 'center',
                color: 'var(--color-text-secondary)',
              }}
            >
              No posts found for this hashtag
            </div>
          ) : (
            posts.map((post) => <PostCard key={post.id} post={post} />)
          )}

          {hasNextPage && (
            <div
              ref={ref}
              style={{
                padding: 'var(--size-4)',
                textAlign: 'center',
              }}
            >
              {isFetchingNextPage ? (
                <PostCardSkeletonList count={2} />
              ) : (
                'Load more'
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
