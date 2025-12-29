import { Box, Flex, Heading, Tabs } from '@radix-ui/themes';
import { notFound } from 'next/navigation';
import { getHashtag } from '@/services/hashtag';
import { getStatusesByHashtag } from '@/services/timeline';
import { Metadata } from 'next';
import StatusList from '@/components/StatusList';
import BackButton from '@/components/BackButton';
import FollowHashtagButton from '@/components/FollowHashtagButton';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>;
}): Promise<Metadata> {
  const tag = (await params).tag;
  return {
    title: `#${tag}`,
  };
}

export default async function HashtagPage({
  params,
  searchParams,
}: {
  params: Promise<{ tag: string }>;
  searchParams: Promise<{ view?: string }>;
}) {
  const tag = (await params).tag;
  const view = (await searchParams).view || 'all';
  const hashtag = await getHashtag(tag);

  if (!hashtag) {
    notFound();
  }

  const statuses = await getStatusesByHashtag(tag, view);

  return (
    <Box>
      <Flex
        direction="column"
        gap="4"
        style={{
          borderBottom: '1px solid var(--gray-a5)',
          padding: 'var(--size-4)',
          position: 'sticky',
          top: 0,
          backgroundColor: 'var(--color-background)',
          zIndex: 10,
        }}
      >
        <Flex justify="between" align="center">
          <Flex align="center" gap="4">
            <BackButton />
            <Heading size="5" weight="bold">
              #{hashtag.name}
            </Heading>
          </Flex>
          <FollowHashtagButton hashtag={hashtag} />
        </Flex>

        <Flex direction="column" gap="1">
          <Box>
            <strong>{hashtag.history?.[0]?.accounts || 0}</strong> people
          </Box>
          <Box color="gray">
            {hashtag.history?.[0]?.uses || 0} posts in the last 24 hours
          </Box>
        </Flex>
      </Flex>

      <Tabs.Root defaultValue={view}>
        <Tabs.List
          style={{
            borderBottom: '1px solid var(--gray-a5)',
            position: 'sticky',
            top: 'var(--header-height)',
            backgroundColor: 'var(--color-background)',
            zIndex: 9,
          }}
        >
          <Tabs.Trigger value="all" asChild>
            <a
              href={`/tags/${tag}`}
              style={{ flex: 1, textAlign: 'center' }}
            >
              All
            </a>
          </Tabs.Trigger>
          <Tabs.Trigger value="local" asChild>
            <a
              href={`/tags/${tag}?view=local`}
              style={{ flex: 1, textAlign: 'center' }}
            >
              Local
            </a>
          </Tabs.Trigger>
        </Tabs.List>

        <Box
          style={{
            padding: 'var(--size-4)',
          }}
        >
          <StatusList initialStatuses={statuses} />
        </Box>
      </Tabs.Root>
    </Box>
  );
}
