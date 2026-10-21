import React, { useState } from 'react';
import { FACILITIES } from '../data/propertyData';
import { Coffee, Waves, Footprints, Shield, Clock, MapPin, CheckCircle } from 'lucide-react';

export const FacilitySection: React.FC = () => {
  const [activeFacilityId, setActiveFacilityId] = useState<string>('area-serbaguna');

  const activeFacility =
    FACILITIES.find((f) => f.id === activeFacilityId) || FACILITIES[0];

  return (
    <section id="fasilitas" className="py-24 bg-[#18231c] text-white relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-[#c88242]/10 rounded-full blur-3xl -translate-y-1/2 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <span className="text-xs uppercase font-semibold tracking-widest text-[#d4a373] block">
            FASILITAS KAWASAN EKSKLUSIF
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif-luxury font-bold text-[#faf7f2]">
            Area Serbaguna & Kehidupan Komunitas
          </h2>
          <div className="w-16 h-0.5 bg-[#c88242] mx-auto my-3" />
          <p className="text-[#a4b0a4] text-sm sm:text-base leading-relaxed">
            Didesain dengan nyaman dan tenang, area serbaguna ini menjadi tempat berkumpul bersama dengan kehangatan
            komunitas berkelas di Yogyakarta.
          </p>

          {/* Commute Time Pills matching screenshot */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs text-[#eedec9]">
              <Clock className="w-3.5 h-3.5 text-[#d4a373]" />
              <span>8 menit ke Ambarrukmo Plaza & Pakuwon Mall</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs text-[#eedec9]">
              <Clock className="w-3.5 h-3.5 text-[#d4a373]" />
              <span>15 menit ke Malioboro & Keraton</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs text-[#eedec9]">
              <Clock className="w-3.5 h-3.5 text-[#d4a373]" />
              <span>7 menit ke Bandara Adisutjipto</span>
            </div>
          </div>
        </div>

        {/* Hero Facility Showcase Card matching screenshot */}
        <div className="rounded-3xl overflow-hidden border border-white/15 bg-[#202e25] shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-0 mb-10">
          {/* Main Visual */}
          <div className="lg:col-span-8 relative min-h-[360px] sm:min-h-[460px] group overflow-hidden">
            <img
              src={activeFacility.image}
              alt={activeFacility.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent p-6 sm:p-8 flex flex-col justify-end">
              <span className="text-xs uppercase font-semibold tracking-wider text-[#d4a373] mb-1">
                Fasilitas Unggulan
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-white">
                {activeFacility.name}
              </h3>
              <p className="text-sm text-white/80 max-w-xl mt-1 leading-relaxed">
                {activeFacility.description}
              </p>
            </div>
          </div>

          {/* Features Side Panel */}
          <div className="lg:col-span-4 p-6 sm:p-8 flex flex-col justify-between space-y-6 bg-[#1a261f]">
            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-[#d4a373] block mb-2">
                Sentuhan Budaya Adiluhung
              </span>
              <h4 className="text-lg font-serif-luxury font-bold text-white mb-2">
                {activeFacility.subtitle}
              </h4>
              <p className="text-xs text-white/70 leading-relaxed mb-6">
                Dilengkapi dengan pencahayaan hangat temaram saat malam tiba, menciptakan momen intim dan santai
                bersama keluarga dan kerabat terdekat.
              </p>

              <div className="space-y-3">
                <span className="text-xs font-semibold text-white/90 block">Kenyamanan yang Tersedia:</span>
                <ul className="space-y-2">
                  {activeFacility.features.map((feat, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-xs text-white/80">
                      <CheckCircle className="w-3.5 h-3.5 text-[#d4a373] shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10">
              <a
                href="https://wa.me/6281234567890?text=Halo%20Hyarta,%20saya%20ingin%20tahu%20lebih%20banyak%20mengenai%20fasilitas%20kawasan."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-full bg-[#c88242] text-white hover:bg-[#b07137] text-xs font-semibold tracking-wide uppercase transition-all flex items-center justify-center gap-2 shadow-md"
              >
                Tanyakan Fasilitas ke Konsultan
              </a>
            </div>
          </div>
        </div>

        {/* Facility Tab Switchers */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          {FACILITIES.map((fac) => {
            const isSelected = activeFacilityId === fac.id;
            return (
              <button
                key={fac.id}
                onClick={() => setActiveFacilityId(fac.id)}
                className={`p-4 rounded-2xl text-left border transition-all ${
                  isSelected
                    ? 'bg-[#293d30] border-[#d4a373] shadow-lg'
                    : 'bg-[#1e2a22] hover:bg-[#25362b] border-white/5 opacity-80'
                }`}
              >
                <div className="flex items-center gap-2 text-[#d4a373] mb-1.5">
                  {fac.id === 'area-serbaguna' && <Coffee className="w-4 h-4" />}
                  {fac.id === 'kolam-renang' && <Waves className="w-4 h-4" />}
                  {fac.id === 'jogging-canopy' && <Footprints className="w-4 h-4" />}
                  {fac.id === 'security-onegate' && <Shield className="w-4 h-4" />}
                  <span className="text-[11px] font-bold uppercase tracking-wider">{fac.name.split(' ')[0]}</span>
                </div>
                <h5 className="text-xs font-semibold text-white line-clamp-1">{fac.name}</h5>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
