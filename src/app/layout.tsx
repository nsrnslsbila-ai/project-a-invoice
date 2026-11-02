import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'PROJECT-A • One-stop creative solution • Invoice Management',
  description: 'Manage. Create. Grow. Sistem invoice, omzet tracking & follow-up tagihan terintegrasi untuk PROJECT-A.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="dark">
      <body className={`${inter.className} min-h-screen bg-[#171717] text-zinc-100 antialiased selection:bg-[#FF6B00] selection:text-zinc-950`}>
        {children}
      </body>
    </html>
  );
}
