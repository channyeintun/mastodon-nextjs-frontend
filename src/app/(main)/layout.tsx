'use client';

import { ViewTransition } from 'react';
import NavigationWrapper from '@/components/organisms/NavigationWrapper';
import { ScrollRestorationProvider } from '@/components/providers/ScrollRestorationProvider';
import { StreamingProvider } from '@/components/providers/StreamingProvider';
import { GlobalModalProvider } from '@/contexts/GlobalModalContext';
import { AuthModalBridge } from '@/components/molecules';
import { useDocumentTitleNotification } from '@/hooks/useDocumentTitleNotification';

export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Update document title with notification count when tab is not visible
    useDocumentTitleNotification();

    return (
        <StreamingProvider>
            <GlobalModalProvider>
                <ScrollRestorationProvider />
                <NavigationWrapper />
                <ViewTransition name="page-content">
                    <main id="main-content">
                        {children}
                    </main>
                </ViewTransition>
                <AuthModalBridge />
            </GlobalModalProvider>
        </StreamingProvider>
    );
}
