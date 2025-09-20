import { ReactNode } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'White Label Supermarket',
  description: 'Your friendly neighborhood grocery shop',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground h-full`}
      >
        <header className="w-full border-b border-emerald-100 bg-white/80 backdrop-blur shadow-sm sticky top-0 z-10">
          <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/logo.svg"
                alt="Supermarket logo"
                width={120}
                height={32}
                priority
              />
            </Link>
            <Link
              href="/checkout"
              className="inline-flex items-center gap-2 rounded-md bg-emerald-600 text-white px-4 py-2 text-sm font-medium shadow-sm hover:bg-emerald-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors duration-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-5"
              >
                <path d="M2.25 3a.75.75 0 000 1.5h1.18l2.68 10.06A2.25 2.25 0 008.28 16.5h8.97a2.25 2.25 0 002.16-1.62l1.8-6.3A.75.75 0 0020.5 7.5H6.6L5.97 5.1A2.25 2.25 0 003.43 3.75H2.25zM9 20.25a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm9 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
              </svg>
              Cart
            </Link>
          </div>
        </header>
        <main className="w-full max-w-5xl mx-auto px-4 py-6">{children}</main>
      </body>
    </html>
  );
}
