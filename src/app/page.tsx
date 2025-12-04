'use client';

import { observer } from 'mobx-react-lite';
import Link from 'next/link';
import { useAuthStore } from '@/hooks/useStores';

const HomePage = observer(() => {
  const authStore = useAuthStore();

  if (!authStore.isAuthenticated) {
    return (
      <div className="container" style={{ maxWidth: '600px', marginTop: 'var(--size-8)', textAlign: 'center' }}>
        <h1 style={{ fontSize: 'var(--font-size-7)', marginBottom: 'var(--size-4)' }}>
          Welcome to Mastodon Client
        </h1>
        <p style={{ color: 'var(--text-2)', marginBottom: 'var(--size-6)', fontSize: 'var(--font-size-3)' }}>
          A minimal, performant social media frontend for Mastodon
        </p>
        <p style={{ color: 'var(--text-2)', marginBottom: 'var(--size-8)' }}>
          Sign in to start browsing your timeline, composing posts, and connecting with your community.
        </p>
        <Link
          href="/auth/signin"
          style={{
            display: 'inline-block',
            padding: 'var(--size-3) var(--size-6)',
            fontSize: 'var(--font-size-3)',
            fontWeight: 'var(--font-weight-6)',
            border: 'none',
            borderRadius: 'var(--radius-2)',
            background: 'var(--blue-6)',
            color: 'white',
            textDecoration: 'none',
          }}
        >
          Get Started
        </Link>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 style={{ fontSize: 'var(--font-size-6)', marginBottom: 'var(--size-4)' }}>
        Home Timeline
      </h1>
      <p style={{ color: 'var(--text-2)', marginBottom: 'var(--size-5)' }}>
        Connected to: <strong>{authStore.instanceURL?.replace('https://', '')}</strong>
      </p>
      <p style={{ color: 'var(--text-2)' }}>
        Timeline feed with infinite scroll will be displayed here once implemented.
      </p>
    </div>
  );
});

export default HomePage;
