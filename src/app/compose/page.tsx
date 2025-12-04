'use client';

import AuthGuard from '@/components/organisms/AuthGuard';

export default function ComposePage() {
  return (
    <AuthGuard>
      <div className="container">
        <h1 style={{ fontSize: 'var(--font-size-5)', marginBottom: 'var(--size-4)' }}>
          Compose Post
        </h1>
        <p style={{ color: 'var(--text-2)' }}>
          Tiptap editor will be integrated here.
        </p>
      </div>
    </AuthGuard>
  );
}
