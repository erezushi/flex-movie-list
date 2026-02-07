import { Inter } from 'next/font/google';
import { Metadata } from 'next';
import StoreProvider from './components/StoreProvider';

import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    template: 'Flex Movie List - %s',
    default: 'Flex Movie List',
  },
  description: 'Flex Systems technical exam from Erez Bracha',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <StoreProvider>
        <body className={`${inter.variable}`}>{children}</body>
      </StoreProvider>
    </html>
  );
}

