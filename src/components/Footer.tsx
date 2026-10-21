import React from 'react';
import { MapPin, Phone, Mail, Instagram, Facebook, Youtube, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#121c15] text-white pt-16 pb-12 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex flex-col items-start">
              <span className="text-2xl font-serif-luxury tracking-[0.2em] font-bold text-white">
                HYARTA
              </span>
              <span className="text-[10px] tracking-[0.35em] uppercase text-[#d4a373] font-light">
                ECOVILLAGE YOGYAKARTA
              </span>
            </div>
            <p className="text-xs text-[#a9b5ab] leading-relaxed">
              Kawasan hunian prestisius dengan perpaduan arsitektur modern tropis dan filosofi budaya Jawa,
              didedikasikan bagi keluarga yang menghargai kualitas hidup dan kelestarian alam.
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#c88242] flex items-center justify-center transition-colors text-white"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#c88242] flex items-center justify-center transition-colors text-white"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#c88242] flex items-center justify-center transition-colors text-white"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Nav Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#d4a373]">
              Navigasi Cepat
            </h4>
            <ul className="space-y-2 text-xs text-[#a9b5ab]">
              <li>
                <a href="#home" className="hover:text-white transition-colors">
                  Beranda
                </a>
              </li>
              <li>
                <a href="#konsep" className="hover:text-white transition-colors">
                  Konsep Eco-Living
                </a>
              </li>
              <li>
                <a href="#denah-lokasi" className="hover:text-white transition-colors">
                  Denah Masterplan & Kavling
                </a>
              </li>
              <li>
                <a href="#tipe-rumah" className="hover:text-white transition-colors">
                  Pilihan Tipe Rumah (115, 125, 145)
                </a>
              </li>
              <li>
                <a href="#fasilitas" className="hover:text-white transition-colors">
                  Area Serbaguna Joglo
                </a>
              </li>
              <li>
                <a href="#video-tour" className="hover:text-white transition-colors">
                  Tur Video Sinematik 4K
                </a>
              </li>
            </ul>
          </div>

          {/* Unit Specifications */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#d4a373]">
              Pilihan Hunian
            </h4>
            <ul className="space-y-2 text-xs text-[#a9b5ab]">
              <li>
                <span className="text-white font-medium">Townhouse 115</span> — Mulai Rp 2,15 M
              </li>
              <li>
                <span className="text-white font-medium">Townhouse 125</span> — Mulai Rp 2,68 M
              </li>
              <li>
                <span className="text-white font-medium">Townhouse 145</span> — Mulai Rp 3,35 M
              </li>
              <li>
                <span className="text-white font-medium">Ruko Boulevard</span> — Mulai Rp 3,85 M
              </li>
              <li className="pt-2 text-[11px] text-[#78887b]">
                Sertifikat Hak Milik (SHM) & Izin Bangunan Lengkap
              </li>
            </ul>
          </div>

          {/* Marketing Gallery Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#d4a373]">
              Marketing Gallery
            </h4>
            <div className="space-y-2 text-xs text-[#a9b5ab]">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#c88242] shrink-0 mt-0.5" />
                <span>Jl. Solo Km. 10, Maguwoharjo, Depok, Sleman, D.I. Yogyakarta 55282</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#c88242] shrink-0" />
                <span>+62 274 488 900 / +62 812-3456-7890</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#c88242] shrink-0" />
                <span>info@hyarta-ecovillage.com</span>
              </p>
            </div>
            <div className="pt-2">
              <span className="text-[11px] text-[#d4a373] block font-semibold">Jam Operasional Show Unit:</span>
              <span className="text-[11px] text-[#8ea090]">Setiap Hari: 08.30 - 17.30 WIB</span>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#707e72] gap-4">
          <p>© {new Date().getFullYear()} Hyarta Ecovillage Yogyakarta. All rights reserved.</p>
          <p className="flex items-center gap-1">
            <span>Harmonisasi Arsitektur & Alam Nusantara</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
