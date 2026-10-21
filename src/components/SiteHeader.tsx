import Link from 'next/link';
import { Phone } from 'lucide-react';
import { whatsappLink } from '../config/contact';

/**
 * Header for sub-pages (articles, house types). Mirrors the home Navbar in its scrolled state,
 * with links that route back into the home page sections.
 */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 bg-[#faf8f5]/90 backdrop-blur-md border-b border-[#e2dcd0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
        <Link href="/" className="flex flex-col items-start" aria-label="Hyarta Ecovillage, ke beranda">
          <span className="flex items-center gap-1.5">
            <span className="text-xl sm:text-2xl font-serif-luxury tracking-[0.2em] font-bold text-[#1b3224]">HYARTA</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#c88242]" />
          </span>
          <span className="text-[9px] tracking-[0.3em] uppercase font-light text-[#6d756c]">Ecovillage Yogyakarta</span>
        </Link>

        <nav className="flex items-center gap-5 sm:gap-7">
          <Link href="/#tipe-rumah" className="hidden sm:inline text-sm font-medium text-[#3d453f] hover:text-[#c88242] transition-colors">
            Tipe rumah
          </Link>
          <Link href="/#denah-lokasi" className="hidden md:inline text-sm font-medium text-[#3d453f] hover:text-[#c88242] transition-colors">
            Denah kawasan
          </Link>
          <Link href="/#artikel" className="hidden sm:inline text-sm font-medium text-[#3d453f] hover:text-[#c88242] transition-colors">
            Artikel
          </Link>
          <a
            href={whatsappLink('Halo Hyarta Ecovillage, saya tertarik untuk jadwalkan visit dan konsultasi unit.')}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 sm:px-5 py-2 rounded-full bg-[#c88242] hover:bg-[#b07137] text-white text-xs font-semibold tracking-wide transition-colors"
          >
            <Phone className="w-3.5 h-3.5" /> Jadwalkan visit
          </a>
        </nav>
      </div>
    </header>
  );
}
