import { Inter } from 'next/font/google';
import './globals.css';
import { Metadata } from 'next';

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
      <body className={`${inter.variable}`}>{children}</body>
    </html>
  );
}

