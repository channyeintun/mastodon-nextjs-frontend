import type { Metadata } from "next";
import "./globals.css";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { StoreProvider } from "@/components/providers/StoreProvider";
import Header from "@/components/organisms/Header";

export const metadata: Metadata = {
  title: "Mastodon Client",
  description: "A minimal, performant social media frontend for Mastodon",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <StoreProvider>
          <QueryProvider>
            <Header />
            {children}
          </QueryProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
