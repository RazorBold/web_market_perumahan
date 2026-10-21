/**
 * Canonical site URL used for metadata, sitemap and Open Graph links.
 * Set NEXT_PUBLIC_SITE_URL once a custom domain is attached; on Vercel it falls back to the production domain.
 */
export const SITE_URL: string =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'http://localhost:3000');

export const SITE_NAME = 'Hyarta Ecovillage';

export const SITE_DESCRIPTION =
  'Hyarta Ecovillage menghadirkan hunian berkelas di Yogyakarta yang mengusung konsep eco-living modern dengan 45% lahan hijau asri.';

export const SITE_OG_IMAGE =
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&h=630&q=80';
