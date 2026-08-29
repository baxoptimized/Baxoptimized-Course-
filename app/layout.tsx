import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Baxoptimized Course",
  description: "Premium online training platform",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <head>
        {/* Clash Display — matches the checkout site's heading face. Loaded
            from Fontshare (no Next.js self-host support for it); falls back
            to Inter/system-ui via --font-display if the request fails. */}
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=clash-display@500,600,700&display=swap"
        />
      </head>
      <body className="min-h-full flex flex-col bg-navy-950 text-text-primary antialiased">
        {children}
      </body>
    </html>
  );
}
