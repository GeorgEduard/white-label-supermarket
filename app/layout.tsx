import { ReactNode } from 'react';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Menu from '@/app/components/Menu';
import { ProductProvider } from '@/app/context/ProductProvider';

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
        <ProductProvider>
          <header className="w-full border-b border-emerald-100 bg-white/80 backdrop-blur shadow-sm sticky top-0 z-10">
            <Menu />
          </header>
          <main className="w-full max-w-5xl mx-auto px-4 py-6">{children}</main>
        </ProductProvider>
      </body>
    </html>
  );
}
