'use client';

import React, { useState } from 'react';
import { Navbar } from './Navbar';
import { HeroSection } from './HeroSection';
import { ConceptSection } from './ConceptSection';
import { MasterplanViewer } from './MasterplanViewer';
import { HouseTypeSection } from './HouseTypeSection';
import { FacilitySection } from './FacilitySection';
import { VideoWalkthrough } from './VideoWalkthrough';
import { ArticlesSection } from './ArticlesSection';
import { LocationSection } from './LocationSection';
import { Footer } from './Footer';
import { ThreeHouseViewer } from './ThreeHouseViewerLazy';
import { KprModal } from './KprModal';
import { PropertyUnit } from '../utils/propertyLogic';
import { modelUrlFor } from '../data/propertyData';
import { Box, Sparkles, X, Layers, Compass, ArrowRight } from 'lucide-react';

export function HomePage() {
  const [is3DModalOpen, setIs3DModalOpen] = useState(false);
  const [selected3DModel, setSelected3DModel] = useState('Townhouse 115');
  const [kprUnit, setKprUnit] = useState<Partial<PropertyUnit> | null>(null);
  const [isKprOpen, setIsKprOpen] = useState(false);

  const handleOpenKpr = (unit: Partial<PropertyUnit>) => {
    setKprUnit(unit);
    setIsKprOpen(true);
  };

  const handleOpen3D = (modelName?: string) => {
    if (modelName) setSelected3DModel(modelName);
    setIs3DModalOpen(true);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#2b302c] font-sans antialiased selection:bg-[#c88242] selection:text-white">
      {/* Navigation */}
      <Navbar
        onOpen3D={() => handleOpen3D('Townhouse 115')}
        onOpenKpr={() =>
          handleOpenKpr({
            name: 'Townhouse 115',
            price: 2150000000,
            type: 'Townhouse 115',
          })
        }
      />

      {/* Hero Section matching mockup */}
      <HeroSection
        onOpen3D={() => handleOpen3D('Townhouse 115')}
        onOpenVideo={() => scrollToSection('video-tour')}
      />

      {/* Section 2: Concept "Tumbuh Bersama Rumah Impianmu" */}
      <ConceptSection />

      {/* Dedicated Interactive 3D Showcase in the flow of the page */}
      <section id="model-3d" className="py-20 bg-[#16211a] text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs uppercase font-semibold tracking-widest text-[#d4a373] flex items-center gap-1.5 mb-2">
                <Box className="w-3.5 h-3.5" /> Eksplorasi 3D Real-Time Three.js
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif-luxury font-bold text-[#faf7f2]">
                Model 3D Interaktif <br />
                <span className="italic font-normal text-[#d4a373]">Townhouse Tropis Modern</span>
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#a2b3a3] max-w-md leading-relaxed">
              Putar 360°, ubah suasana pencahayaan (pagi, senja, malam), dan pisahkan tiap lantai (exploded view) untuk
              mengecek struktur denah ruang interior secara transparan.
            </p>
          </div>

          {/* Three.js Interactive Component */}
          <ThreeHouseViewer modelName={selected3DModel} modelUrl={modelUrlFor(selected3DModel)} />
        </div>
      </section>

      {/* Section 3: Interactive Masterplan "Denah Lokasi Hyarta Ecovillage" */}
      <MasterplanViewer
        onOpenKpr={(unit) => handleOpenKpr(unit)}
        onSelectUnit={(unit) => {
          setSelected3DModel(unit.type);
        }}
      />

      {/* Section 4: Facilities & Clubhouse "Area Serbaguna" */}
      <FacilitySection />

      {/* Section 5: House Types "Pilihan Rumah Terbaik Untuk Anda" */}
      <HouseTypeSection
        onOpenKpr={(unit) => handleOpenKpr(unit)}
        onExplore3D={(modelName) => handleOpen3D(modelName)}
      />

      {/* Section 6: Video Walkthrough & Virtual Tour */}
      <VideoWalkthrough onLaunch3D={() => handleOpen3D('Townhouse 115')} />

      {/* Section 7: Articles "Artikel Kami" */}
      <ArticlesSection />

      {/* Section 8: Location "Lokasi Perumahan Kami" */}
      <LocationSection />

      {/* Footer */}
      <Footer />

      {/* Fullscreen 3D Modal if triggered */}
      {is3DModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col p-4 sm:p-6 animate-fade-in">
          <div className="flex items-center justify-between pb-3 text-white">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-widest text-[#d4a373]">
                Fullscreen 3D Explorer
              </span>
              <span className="text-xs text-white/40">•</span>
              <span className="text-sm font-semibold">{selected3DModel}</span>
            </div>
            <button
              onClick={() => setIs3DModalOpen(false)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 w-full h-full rounded-2xl overflow-hidden">
            <ThreeHouseViewer modelName={selected3DModel} modelUrl={modelUrlFor(selected3DModel)} className="w-full h-full" />
          </div>
        </div>
      )}

      {/* KPR Calculator Modal */}
      <KprModal
        unit={kprUnit}
        isOpen={isKprOpen}
        onClose={() => setIsKprOpen(false)}
      />
    </div>
  );
}
