'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { ArrowLeft, Search as SearchIcon, Hash, X, Clock } from 'lucide-react';
import { useSearch } from '@/api/queries';
import { useSearchHistory } from '@/hooks/useSearchHistory';
import { PostCard } from '@/components/molecules/PostCard';
import { UserCard } from '@/components/molecules/UserCard';
import { Input } from '@/components/atoms/Input';
import { Spinner } from '@/components/atoms/Spinner';
import { IconButton } from '@/components/atoms/IconButton';
import { Card } from '@/components/atoms/Card';

type TabType = 'all' | 'accounts' | 'statuses' | 'hashtags';

export default function SearchPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const urlQuery = searchParams.get('q') || '';
  const urlType = searchParams.get('type') as TabType;

  const [query, setQuery] = useState(urlQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(urlQuery);
  const [activeTab, setActiveTab] = useState<TabType>(
    urlType || (urlQuery.startsWith('#') ? 'hashtags' : 'all')
  );

  const { history, addToHistory, removeFromHistory, clearHistory } = useSearchHistory();

  // Sync State -> URL
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    let hasChanges = false;

    // Sync Query
    if (debouncedQuery) {
      if (params.get('q') !== debouncedQuery) {
        params.set('q', debouncedQuery);
        hasChanges = true;
      }
    } else {
      if (params.has('q')) {
        params.delete('q');
        hasChanges = true;
      }
    }

    // Sync Tab
    if (activeTab && activeTab !== 'all') {
      if (params.get('type') !== activeTab) {
        params.set('type', activeTab);
        hasChanges = true;
      }
    } else {
      if (params.has('type')) {
        params.delete('type');
        hasChanges = true;
      }
    }

    if (hasChanges) {
      router.replace(`${pathname}?${params.toString()}`);
    }
  }, [debouncedQuery, activeTab, pathname, router, searchParams]);

  // Sync URL -> State (Handle Back/Forward/External)
  useEffect(() => {
    // Sync Query if different (e.g. Back button)
    if (urlQuery !== debouncedQuery) {
      setQuery(urlQuery);
      setDebouncedQuery(urlQuery);
      if (urlQuery) addToHistory(urlQuery);

      // Handle auto-switching to hashtags tab for # queries if no type specified
      if (!urlType && urlQuery.startsWith('#')) {
        setActiveTab('hashtags');
      }
    }

    // Sync Tab if different
    if (urlType && urlType !== activeTab) {
      setActiveTab(urlType);
    } else if (!urlType && activeTab !== 'all' && !urlQuery.startsWith('#')) {
      // If URL has no type, and default logic wouldn't set it to hashtags, 
      // but state is on something else, should we reset?
      // For now, let's just respect explicit URL type changes.
      setActiveTab('all');
    }
  }, [urlQuery, urlType]); // Minimal deps to avoid loops

  // Debounce search query
  useEffect(() => {
    // Only debounce if query is different from debouncedQuery
    // AND if query is different from urlQuery (typing)
    // Actually standard debounce is fine, the sync effect handles the rest
    if (query !== debouncedQuery) {
      const timer = setTimeout(() => {
        setDebouncedQuery(query);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [query, debouncedQuery]);

  const {
    data: searchResults,
    isLoading,
    isError,
  } = useSearch({
    q: debouncedQuery,
    type: activeTab === 'all' ? undefined : activeTab,
  });

  const hasQuery = debouncedQuery.trim().length > 0;
  const hasResults = searchResults && (
    searchResults.accounts.length > 0 ||
    searchResults.statuses.length > 0 ||
    searchResults.hashtags.length > 0
  );

  return (
    <div className="container" style={{ maxWidth: '600px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{
        position: 'sticky',
        top: 0,
        background: 'var(--surface-1)',
        zIndex: 10,
        padding: 'var(--size-4) 0',
        marginBottom: 'var(--size-4)',
        borderBottom: '1px solid var(--surface-3)',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--size-3)',
          marginBottom: 'var(--size-4)',
        }}>
          <IconButton onClick={() => router.back()}>
            <ArrowLeft size={20} />
          </IconButton>
          <h1 style={{ fontSize: 'var(--font-size-4)' }}>
            Search
          </h1>
        </div>

        {/* Search Input */}
        <div style={{ position: 'relative' }}>
          <SearchIcon
            size={18}
            style={{
              position: 'absolute',
              left: 'var(--size-3)',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-2)',
              pointerEvents: 'none',
            }}
          />
          <Input
            type="text"
            placeholder="Search for people, posts, or hashtags..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                addToHistory(query);
              }
            }}
            style={{
              paddingLeft: 'var(--size-8)',
              width: '100%',
            }}
          />
        </div>

        {/* Tabs */}
        {hasQuery && (
          <div style={{
            display: 'flex',
            gap: 'var(--size-2)',
            marginTop: 'var(--size-4)',
            overflowX: 'auto',
          }}>
            {(['all', 'accounts', 'statuses', 'hashtags'] as TabType[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: 'var(--size-2) var(--size-3)',
                  border: 'none',
                  borderRadius: 'var(--radius-2)',
                  background: activeTab === tab ? 'var(--blue-6)' : 'var(--surface-3)',
                  color: activeTab === tab ? 'white' : 'var(--text-1)',
                  fontSize: 'var(--font-size-1)',
                  fontWeight: 'var(--font-weight-6)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  textTransform: 'capitalize',
                  whiteSpace: 'nowrap',
                }}
              >
                {tab}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div>
        {!hasQuery && (
          <div>
            {history.length > 0 ? (
              <div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 'var(--size-3)',
                  padding: '0 var(--size-2)'
                }}>
                  <h3 style={{
                    fontSize: 'var(--font-size-2)',
                    fontWeight: 'var(--font-weight-6)',
                    color: 'var(--text-2)'
                  }}>Recent</h3>
                  <button
                    onClick={clearHistory}
                    style={{
                      border: 'none',
                      background: 'none',
                      color: 'var(--blue-6)',
                      fontSize: 'var(--font-size-1)',
                      fontWeight: 'var(--font-weight-6)',
                      cursor: 'pointer'
                    }}
                  >
                    Clear all
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--size-2)' }}>
                  {history.map((term, index) => (
                    <div
                      key={term + index}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: 'var(--size-3)',
                        borderRadius: 'var(--radius-2)',
                        background: 'var(--surface-2)',
                        cursor: 'pointer',
                        transition: 'background 0.2s ease'
                      }}
                      className="recent-search-item"
                      onClick={() => setQuery(term)}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--size-3)' }}>
                        <Clock size={16} style={{ color: 'var(--text-3)' }} />
                        <span style={{ color: 'var(--text-1)' }}>{term}</span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFromHistory(term);
                        }}
                        style={{
                          border: 'none',
                          background: 'none',
                          color: 'var(--text-3)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: 'var(--size-1)',
                          borderRadius: '50%'
                        }}
                        className="recent-search-remove"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div style={{ display: 'grid', placeItems: 'center', marginTop: 'var(--size-8)', color: 'var(--text-2)' }}>
                <SearchIcon size={48} style={{ marginBottom: 'var(--size-4)' }} />
                <p>Search for people, posts, or hashtags</p>
              </div>
            )}
          </div>
        )}

        {hasQuery && isLoading && (
          <div style={{ display: 'grid', placeItems: 'center', marginTop: 'var(--size-8)' }}>
            <Spinner />
            <p style={{ marginTop: 'var(--size-4)', color: 'var(--text-2)' }}>
              Searching...
            </p>
          </div>
        )}

        {hasQuery && !isLoading && isError && (
          <div style={{ textAlign: 'center', marginTop: 'var(--size-8)', color: 'var(--red-6)' }}>
            <p>An error occurred while searching</p>
          </div>
        )}

        {hasQuery && !isLoading && !isError && !hasResults && (
          <div style={{ textAlign: 'center', marginTop: 'var(--size-8)', color: 'var(--text-2)' }}>
            <p>No results found for "{debouncedQuery}"</p>
          </div>
        )}

        {hasQuery && !isLoading && !isError && hasResults && searchResults && (
          <div>
            {/* Accounts */}
            {(activeTab === 'all' || activeTab === 'accounts') && searchResults.accounts.length > 0 && (
              <div style={{ marginBottom: 'var(--size-6)' }}>
                <h2 style={{
                  fontSize: 'var(--font-size-3)',
                  fontWeight: 'var(--font-weight-6)',
                  marginBottom: 'var(--size-4)',
                  color: 'var(--text-1)',
                }}>
                  Accounts ({searchResults.accounts.length})
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--size-3)' }}>
                  {searchResults.accounts.map((account) => (
                    <UserCard key={account.id} account={account} />
                  ))}
                </div>
              </div>
            )}

            {/* Statuses */}
            {(activeTab === 'all' || activeTab === 'statuses') && searchResults.statuses.length > 0 && (
              <div style={{ marginBottom: 'var(--size-6)' }}>
                <h2 style={{
                  fontSize: 'var(--font-size-3)',
                  fontWeight: 'var(--font-weight-6)',
                  marginBottom: 'var(--size-4)',
                  color: 'var(--text-1)',
                }}>
                  Posts ({searchResults.statuses.length})
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--size-3)' }}>
                  {searchResults.statuses.map((status) => (
                    <PostCard key={status.id} status={status} />
                  ))}
                </div>
              </div>
            )}

            {/* Hashtags */}
            {(activeTab === 'all' || activeTab === 'hashtags') && searchResults.hashtags.length > 0 && (
              <div style={{ marginBottom: 'var(--size-6)' }}>
                <h2 style={{
                  fontSize: 'var(--font-size-3)',
                  fontWeight: 'var(--font-weight-6)',
                  marginBottom: 'var(--size-4)',
                  color: 'var(--text-1)',
                }}>
                  Hashtags ({searchResults.hashtags.length})
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--size-3)' }}>
                  {searchResults.hashtags.map((tag) => (
                    <Card key={tag.name} hoverable>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--size-3)',
                        padding: 'var(--size-2)',
                      }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: 'var(--size-9)',
                          height: 'var(--size-9)',
                          borderRadius: '50%',
                          background: 'var(--surface-3)',
                        }}>
                          <Hash size={20} style={{ color: 'var(--text-2)' }} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{
                            fontSize: 'var(--font-size-2)',
                            fontWeight: 'var(--font-weight-6)',
                            color: 'var(--text-1)',
                          }}>
                            #{tag.name}
                          </div>
                          {tag.history && tag.history.length > 0 && (
                            <div style={{
                              fontSize: 'var(--font-size-0)',
                              color: 'var(--text-2)',
                              marginTop: 'var(--size-1)',
                            }}>
                              {tag.history[0].uses} posts
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
