'use client';

import { observer } from 'mobx-react-lite';
import { useAuthStore } from '@/hooks/useStores';
import Navigation from '@/components/molecules/Navigation';
import { useCurrentAccount } from '@/api/queries';

const NavigationWrapper = observer(() => {
  const authStore = useAuthStore();
  const { data: user } = useCurrentAccount();

  return (
    <Navigation
      isAuthenticated={authStore.isAuthenticated}
      instanceURL={authStore.instanceURL}
      user={user ?? null}
    />
  );
});

export default NavigationWrapper;
