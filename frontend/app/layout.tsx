import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import ToastProvider from '@/components/notifications/ToastProvider';
import KeyboardShortcuts from '@/components/shortcuts/KeyboardShortcuts';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'DevPulse | Developer Productivity Platform',
  description: 'Track coding sessions, log insights, visualize progress',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} antialiased`}>
        <ToastProvider />
        <KeyboardShortcuts />
        <Header />
        {children}
      </body>
    </html>
  );
}
