import type { Metadata, Viewport } from 'next';
import { Cinzel, Gantari, Playfair_Display } from 'next/font/google';
import { SITE_DESCRIPTION, SITE_NAME, SITE_OG_IMAGE, SITE_URL } from '../config/site';
import './globals.css';

const gantari = Gantari({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-gantari',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
  display: 'swap',
});

const cinzel = Cinzel({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-cinzel',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | A Home That Grows With You`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    siteName: SITE_NAME,
    title: `${SITE_NAME} | A Home That Grows With You`,
    description: 'Hunian eksklusif tropis modern di Yogyakarta dengan fasilitas lengkap dan lingkungan ramah keluarga.',
    images: [{ url: SITE_OG_IMAGE, width: 1200, height: 630, alt: SITE_NAME }],
  },
  twitter: { card: 'summary_large_image' },
};

export const viewport: Viewport = {
  themeColor: '#1b3224',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${gantari.variable} ${playfair.variable} ${cinzel.variable}`}>
      <body>{children}</body>
    </html>
  );
}
