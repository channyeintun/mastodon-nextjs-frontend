import { Card } from '@/components/atoms';

export function ProfileEditorSkeleton() {
  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', padding: 'var(--size-4)' }}>
      {/* Header Skeleton */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--size-3)',
          marginBottom: 'var(--size-5)',
        }}
      >
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: 'var(--radius-2)',
            background: 'var(--surface-3)',
            animation: 'var(--animation-blink)',
          }}
        />
        <div
          style={{
            width: '120px',
            height: '28px',
            borderRadius: 'var(--radius-2)',
            background: 'var(--surface-3)',
            animation: 'var(--animation-blink)',
          }}
        />
      </div>

      {/* Header Image & Avatar Skeleton */}
      <Card padding="none" style={{ marginBottom: 'var(--size-4)' }}>
        <div
          style={{
            width: '100%',
            height: '200px',
            background: 'var(--surface-3)',
            animation: 'var(--animation-blink)',
            borderRadius: 'var(--radius-2) var(--radius-2) 0 0',
            position: 'relative',
          }}
        >
          <div
            style={{
              position: 'absolute',
              bottom: '-40px',
              left: 'var(--size-4)',
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              background: 'var(--surface-3)',
              border: '4px solid var(--surface-1)',
              animation: 'var(--animation-blink)',
            }}
          />
        </div>
        <div style={{ padding: 'var(--size-4)', paddingTop: 'var(--size-8)' }} />
      </Card>

      {/* Profile Fields Skeleton */}
      <Card padding="medium" style={{ marginBottom: 'var(--size-4)' }}>
        <div
          style={{
            width: '150px',
            height: '24px',
            borderRadius: 'var(--radius-2)',
            background: 'var(--surface-3)',
            animation: 'var(--animation-blink)',
            marginBottom: 'var(--size-4)',
          }}
        />
        <div style={{ marginBottom: 'var(--size-4)' }}>
          <div
            style={{
              width: '100px',
              height: '16px',
              borderRadius: 'var(--radius-2)',
              background: 'var(--surface-3)',
              animation: 'var(--animation-blink)',
              marginBottom: 'var(--size-2)',
            }}
          />
          <div
            style={{
              width: '100%',
              height: '40px',
              borderRadius: 'var(--radius-2)',
              background: 'var(--surface-3)',
              animation: 'var(--animation-blink)',
            }}
          />
        </div>
        <div>
          <div
            style={{
              width: '80px',
              height: '16px',
              borderRadius: 'var(--radius-2)',
              background: 'var(--surface-3)',
              animation: 'var(--animation-blink)',
              marginBottom: 'var(--size-2)',
            }}
          />
          <div
            style={{
              width: '100%',
              height: '80px',
              borderRadius: 'var(--radius-2)',
              background: 'var(--surface-3)',
              animation: 'var(--animation-blink)',
            }}
          />
        </div>
      </Card>

      {/* Extra Fields Skeleton */}
      <Card padding="medium" style={{ marginBottom: 'var(--size-4)' }}>
        <div
          style={{
            width: '120px',
            height: '24px',
            borderRadius: 'var(--radius-2)',
            background: 'var(--surface-3)',
            animation: 'var(--animation-blink)',
            marginBottom: 'var(--size-4)',
          }}
        />
        {[1, 2].map((i) => (
          <div
            key={i}
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 'var(--size-2)',
              marginBottom: 'var(--size-3)',
            }}
          >
            <div
              style={{
                height: '40px',
                borderRadius: 'var(--radius-2)',
                background: 'var(--surface-3)',
                animation: 'var(--animation-blink)',
              }}
            />
            <div
              style={{
                height: '40px',
                borderRadius: 'var(--radius-2)',
                background: 'var(--surface-3)',
                animation: 'var(--animation-blink)',
              }}
            />
          </div>
        ))}
      </Card>

      {/* Action Buttons Skeleton */}
      <div
        style={{
          display: 'flex',
          gap: 'var(--size-3)',
          justifyContent: 'flex-end',
        }}
      >
        <div
          style={{
            width: '80px',
            height: '40px',
            borderRadius: 'var(--radius-2)',
            background: 'var(--surface-3)',
            animation: 'var(--animation-blink)',
          }}
        />
        <div
          style={{
            width: '120px',
            height: '40px',
            borderRadius: 'var(--radius-2)',
            background: 'var(--surface-3)',
            animation: 'var(--animation-blink)',
          }}
        />
      </div>
    </div>
  );
}
