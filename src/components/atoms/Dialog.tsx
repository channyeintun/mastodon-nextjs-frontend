import { type ReactNode, useEffect } from 'react';

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  maxWidth?: string;
}

export function Dialog({
  isOpen,
  onClose,
  children,
  maxWidth = '600px',
}: DialogProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: 'var(--size-4)',
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: 'var(--surface-1)',
          borderRadius: 'var(--radius-3)',
          maxWidth,
          width: '100%',
          maxHeight: '90vh',
          overflow: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

export function DialogHeader({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        padding: 'var(--size-4)',
        borderBottom: '1px solid var(--surface-3)',
      }}
    >
      <h2
        style={{
          margin: 0,
          fontSize: 'var(--font-size-3)',
          fontWeight: 600,
        }}
      >
        {children}
      </h2>
    </div>
  );
}

export function DialogBody({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        padding: 'var(--size-4)',
      }}
    >
      {children}
    </div>
  );
}

export function DialogFooter({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        padding: 'var(--size-4)',
        borderTop: '1px solid var(--surface-3)',
        display: 'flex',
        gap: 'var(--size-3)',
        justifyContent: 'flex-end',
      }}
    >
      {children}
    </div>
  );
}
