import type { Metadata } from 'next';
import { Source_Sans_3 } from 'next/font/google';
import './globals.css';

const font = Source_Sans_3({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Lantern | Work at a YC Startup Demo',
  description: 'Demo of Lantern vector search using YC Startup Jobs',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body className={font.className}>{children}</body>
    </html>
  );
}
