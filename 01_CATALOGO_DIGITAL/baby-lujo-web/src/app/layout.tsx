import type { Metadata, Viewport } from 'next';
import { Marcellus, Jost, Cormorant_Infant } from 'next/font/google';
import './globals.css';

const marcellus = Marcellus({ variable: '--font-marcellus', subsets: ['latin'], weight: '400' });
const jost = Jost({ variable: '--font-jost', subsets: ['latin'] });
const cormorant = Cormorant_Infant({ variable: '--font-cormorant', subsets: ['latin'], weight: ['400', '500'], style: ['italic', 'normal'] });

const sitio = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(sitio),
  title: { default: 'BABY LUJO · Colección', template: '%s · BABY LUJO' },
  description: 'Moda infantil de lujo by Joaquín RP. Delicadeza, elegancia y exclusividad desde los primeros momentos.',
  openGraph: {
    type: 'website',
    locale: 'es_CO',
    siteName: 'BABY LUJO',
    title: 'BABY LUJO · Colección',
    description: 'Delicadeza, elegancia y exclusividad desde los primeros momentos.',
    images: [{ url: '/og.jpg', width: 1200, height: 630, alt: 'BABY LUJO by Joaquín RP' }],
  },
  twitter: { card: 'summary_large_image', images: ['/og.jpg'] },
};

export const viewport: Viewport = { themeColor: '#F5EFE6' };

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="es" className={`${marcellus.variable} ${jost.variable} ${cormorant.variable} antialiased`}>
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
