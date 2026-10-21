'use client';

import dynamic from 'next/dynamic';
import { Box } from 'lucide-react';

/**
 * Three.js needs WebGL and `window`, so the viewer is loaded only in the browser and in its own chunk.
 * The placeholder keeps the same footprint so the page does not jump when the scene arrives.
 */
export const ThreeHouseViewer = dynamic(
  () => import('./ThreeHouseViewer').then((m) => m.ThreeHouseViewer),
  {
    ssr: false,
    loading: () => (
      <div className="relative rounded-3xl overflow-hidden border border-[#d6ccb8]/60 shadow-2xl bg-[#131a15] w-full h-[520px] md:h-[620px] flex flex-col items-center justify-center gap-3 text-[#a2b3a3]">
        <Box className="w-8 h-8 text-[#d4a373] animate-pulse" />
        <span className="text-xs tracking-wide">Memuat model 3D…</span>
      </div>
    ),
  }
);
