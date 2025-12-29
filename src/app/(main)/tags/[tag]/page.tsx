import PostList from '@/components/post/PostList';
import { getHashtagTimeline } from '@/lib/mastodon/actions';
import PostCardSkeletonList from '@/components/post/PostCardSkeletonList';
import { Suspense } from 'react';
import { Metadata } from 'next';

interface PageProps {
  params: Promise<{
    tag: string;
  }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);

  return {
    title: `#${decodedTag}`,
    description: `Posts tagged with #${decodedTag}`,
  };
}

async function HashtagTimeline({ tag }: { tag: string }) {
  const decodedTag = decodeURIComponent(tag);
  const posts = await getHashtagTimeline(decodedTag);

  return (
    <div className="virtualized-list-container" style={{ flex: 1, overflow: 'auto' }}>
      <PostList
        initialData={posts}
        queryKey={['hashtagTimeline', decodedTag]}
        loadMorePosts={async (maxId) => {
          'use server';
          return await getHashtagTimeline(decodedTag, maxId);
        }}
      />
    </div>
  );
}

export default async function HashtagPage({ params }: PageProps) {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);

  return (
    <>
      <div className="sticky top-0 z-10 bg-background border-b">
        <div className="px-4 py-3">
          <h1 className="text-xl font-bold">#{decodedTag}</h1>
        </div>
      </div>

      <div className="flex flex-col min-h-0" style={{ flex: 1 }}>
        <div className="border-b">
          <div className="flex">
            <button className="flex-1 px-4 py-3 text-sm font-medium border-b-2 border-primary">
              Posts
            </button>
            <button className="flex-1 px-4 py-3 text-sm font-medium text-muted-foreground hover:bg-accent">
              People
            </button>
          </div>
        </div>

        <div className="min-h-0" style={{ flex: 1 }}>
          <Suspense
            fallback={
              <>
        <div className="virtualized-list-container" style={{ flex: 1, overflow: 'auto' }}>
          <PostCardSkeletonList count={5} />
        </div>
              </>
            }
          >
            <HashtagTimeline tag={tag} />
          </Suspense>
        </div>
      </div>
    </>
  );
}
