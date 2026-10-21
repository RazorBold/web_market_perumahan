import React, { useState } from 'react';
import { ArrowUpRight, Award, Shield, Trees, Building2, CheckCircle2, X } from 'lucide-react';

export const ConceptSection: React.FC = () => {
  const [isDeveloperModalOpen, setIsDeveloperModalOpen] = useState(false);

  return (
    <section id="konsep" className="py-24 bg-[#f8f6f0] text-[#2b302c] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header matching mockup */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <span className="text-xs uppercase font-semibold tracking-[0.25em] text-[#a8743d] block">
            HYARTA ECOVILLAGE
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif-luxury font-bold text-[#1b3224]">
            Tumbuh Bersama Rumah Impianmu
          </h2>
          <div className="w-16 h-0.5 bg-[#c88242] mx-auto my-3" />
          <p className="text-[#596158] text-sm sm:text-base leading-relaxed">
            Kami percaya bahwa rumah bukan hanya sekedar tempat berlindung dan beristirahat. Rumah adalah tempat
            membangun kenangan bersama orang-orang yang Anda cintai.
          </p>
        </div>

        {/* 3-Photo Asymmetric Grid matching screenshot */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 mb-14">
          {/* Card 1: Main Neighborhood View (Col-span 6) */}
          <div className="md:col-span-6 rounded-3xl overflow-hidden shadow-lg border border-[#ded8cb] relative group min-h-[300px] sm:min-h-[380px]">
            <img
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
              alt="Kawasan Lingkungan Hyarta Ecovillage"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-6 flex flex-col justify-end text-white">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#d4a373]">
                Komunitas Berkelanjutan
              </span>
              <h3 className="text-xl font-serif-luxury font-bold">Keharmonisan Hunian & Alam Asri</h3>
              <p className="text-xs text-white/80 mt-1 line-clamp-2">
                Tata kelola lingkungan terpadu yang memadukan privasi keluarga dengan kehangatan interaksi tetangga.
              </p>
            </div>
          </div>

          {/* Card 2: Modern Tropical Clubhouse (Col-span 3) */}
          <div className="md:col-span-3 rounded-3xl overflow-hidden shadow-lg border border-[#ded8cb] relative group min-h-[300px] sm:min-h-[380px]">
            <img
              src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80"
              alt="Clubhouse & Pavilion"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-6 flex flex-col justify-end text-white">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#d4a373]">
                Arsitektur Tropis
              </span>
              <h3 className="text-lg font-serif-luxury font-bold">Desain Fasad Abadi</h3>
              <p className="text-xs text-white/80 mt-1">Material kayu ulin & batu alam lokal berkualitas tinggi.</p>
            </div>
          </div>

          {/* Card 3: 45% Lush Tree Canopy (Col-span 3) */}
          <div className="md:col-span-3 rounded-3xl overflow-hidden shadow-lg border border-[#ded8cb] relative group min-h-[300px] sm:min-h-[380px]">
            <img
              src="https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80"
              alt="Lahan Hijau & Hutan Konservasi"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-6 flex flex-col justify-end text-white">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#d4a373]">
                Zona Hijau 45%
              </span>
              <h3 className="text-lg font-serif-luxury font-bold">Kanopi Pohon Rindang</h3>
              <p className="text-xs text-white/80 mt-1">Suhu mikro kawasan 2-3°C lebih sejuk dari pusat kota.</p>
            </div>
          </div>
        </div>

        {/* Key Metrics Bar matching screenshot */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#ded8cc] shadow-md flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="grid grid-cols-3 gap-6 sm:gap-12 w-full lg:w-auto text-left">
            {/* Stat 1 */}
            <div className="space-y-1">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl sm:text-4xl font-serif-luxury font-bold text-[#1b3224]">5</span>
                <span className="text-xs sm:text-sm font-semibold text-[#80887e]">Hektar</span>
              </div>
              <p className="text-[11px] sm:text-xs text-[#596158] font-medium">Total Luas Masterplan</p>
            </div>

            {/* Stat 2 */}
            <div className="space-y-1 border-x border-[#eae4d7] px-4 sm:px-8">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl sm:text-4xl font-serif-luxury font-bold text-[#1b3224]">95</span>
                <span className="text-xs sm:text-sm font-semibold text-[#80887e]">Unit</span>
              </div>
              <p className="text-[11px] sm:text-xs text-[#596158] font-medium">Unit rumah dan ruko</p>
            </div>

            {/* Stat 3 */}
            <div className="space-y-1">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl sm:text-4xl font-serif-luxury font-bold text-[#c88242]">45%</span>
              </div>
              <p className="text-[11px] sm:text-xs text-[#596158] font-medium">Luas wilayah lahan hijau</p>
            </div>
          </div>

          {/* Button matching screenshot: "Lebih detail tentang developer" */}
          <button
            onClick={() => setIsDeveloperModalOpen(true)}
            className="w-full lg:w-auto px-6 py-3 rounded-full border border-[#c88242] text-[#c88242] hover:bg-[#c88242] hover:text-white transition-all text-xs font-semibold tracking-wider uppercase flex items-center justify-center gap-2 group"
          >
            Lebih detail tentang developer
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>

      {/* Developer Modal */}
      {isDeveloperModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#faf8f5] w-full max-w-2xl rounded-3xl border border-[#ded7ca] shadow-2xl p-6 sm:p-8 space-y-6 relative max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setIsDeveloperModalOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#ede6da] hover:bg-[#ded5c5] flex items-center justify-center text-[#2b302c]"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-2">
              <span className="text-xs uppercase font-semibold text-[#a8743d] tracking-widest flex items-center gap-1.5">
                <Building2 className="w-4 h-4" /> Rekam Jejak Pengembang Terpercaya
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-[#1b3224]">
                Tentang Developer Hyarta
              </h3>
            </div>

            <p className="text-sm text-[#50584f] leading-relaxed">
              Hyarta Ecovillage dikembangkan oleh konsorsium properti terkemuka yang berpengalaman lebih dari 3 dekade
              membangun kawasan hunian prestisius, resort bintang lima, dan ruang komersial terpadu di Yogyakarta, Bali,
              dan Jakarta.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white border border-[#e4ded2] space-y-1">
                <span className="text-xs font-bold text-[#1b3224] flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-[#c88242]" /> Legalitas Aman & Bersih
                </span>
                <p className="text-xs text-[#636c61]">
                  Sertifikat Hak Milik (SHM) sudah pecah per kavling & Izin Mendirikan Bangunan (PBG) lengkap.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-[#e4ded2] space-y-1">
                <span className="text-xs font-bold text-[#1b3224] flex items-center gap-1.5">
                  <Trees className="w-4 h-4 text-[#2e6f40]" /> Komitmen Hijau 45%
                </span>
                <p className="text-xs text-[#636c61]">
                  Area resapan air biopori, panel surya parsial, dan pohon konservasi yang dipelihara selamanya.
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setIsDeveloperModalOpen(false)}
                className="px-6 py-2.5 rounded-full bg-[#1b3224] text-white text-xs font-semibold hover:bg-[#284935]"
              >
                Tutup Informasi
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
