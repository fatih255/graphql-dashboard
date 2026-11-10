import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Popup campaigns",
  description: "A small Next.js and GraphQL dashboard for managing popup campaigns.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen font-sans antialiased">
        <Providers>
          <header className="border-b border-slate-200 bg-white">
            <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
              <Link href="/" className="text-sm font-semibold text-slate-900">
                Popup campaigns
              </Link>
              <span className="text-xs text-slate-500">Demo workspace</span>
            </div>
          </header>
          <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
