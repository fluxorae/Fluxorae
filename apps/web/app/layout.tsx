import type { Metadata } from 'next';
import { Cormorant_Garamond, Space_Grotesk } from 'next/font/google';
import './globals.css';

const heading = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-heading',
  weight: ['600', '700'],
});

const body = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['400', '500', '600'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://fluxorae.com'),
  title: 'Fluxorae | ERP + Growth Platform',
  description:
    'Fluxorae combines CRM, HR, projects, finance, and support in one secure operating platform.',
  applicationName: 'Fluxorae OS',
  openGraph: {
    title: 'Fluxorae ERP',
    description:
      'A secure operations platform for CRM, HR, projects, finance, and support.',
    url: 'https://fluxorae.com',
    siteName: 'Fluxorae',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fluxorae ERP',
    description:
      'A secure operations platform for CRM, HR, projects, finance, and support.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${heading.variable} ${body.variable}`}>{children}</body>
    </html>
  );
}
