import React from "react";
import "@/lib/ag-grid-config";
import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Trinity Energy - Production Monitoring",
  description: "Oil & Gas Production Monitoring and Analytics Platform",
  generator: "Trinity app",
  keywords: [
    "oil and gas",
    "production monitoring",
    "well monitoring",
    "energy analytics",
    "Trinity Energy",
  ],
  authors: [{ name: "Trinity Energy" }],
  creator: "Trinity Energy",
  publisher: "Trinity Energy",
  robots: {
    index: false,
    follow: false,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0e1a" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
