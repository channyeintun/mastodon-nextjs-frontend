import { useRef } from 'react';
import { Upload, X } from 'lucide-react';
import { Button, IconButton, Card } from '@/components/atoms';
import type { Account } from '@/types';

interface ProfileImageUploaderProps {
  currentAccount: Account;
  avatarPreview: string | null;
  headerPreview: string | null;
  onAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onHeaderChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveHeader: () => void;
}

export function ProfileImageUploader({
  currentAccount,
  avatarPreview,
  headerPreview,
  onAvatarChange,
  onHeaderChange,
  onRemoveHeader,
}: ProfileImageUploaderProps) {
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const headerInputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <Card padding="none" style={{ marginBottom: 'var(--size-4)' }}>
        <div style={{ position: 'relative' }}>
          {/* Header Image */}
          <div
            style={{
              width: '100%',
              height: '200px',
              background: headerPreview
                ? `url(${headerPreview}) center/cover`
                : currentAccount.header
                  ? `url(${currentAccount.header}) center/cover`
                  : 'var(--surface-3)',
              borderRadius: 'var(--radius-2) var(--radius-2) 0 0',
              position: 'relative',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 'var(--size-3)',
                right: 'var(--size-3)',
                display: 'flex',
                gap: 'var(--size-2)',
              }}
            >
              <Button
                type="button"
                variant="secondary"
                size="small"
                onClick={() => headerInputRef.current?.click()}
              >
                <Upload size={16} />
                Upload Header
              </Button>
              {headerPreview && (
                <IconButton size="small" onClick={onRemoveHeader}>
                  <X size={16} />
                </IconButton>
              )}
            </div>
          </div>

          {/* Avatar */}
          <div
            style={{
              position: 'absolute',
              bottom: '-40px',
              left: 'var(--size-4)',
            }}
          >
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  background: avatarPreview
                    ? `url(${avatarPreview}) center/cover`
                    : currentAccount.avatar
                      ? `url(${currentAccount.avatar}) center/cover`
                      : 'var(--surface-3)',
                  border: '4px solid var(--surface-1)',
                }}
              />
              <Button
                type="button"
                variant="secondary"
                size="small"
                onClick={() => avatarInputRef.current?.click()}
                style={{
                  position: 'absolute',
                  bottom: '0',
                  right: '0',
                }}
              >
                <Upload size={14} />
              </Button>
            </div>
          </div>
        </div>

        <div style={{ padding: 'var(--size-4)', paddingTop: 'var(--size-8)' }} />
      </Card>

      {/* Hidden file inputs */}
      <input
        ref={avatarInputRef}
        type="file"
        accept="image/*"
        onChange={onAvatarChange}
        style={{ display: 'none' }}
      />
      <input
        ref={headerInputRef}
        type="file"
        accept="image/*"
        onChange={onHeaderChange}
        style={{ display: 'none' }}
      />
    </>
  );
}
