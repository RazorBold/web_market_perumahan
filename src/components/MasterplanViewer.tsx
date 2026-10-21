import React, { useState } from 'react';
import { MASTERPLAN_UNITS } from '../data/propertyData';
import { PropertyUnit, formatRupiah } from '../utils/propertyLogic';
import { Layers, ZoomIn, ZoomOut, RotateCcw, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

interface MasterplanViewerProps {
  onSelectUnit?: (unit: PropertyUnit) => void;
  onOpenKpr?: (unit: PropertyUnit) => void;
}

export const MasterplanViewer: React.FC<MasterplanViewerProps> = ({
  onSelectUnit,
  onOpenKpr,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('Semua');
  const [hoveredUnit, setHoveredUnit] = useState<PropertyUnit | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [activeUnit, setActiveUnit] = useState<PropertyUnit | null>(null);

  const filterOptions = [
    { label: 'Semua Kawasan', value: 'Semua', color: 'bg-emerald-600' },
    { label: 'Townhouse 145', value: 'Townhouse 145', color: 'bg-[#2e6f40]' },
    { label: 'Townhouse 125', value: 'Townhouse 125', color: 'bg-[#c88242]' },
    { label: 'Townhouse 115', value: 'Townhouse 115', color: 'bg-[#3b82f6]' },
    { label: 'Ruko Premium', value: 'Ruko Premium', color: 'bg-[#8b5cf6]' },
  ];

  // Map coordinates layout for the lots in SVG coordinate space (800x520)
  const lotLayouts: Record<string, { x: number; y: number; w: number; h: number; color: string }> = {
    'TH-A01': { x: 380, y: 120, w: 46, h: 56, color: '#2e6f40' },
    'TH-A02': { x: 432, y: 120, w: 46, h: 56, color: '#2e6f40' },
    'TH-A03': { x: 484, y: 120, w: 46, h: 56, color: '#2e6f40' },
    'TH-B01': { x: 380, y: 220, w: 42, h: 52, color: '#c88242' },
    'TH-B02': { x: 428, y: 220, w: 42, h: 52, color: '#c88242' },
    'TH-B03': { x: 476, y: 220, w: 42, h: 52, color: '#c88242' },
    'TH-C01': { x: 380, y: 310, w: 38, h: 48, color: '#3b82f6' },
    'TH-C02': { x: 424, y: 310, w: 38, h: 48, color: '#3b82f6' },
    'TH-C03': { x: 468, y: 310, w: 38, h: 48, color: '#3b82f6' },
    'TH-C04': { x: 512, y: 310, w: 38, h: 48, color: '#3b82f6' },
    'TH-D01': { x: 590, y: 390, w: 45, h: 55, color: '#8b5cf6' },
    'TH-D02': { x: 640, y: 390, w: 45, h: 55, color: '#8b5cf6' },
  };

  const handleUnitClick = (unit: PropertyUnit) => {
    setActiveUnit(unit);
    if (onSelectUnit) onSelectUnit(unit);
  };

  return (
    <section id="denah-lokasi" className="py-20 bg-[#f4f0e8] text-[#2b302c] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-10">
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs uppercase font-semibold tracking-widest text-[#a8743d] flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" /> Denah Lokasi & Masterplan
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif-luxury font-bold text-[#1a2e22] leading-tight">
              Denah Lokasi <br />
              <span className="italic font-normal">Hyarta Ecovillage</span>
            </h2>
            <p className="text-[#596058] text-sm sm:text-base leading-relaxed">
              Hyarta Ecovillage menghadirkan hunian berkelas yang mengusung eco-living dengan mengutamakan kualitas hidup
              penghuninya. Lahan hijau yang luas didedikasikan sebagai area konservasi alam yang turut menciptakan kenyamanan
              dan ketenangan dengan suasana yang alami.
            </p>

            {/* Filter buttons matching screenshot */}
            <div className="pt-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#7a8179] block mb-2.5">
                Desain Kawasan
              </span>
              <div className="flex flex-wrap gap-2">
                {filterOptions.map((f) => {
                  const isActive = selectedFilter === f.value;
                  return (
                    <button
                      key={f.value}
                      onClick={() => setSelectedFilter(f.value)}
                      className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                        isActive
                          ? 'bg-[#1b3224] text-white shadow-md'
                          : 'bg-white/80 hover:bg-white text-[#3d453f] border border-[#d8d2c4]'
                      }`}
                    >
                      <span className={`w-2.5 h-2.5 rounded-full ${f.color}`} />
                      {f.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Legend & Stats */}
            <div className="p-4 rounded-2xl bg-white/70 border border-[#e2dcd0] space-y-3">
              <h4 className="text-xs font-semibold text-[#1a2e22] uppercase tracking-wider">Status Ketersediaan Kavling</h4>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-[#4a524b]">Tersedia (Ready)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-amber-500" />
                  <span className="text-[#4a524b]">Booked (Diproses)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-rose-500" />
                  <span className="text-[#4a524b]">Terjual (Sold)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Masterplan Map Canvas / SVG interactive card */}
          <div className="lg:col-span-7">
            <div className="relative rounded-3xl overflow-hidden bg-[#243328] border-2 border-[#ded6c7] shadow-2xl">
              {/* Map controls */}
              <div className="absolute top-4 right-4 z-10 flex items-center gap-1 bg-[#1a251e]/80 backdrop-blur-md p-1 rounded-xl border border-white/10 text-white">
                <button
                  onClick={() => setZoomLevel((z) => Math.min(z + 0.2, 1.8))}
                  className="p-1.5 hover:bg-white/15 rounded-lg text-white/80 hover:text-white transition-colors"
                  title="Perbesar"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setZoomLevel((z) => Math.max(z - 0.2, 0.8))}
                  className="p-1.5 hover:bg-white/15 rounded-lg text-white/80 hover:text-white transition-colors"
                  title="Perkecil"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setZoomLevel(1)}
                  className="p-1.5 hover:bg-white/15 rounded-lg text-white/80 hover:text-white transition-colors"
                  title="Reset Zoom"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              {/* Watermark Tag */}
              <div className="absolute bottom-4 left-4 z-10 bg-[#16211a]/85 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/10 text-[11px] text-[#e0d6c8]">
                Denah Masterplan Skala 1:500 • Klik Kavling untuk Info Detail
              </div>

              {/* Interactive SVG Map */}
              <div
                className="w-full h-[440px] sm:h-[480px] overflow-auto flex items-center justify-center p-4 cursor-grab"
                style={{
                  transform: `scale(${zoomLevel})`,
                  transformOrigin: 'center center',
                  transition: 'transform 0.25s ease-out',
                }}
              >
                <svg
                  viewBox="0 0 800 520"
                  className="w-full max-w-[760px] h-auto select-none"
                  style={{ filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.3))' }}
                >
                  {/* Surrounding landscape background */}
                  <rect width="800" height="520" fill="#202d24" rx="20" />

                  {/* Water Canal / Sungai Konservasi (curved organic river on left like in screenshot) */}
                  <path
                    d="M 120 0 C 180 120, 150 200, 220 300 C 270 380, 210 440, 260 520 L 190 520 C 150 440, 190 380, 160 300 C 100 200, 130 120, 70 0 Z"
                    fill="#2a4d57"
                    opacity="0.85"
                  />
                  <path
                    d="M 100 0 C 160 120, 130 200, 200 300 C 250 380, 190 440, 240 520"
                    stroke="#48cae4"
                    strokeWidth="3"
                    fill="none"
                    strokeDasharray="4 4"
                    opacity="0.6"
                  />

                  {/* Green Forest Buffer / Konservasi 45% */}
                  <path
                    d="M 230 40 C 310 30, 360 80, 340 160 C 310 240, 260 210, 280 320 C 290 380, 250 460, 220 480 Z"
                    fill="#1b432a"
                    opacity="0.8"
                  />
                  <text x="210" y="220" fill="#a3cfbb" fontSize="11" fontWeight="600" letterSpacing="1">
                    🌿 ZONA KONSERVASI HIJAU
                  </text>

                  {/* Main Boulevard & Cluster Roads */}
                  <path
                    d="M 720 420 L 350 420 C 330 420, 330 380, 330 350 L 330 100 C 330 70, 370 70, 400 70 L 680 70"
                    stroke="#505c54"
                    strokeWidth="24"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                  <path
                    d="M 330 260 L 650 260"
                    stroke="#505c54"
                    strokeWidth="20"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <path
                    d="M 330 170 L 650 170"
                    stroke="#505c54"
                    strokeWidth="20"
                    strokeLinecap="round"
                    fill="none"
                  />

                  {/* Road Center Dotted Lines */}
                  <path
                    d="M 720 420 L 350 420 C 335 420, 330 400, 330 350 L 330 100 C 330 80, 360 70, 400 70 L 680 70"
                    stroke="#98a39c"
                    strokeWidth="1.5"
                    strokeDasharray="6 6"
                    fill="none"
                  />

                  {/* Main Gate & Clubhouse (Pendopo Joglo) */}
                  <rect x="580" y="110" width="85" height="100" rx="8" fill="#5c3d28" stroke="#d4a373" strokeWidth="2" />
                  <text x="622" y="155" fill="#f8eedf" fontSize="10" fontWeight="bold" textAnchor="middle">
                    AREA SERBAGUNA
                  </text>
                  <text x="622" y="170" fill="#d4a373" fontSize="9" textAnchor="middle">
                    (Joglo & Pool)
                  </text>

                  {/* Gate Entrance */}
                  <rect x="690" y="395" width="40" height="50" rx="4" fill="#354038" stroke="#a8855a" strokeWidth="2" />
                  <text x="710" y="425" fill="#ffffff" fontSize="9" textAnchor="middle" fontWeight="bold">
                    MAIN GATE
                  </text>

                  {/* Render Lots */}
                  {MASTERPLAN_UNITS.map((unit) => {
                    const layout = lotLayouts[unit.id];
                    if (!layout) return null;

                    const isFiltered =
                      selectedFilter !== 'Semua' && unit.type !== selectedFilter;
                    const isHovered = hoveredUnit?.id === unit.id;
                    const isSelected = activeUnit?.id === unit.id;

                    let statusStroke = '#10b981';
                    if (unit.status === 'Booked') statusStroke = '#f59e0b';
                    if (unit.status === 'Terjual') statusStroke = '#ef4444';

                    return (
                      <g
                        key={unit.id}
                        transform={`translate(${layout.x}, ${layout.y})`}
                        className="cursor-pointer transition-all duration-200"
                        opacity={isFiltered ? 0.25 : 1}
                        onMouseEnter={() => setHoveredUnit(unit)}
                        onMouseLeave={() => setHoveredUnit(null)}
                        onClick={() => handleUnitClick(unit)}
                      >
                        <rect
                          width={layout.w}
                          height={layout.h}
                          rx="4"
                          fill={isHovered || isSelected ? '#ffffff' : layout.color}
                          stroke={statusStroke}
                          strokeWidth={isHovered || isSelected ? 3 : 1.5}
                          className="transition-colors"
                        />
                        <text
                          x={layout.w / 2}
                          y={layout.h / 2 - 2}
                          fill={isHovered || isSelected ? '#1b261f' : '#ffffff'}
                          fontSize="9"
                          fontWeight="bold"
                          textAnchor="middle"
                        >
                          {unit.id.replace('TH-', '')}
                        </text>
                        <circle
                          cx={layout.w / 2}
                          cy={layout.h / 2 + 12}
                          r="3"
                          fill={statusStroke}
                        />
                      </g>
                    );
                  })}
                </svg>
              </div>

              {/* Hovered Lot Floating Tooltip */}
              {hoveredUnit && (
                <div className="absolute top-4 left-4 bg-[#141e17]/95 backdrop-blur-md p-3.5 rounded-2xl border border-[#d4a373]/40 shadow-2xl text-white max-w-xs animate-fade-in z-20 pointer-events-none">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-bold text-sm text-[#f6eee2]">{hoveredUnit.name}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                        hoveredUnit.status === 'Tersedia'
                          ? 'bg-emerald-900/80 text-emerald-300 border border-emerald-500/30'
                          : hoveredUnit.status === 'Booked'
                          ? 'bg-amber-900/80 text-amber-300 border border-amber-500/30'
                          : 'bg-rose-900/80 text-rose-300 border border-rose-500/30'
                      }`}
                    >
                      {hoveredUnit.status}
                    </span>
                  </div>
                  <div className="text-xs text-white/70 space-y-0.5">
                    <p className="font-medium text-[#d4a373]">{hoveredUnit.type}</p>
                    <p>Luas Tanah: {hoveredUnit.landArea} m² • Bangunan: {hoveredUnit.buildingArea} m²</p>
                    <p className="text-[#a3cfbb] font-semibold text-sm pt-1">{formatRupiah(hoveredUnit.price)}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Selected Lot Detail Card Modal / Drawer */}
        {activeUnit && (
          <div className="mt-8 bg-white p-6 rounded-3xl border border-[#e0d6c4] shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 animate-fade-in">
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-xs font-bold uppercase tracking-wider text-[#a8743d]">Unit Terpilih</span>
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-semibold flex items-center gap-1 ${
                    activeUnit.status === 'Tersedia'
                      ? 'bg-emerald-100 text-emerald-800'
                      : activeUnit.status === 'Booked'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {activeUnit.status === 'Tersedia' ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : activeUnit.status === 'Booked' ? (
                    <Clock className="w-3.5 h-3.5" />
                  ) : (
                    <AlertCircle className="w-3.5 h-3.5" />
                  )}
                  {activeUnit.status}
                </span>
              </div>
              <h3 className="text-2xl font-serif-luxury font-bold text-[#1b3224]">
                {activeUnit.name} — {activeUnit.type}
              </h3>
              <p className="text-sm text-[#5d635c]">
                Keunggulan: <span className="font-medium text-[#2d332d]">{activeUnit.highlightFeature}</span> • LT: {activeUnit.landArea} m² • LB: {activeUnit.buildingArea} m² • {activeUnit.bedrooms} Kamar Tidur • {activeUnit.bathrooms} Kamar Mandi
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
              <div className="text-right">
                <span className="text-xs text-[#7c837b] block">Harga Mulai Dari:</span>
                <span className="text-2xl font-bold font-serif-luxury text-[#1b3224]">
                  {formatRupiah(activeUnit.price)}
                </span>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => onOpenKpr && onOpenKpr(activeUnit)}
                  className="flex-1 sm:flex-none px-5 py-2.5 rounded-full bg-[#1b3224] text-white hover:bg-[#284935] text-xs font-semibold tracking-wide transition-all shadow-md hover:shadow-lg"
                >
                  Simulasi KPR
                </button>
                <a
                  href={`https://wa.me/6281234567890?text=${encodeURIComponent(
                    `Halo Hyarta Ecovillage, saya tertarik dengan unit ${activeUnit.name} (${activeUnit.type}) harga ${formatRupiah(
                      activeUnit.price
                    )}. Mohon info ketersediaan & jadwal kunjungan.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-none px-5 py-2.5 rounded-full bg-[#c88242] text-white hover:bg-[#b07137] text-xs font-semibold tracking-wide transition-all shadow-md"
                >
                  Hubungi Sales
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
