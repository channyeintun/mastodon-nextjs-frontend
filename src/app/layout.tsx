import type { Metadata } from "next";
import { cookies } from "next/headers";
import { ViewTransition } from "react";
import "./globals.css";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { StoreProvider } from "@/components/providers/StoreProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { ScrollRestorationProvider } from "@/components/providers/ScrollRestorationProvider";
import { StreamingProvider } from "@/components/providers/StreamingProvider";
import { AuthModal } from "@/components/molecules";
import NavigationWrapper from "@/components/organisms/NavigationWrapper";
import { GlobalModalProvider } from "@/contexts/GlobalModalContext";

export const metadata: Metadata = {
  title: "Mastodon",
  description: "A minimal, performant social media frontend for Mastodon",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Read auth and UI cookies on server for hydration
  const cookieStore = await cookies();
  const instanceURL = cookieStore.get('instanceURL')?.value ?? null;
  const accessToken = cookieStore.get('accessToken')?.value ?? null;
  const clientId = cookieStore.get('clientId')?.value ?? null;
  const clientSecret = cookieStore.get('clientSecret')?.value ?? null;
  const theme = cookieStore.get('theme')?.value as 'light' | 'dark' | 'auto' | undefined;

  // For SSR: only set data-theme if user explicitly chose light or dark
  // If auto or undefined, let client handle it to avoid forcing wrong default
  const dataTheme = theme === 'light' || theme === 'dark' ? theme : undefined;

  const initialState = {
    auth: {
      instanceURL,
      accessToken,
      clientId,
      clientSecret,
    },
  };

  return (
    <html lang="en" data-theme={dataTheme}>
      <body>
        <QueryProvider>
          <StoreProvider initialState={initialState}>
            <ThemeProvider />
            <StreamingProvider>
              <GlobalModalProvider>
                <ScrollRestorationProvider />
                <NavigationWrapper />
                <ViewTransition name="page-content">
                  {children}
                </ViewTransition>
                <AuthModal />
              </GlobalModalProvider>
            </StreamingProvider>
          </StoreProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
