'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { HOUSE_MODELS, HouseModel } from '../data/propertyData';
import { formatRupiah, PropertyUnit } from '../utils/propertyLogic';
import {
  Home,
  Maximize,
  Compass,
  Bath,
  Bed,
  Car,
  Zap,
  Droplet,
  Calculator,
  CheckCircle,
  FileText,
  ChevronRight,
  Box,
} from 'lucide-react';
import { whatsappLink } from '../config/contact';

interface HouseTypeSectionProps {
  onOpenKpr: (unit: Partial<PropertyUnit>) => void;
  onExplore3D?: (modelName: string) => void;
}

export const HouseTypeSection: React.FC<HouseTypeSectionProps> = ({
  onOpenKpr,
  onExplore3D,
}) => {
  const [activeModelId, setActiveModelId] = useState<string>('townhouse-115');
  const [viewMode, setViewMode] = useState<'photo' | 'floorplan'>('photo');
  const [activeFloorLevel, setActiveFloorLevel] = useState<'l1' | 'l2'>('l1');

  const currentModel: HouseModel =
    HOUSE_MODELS.find((m) => m.id === activeModelId) || HOUSE_MODELS[0];

  return (
    <section id="tipe-rumah" className="py-24 bg-[#faf8f5] text-[#2b302c] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs uppercase font-semibold tracking-widest text-[#a8743d] block mb-2">
            TIPE RUMAH EKSKLUSIF
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif-luxury font-bold text-[#1a2e22]">
            Pilihan Rumah Terbaik Untuk Anda
          </h2>
          <div className="w-16 h-0.5 bg-[#c88242] mx-auto mt-4 mb-4" />
          <p className="text-[#5f675e] text-sm sm:text-base leading-relaxed">
            Setiap unit dirancang dengan detail arsitektur tropis adiluhung, mengoptimalkan sirkulasi udara alami dan
            pencahayaan matahari melimpah demi kesejahteraan keluarga.
          </p>

          {/* Model Selection Tabs */}
          <div className="flex justify-center items-center gap-2 sm:gap-4 mt-8 flex-wrap">
            {HOUSE_MODELS.map((model) => {
              const isActive = model.id === activeModelId;
              return (
                <button
                  key={model.id}
                  onClick={() => {
                    setActiveModelId(model.id);
                    setViewMode('photo');
                  }}
                  className={`px-6 py-2.5 rounded-full text-sm font-semibold tracking-wide transition-all ${
                    isActive
                      ? 'bg-[#1b3224] text-white shadow-lg shadow-[#1b3224]/20 scale-105'
                      : 'bg-white hover:bg-[#eae5da] text-[#4a524b] border border-[#ded8cb]'
                  }`}
                >
                  {model.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Active House Model Showcase Card */}
        <div className="bg-white rounded-3xl border border-[#ded7ca] shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-0">
          {/* Left Column: Visual Media (Photo / Floorplan / 3D trigger) */}
          <div className="lg:col-span-7 relative bg-[#1c251f] min-h-[380px] sm:min-h-[460px] flex flex-col justify-between p-6 overflow-hidden">
            {/* View Mode Switcher Pills */}
            <div className="relative z-10 flex items-center gap-2 self-start bg-black/50 backdrop-blur-md p-1.5 rounded-2xl border border-white/10 text-xs">
              <button
                onClick={() => setViewMode('photo')}
                className={`px-3 py-1.5 rounded-xl font-medium transition-colors ${
                  viewMode === 'photo' ? 'bg-[#d4a373] text-[#131a15] font-semibold' : 'text-white/70 hover:text-white'
                }`}
              >
                Fasad Eksterior
              </button>
              <button
                onClick={() => setViewMode('floorplan')}
                className={`px-3 py-1.5 rounded-xl font-medium transition-colors ${
                  viewMode === 'floorplan' ? 'bg-[#d4a373] text-[#131a15] font-semibold' : 'text-white/70 hover:text-white'
                }`}
              >
                Denah Ruang (Floor Plan)
              </button>
              {onExplore3D && (
                <button
                  onClick={() => onExplore3D(currentModel.name)}
                  className="px-3 py-1.5 rounded-xl font-medium text-[#d4a373] hover:text-white flex items-center gap-1 transition-colors"
                >
                  <Box className="w-3.5 h-3.5" /> Eksplor 3D
                </button>
              )}
            </div>

            {/* Media Content */}
            <div className="absolute inset-0 z-0">
              {viewMode === 'photo' ? (
                <>
                  <Image
                    src={currentModel.image}
                    alt={currentModel.name}
                    className="object-cover transition-transform duration-700 hover:scale-105"
                    fill
                    sizes="(min-width: 1024px) 60vw, 100vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                </>
              ) : (
                <div className="w-full h-full bg-[#1b261f] p-8 flex flex-col items-center justify-center text-white text-center">
                  {/* Floor Level Toggle */}
                  <div className="flex gap-2 mb-6">
                    <button
                      onClick={() => setActiveFloorLevel('l1')}
                      className={`px-4 py-1.5 rounded-lg text-xs font-semibold ${
                        activeFloorLevel === 'l1' ? 'bg-[#c88242] text-white' : 'bg-white/10 text-white/70'
                      }`}
                    >
                      Denah Lantai 1
                    </button>
                    <button
                      onClick={() => setActiveFloorLevel('l2')}
                      className={`px-4 py-1.5 rounded-lg text-xs font-semibold ${
                        activeFloorLevel === 'l2' ? 'bg-[#c88242] text-white' : 'bg-white/10 text-white/70'
                      }`}
                    >
                      Denah Lantai 2
                    </button>
                  </div>

                  {/* Floor Plan Diagram Blueprint Representation */}
                  <div className="w-full max-w-md bg-[#243328] p-6 rounded-2xl border-2 border-dashed border-[#d4a373]/50 text-left space-y-4">
                    <div className="flex items-center justify-between border-b border-white/15 pb-2">
                      <span className="font-bold text-[#d4a373] text-sm uppercase tracking-wide">
                        {activeFloorLevel === 'l1' ? 'Denah Dasar (Lantai 1)' : 'Denah Atas (Lantai 2)'}
                      </span>
                      <span className="text-xs text-white/60">Skala 1:100</span>
                    </div>
                    <p className="text-xs text-white/90 leading-relaxed font-mono">
                      {activeFloorLevel === 'l1' ? currentModel.floorPlanL1 : currentModel.floorPlanL2}
                    </p>
                    <div className="text-[11px] text-[#a3cfbb] bg-white/5 p-2 rounded-lg">
                      💡 Dilengkapi ventilasi silang (cross-ventilation) & inner courtyard terbuka ke langit.
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Tagline on Image */}
            <div className="relative z-10">
              <span className="inline-block px-3 py-1 rounded-full bg-[#c88242] text-white text-xs font-semibold uppercase tracking-wider mb-2">
                Desain Tropis Modern
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-white">
                {currentModel.name}
              </h3>
              <p className="text-sm text-white/80 max-w-md mt-1">{currentModel.tagline}</p>
            </div>
          </div>

          {/* Right Column: Specs & Features */}
          <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div>
              <p className="text-sm text-[#4f574e] leading-relaxed mb-6">{currentModel.description}</p>

              {/* 4 Main Spec Cards matching screenshot */}
              <div className="grid grid-cols-2 gap-3.5 mb-6">
                <div className="p-3.5 rounded-2xl bg-[#f5f1e8] border border-[#e4ded2] flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#1b3224] text-[#d4a373] flex items-center justify-center shrink-0">
                    <Maximize className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] text-[#71786f] uppercase block font-medium">Luas Tanah</span>
                    <span className="text-base font-bold text-[#1b3224]">{currentModel.landArea} m²</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#f5f1e8] border border-[#e4ded2] flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#1b3224] text-[#d4a373] flex items-center justify-center shrink-0">
                    <Home className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] text-[#71786f] uppercase block font-medium">Luas Bangunan</span>
                    <span className="text-base font-bold text-[#1b3224]">{currentModel.buildingArea} m²</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#f5f1e8] border border-[#e4ded2] flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#1b3224] text-[#d4a373] flex items-center justify-center shrink-0">
                    <Bed className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] text-[#71786f] uppercase block font-medium">Kamar Tidur</span>
                    <span className="text-base font-bold text-[#1b3224]">
                      {currentModel.bedrooms}+{currentModel.bedroomsPlus}
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#f5f1e8] border border-[#e4ded2] flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#1b3224] text-[#d4a373] flex items-center justify-center shrink-0">
                    <Bath className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] text-[#71786f] uppercase block font-medium">Kamar Mandi</span>
                    <span className="text-base font-bold text-[#1b3224]">
                      {currentModel.bathrooms}+{currentModel.bathroomsPlus}
                    </span>
                  </div>
                </div>
              </div>

              {/* Utility Specs */}
              <div className="flex items-center justify-between text-xs text-[#636c61] py-2 border-y border-[#e6dfd3] mb-6">
                <span className="flex items-center gap-1.5">
                  <Car className="w-4 h-4 text-[#c88242]" /> {currentModel.carports} Carport Mobil
                </span>
                <span className="flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-[#c88242]" /> {currentModel.electricity}
                </span>
                <span className="flex items-center gap-1.5">
                  <Droplet className="w-4 h-4 text-[#c88242]" /> {currentModel.water.split('&')[0]}
                </span>
              </div>

              {/* Features list */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-[#1a2e22] uppercase tracking-wider block">
                  Keunggulan Spesifikasi:
                </span>
                <ul className="space-y-1.5 text-xs text-[#4e564d]">
                  {currentModel.features.map((feat, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Price & Action Buttons */}
            <div className="pt-4 border-t border-[#e8e2d6] space-y-4">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-xs text-[#7e857c] block">Harga Mulai Dari</span>
                  <span className="text-2xl sm:text-3xl font-serif-luxury font-bold text-[#1b3224]">
                    {formatRupiah(currentModel.price)}
                  </span>
                </div>
                <span className="text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full font-semibold border border-emerald-200">
                  SHM Ready
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() =>
                    onOpenKpr({
                      name: currentModel.name,
                      type: currentModel.name as any,
                      price: currentModel.price,
                      bedrooms: currentModel.bedrooms,
                      bathrooms: currentModel.bathrooms,
                      landArea: currentModel.landArea,
                      buildingArea: currentModel.buildingArea,
                    })
                  }
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-[#1b3224] text-white hover:bg-[#274734] text-xs font-semibold tracking-wide transition-all shadow-md"
                >
                  <Calculator className="w-4 h-4 text-[#d4a373]" /> Simulasi KPR
                </button>

                <a
                  href={whatsappLink(
                    `Halo Hyarta Ecovillage, saya ingin menanyakan ketersediaan ${currentModel.name} dan mengunduh e-brochure lengkap.`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-[#c88242] text-white hover:bg-[#b07137] text-xs font-semibold tracking-wide transition-all shadow-md"
                >
                  <FileText className="w-4 h-4" /> Unduh Brosur
                </a>
              </div>

              <Link
                href={`/tipe/${currentModel.id}`}
                className="flex items-center justify-center gap-1.5 text-sm font-semibold text-[#1b3224] hover:text-[#c88242] transition-colors"
              >
                Lihat detail lengkap {currentModel.name} <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
