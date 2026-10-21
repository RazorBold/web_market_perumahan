import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    // Placeholder photography is served from Unsplash until real project photos are added to /public
    // Object form: `search` is left unset so Unsplash's sizing query (?auto=format&w=…) is allowed
    remotePatterns: [{ protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' }],
    qualities: [75],
  },
};

export default nextConfig;
