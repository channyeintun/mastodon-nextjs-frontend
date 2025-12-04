'use client';

import { type ReactNode } from 'react';
import { getRootStore } from '@/stores/rootStore';
import { StoreContext } from '@/hooks/useStores';

export function StoreProvider({ children }: { children: ReactNode }) {
  const rootStore = getRootStore();

  return (
    <StoreContext.Provider value={rootStore}>
      {children}
    </StoreContext.Provider>
  );
}
