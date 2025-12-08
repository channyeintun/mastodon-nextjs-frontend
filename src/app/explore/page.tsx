'use client';

import { TrendingUp } from 'lucide-react';
import { TrendingContent } from '@/components/organisms/TrendingContent';

const ExplorePage = () => {
    return (
        <TrendingContent
            header={
                <div style={{
                    background: 'var(--surface-1)',
                    zIndex: 10,
                    padding: 'var(--size-4)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--size-2)',
                    flexShrink: 0,
                }}>
                    <TrendingUp size={24} />
                    <h1 style={{ fontSize: 'var(--font-size-5)', margin: 0 }}>
                        Explore
                    </h1>
                </div>
            }
            scrollRestorationPrefix="explore"
        />
    );
};

export default ExplorePage;
