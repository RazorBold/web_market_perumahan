import React, { useState } from 'react';
import { NEARBY_LANDMARKS } from '../data/propertyData';
import { MapPin, Navigation, Phone, Calendar, Check, Send, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { openWhatsapp, whatsappLink } from '../config/contact';

export const LocationSection: React.FC = () => {
  const [visitorName, setVisitorName] = useState('');
  const [visitorPhone, setVisitorPhone] = useState('');
  const [isBooked, setIsBooked] = useState(false);

  const bookingMessage = `Halo Hyarta Ecovillage, saya ${visitorName} (${visitorPhone}) ingin menjadwalkan kunjungan ke show unit. Mohon info jadwal yang tersedia.`;

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitorName || !visitorPhone) return;

    // No backend yet: the booking request is delivered by handing the prefilled message to WhatsApp
    openWhatsapp(bookingMessage);

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
    });
    setIsBooked(true);
  };

  return (
    <section id="lokasi" className="py-24 bg-[#faf8f5] text-[#2b302c] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header matching mockup */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <span className="text-xs uppercase font-semibold tracking-widest text-[#a8743d] block">
            LOKASI PERUMAHAN
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif-luxury font-bold text-[#1b3224]">
            Lokasi Perumahan Kami
          </h2>
          <div className="w-16 h-0.5 bg-[#c88242] mx-auto my-3" />
          <p className="text-[#596158] text-sm sm:text-base leading-relaxed">
            Terletak strategis di kawasan prestisius Yogyakarta timur, memadukan ketenangan alam yang bebas polusi
            dengan akses super cepat ke pusat bisnis, bandara, dan destinasi budaya.
          </p>
        </div>

        {/* Map & Landmark Grid matching mockup */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-14">
          {/* Stylized Map View Card */}
          <div className="lg:col-span-7 bg-[#212f26] rounded-3xl overflow-hidden border border-[#ded7ca] shadow-2xl relative min-h-[420px] p-6 flex flex-col justify-between">
            {/* Top header badge on map */}
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-2 bg-[#17221b]/90 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 text-xs text-white">
                <MapPin className="w-3.5 h-3.5 text-[#d4a373]" />
                <span className="font-semibold">Jl. Solo Km. 10, Maguwoharjo, Sleman, D.I. Yogyakarta</span>
              </div>
            </div>

            {/* Stylized Roadmap Graphic SVG representing Yogyakarta landmarks */}
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <svg viewBox="0 0 600 400" className="w-full h-full">
                {/* Background area */}
                <rect width="600" height="400" fill="#233228" />

                {/* Primary Ring Road & Main Street arteries */}
                <path d="M 0 200 L 600 200" stroke="#48574d" strokeWidth="22" />
                <path d="M 0 200 L 600 200" stroke="#f4b266" strokeWidth="2" strokeDasharray="6 6" />

                {/* North-South Ring Road */}
                <path d="M 240 0 L 240 400" stroke="#48574d" strokeWidth="18" />
                <path d="M 440 0 L 440 400" stroke="#3d4941" strokeWidth="12" />

                {/* Angled avenues */}
                <path d="M 100 0 L 480 400" stroke="#38453c" strokeWidth="8" />
                <path d="M 50 350 L 550 50" stroke="#38453c" strokeWidth="6" />

                {/* River Kali Opak / Selokan */}
                <path
                  d="M 500 0 C 470 120, 520 220, 480 320 C 450 380, 520 400, 510 400"
                  stroke="#2b535d"
                  strokeWidth="8"
                  fill="none"
                />

                {/* Landmark Pins */}
                {/* 1. Hyarta Ecovillage (Hero Gold Pin) */}
                <g transform="translate(320, 180)">
                  <circle r="22" fill="#c88242" opacity="0.3" className="animate-ping" />
                  <circle r="14" fill="#c88242" stroke="#ffffff" strokeWidth="2.5" />
                  <text x="0" y="4" fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle">
                    HYARTA
                  </text>
                  <rect x="-60" y="-32" width="120" height="20" rx="4" fill="#1b2820" stroke="#c88242" />
                  <text x="0" y="-18" fill="#f8ede1" fontSize="9" fontWeight="bold" textAnchor="middle">
                    📍 HYARTA ECOVILLAGE
                  </text>
                </g>

                {/* 2. Sheraton Mustika Yogyakarta Resort & Spa */}
                <g transform="translate(420, 130)">
                  <circle r="7" fill="#e07a5f" />
                  <rect x="12" y="-10" width="150" height="18" rx="4" fill="#1b2820" />
                  <text x="18" y="2" fill="#e2d9cd" fontSize="8">
                    🏨 Sheraton Mustika Resort & Spa
                  </text>
                </g>

                {/* 3. Gudeg Yu Djum Pusat Maguwo */}
                <g transform="translate(380, 260)">
                  <circle r="7" fill="#f2cc8f" />
                  <rect x="12" y="-8" width="130" height="18" rx="4" fill="#1b2820" />
                  <text x="18" y="4" fill="#e2d9cd" fontSize="8">
                    🍲 Gudeg Yu Djum Maguwo
                  </text>
                </g>

                {/* 4. Grand Orchid Hotel Yogyakarta */}
                <g transform="translate(140, 150)">
                  <circle r="7" fill="#81b29a" />
                  <rect x="-140" y="-8" width="130" height="18" rx="4" fill="#1b2820" />
                  <text x="-132" y="4" fill="#e2d9cd" fontSize="8">
                    🏨 Grand Orchid Hotel Jogja
                  </text>
                </g>

                {/* 5. Bandara Internasional Adisutjipto */}
                <g transform="translate(520, 240)">
                  <circle r="8" fill="#3d84a8" />
                  <rect x="-140" y="-12" width="135" height="18" rx="4" fill="#1b2820" />
                  <text x="-132" y="0" fill="#e2d9cd" fontSize="8">
                    ✈️ Bandara Adisutjipto (7 Mnt)
                  </text>
                </g>
              </svg>
            </div>

            {/* Bottom map action */}
            <div className="relative z-10 flex items-center justify-between pt-4">
              <span className="text-xs text-white/70">Akses Langsung Jalan Protokol Provinsi</span>
              <a
                href="https://maps.google.com/?q=Hyarta+Ecovillage+Yogyakarta"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-full bg-[#c88242] text-white hover:bg-[#b07137] text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md"
              >
                <Navigation className="w-3.5 h-3.5" /> Buka Google Maps
              </a>
            </div>
          </div>

          {/* Right Column: Nearby POI list */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="text-xl font-serif-luxury font-bold text-[#1b3224]">
              Konektivitas & Fasilitas Sekitar
            </h3>
            <p className="text-xs text-[#5e665d] leading-relaxed">
              Dikelilingi oleh pusat pendidikan terbaik, rumah sakit bertaraf internasional, pusat belanja modern, dan
              destinasi wisata legendaris kota Gudeg.
            </p>

            <div className="space-y-2.5">
              {NEARBY_LANDMARKS.map((landmark, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-white border border-[#ded7ca] shadow-sm flex items-center justify-between hover:border-[#c88242] transition-colors"
                >
                  <div className="space-y-0.5">
                    <span className="text-[10px] uppercase font-bold text-[#a8743d] tracking-wider">
                      {landmark.type}
                    </span>
                    <h5 className="text-xs font-bold text-[#1b3224]">{landmark.name}</h5>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-[#1b3224] block">{landmark.time}</span>
                    <span className="text-[11px] text-[#788077]">{landmark.distance}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Schedule VIP Showing Form */}
        <div className="bg-[#1b3224] rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#c88242]/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto text-center space-y-4">
            <span className="text-xs uppercase tracking-widest text-[#d4a373] font-semibold flex items-center justify-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Private Experience
            </span>
            <h3 className="text-2xl sm:text-4xl font-serif-luxury font-bold">
              Jadwalkan Kunjungan VIP & Rumah Contoh
            </h3>
            <p className="text-xs sm:text-sm text-[#d0ded2] max-w-xl mx-auto leading-relaxed">
              Rasakan langsung udara sejuk, ketenangan pepohonan rindang, dan sentuhan kemewahan arsitektur Hyarta
              Ecovillage didampingi oleh property consultant kami.
            </p>

            {isBooked ? (
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 text-center space-y-2 max-w-lg mx-auto">
                <Check className="w-8 h-8 text-emerald-400 mx-auto" />
                <h4 className="font-bold text-lg text-white">Tinggal Kirim Pesan WhatsApp</h4>
                <p className="text-xs text-white/80">
                  Terima kasih Bapak/Ibu {visitorName}. Kirim pesan yang sudah kami siapkan di WhatsApp, lalu tim kami
                  akan mengonfirmasi jadwal kunjungan ke {visitorPhone}.
                </p>
                <a
                  href={whatsappLink(bookingMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-2 px-5 py-2 rounded-full bg-[#c88242] hover:bg-[#b07137] text-white text-xs font-semibold"
                >
                  Buka WhatsApp
                </a>
              </div>
            ) : (
              <form onSubmit={handleBooking} className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 text-left">
                <input
                  type="text"
                  required
                  placeholder="Nama Lengkap"
                  value={visitorName}
                  onChange={(e) => setVisitorName(e.target.value)}
                  className="px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 text-xs focus:outline-none focus:ring-2 focus:ring-[#c88242]"
                />
                <input
                  type="tel"
                  required
                  placeholder="Nomor WhatsApp"
                  value={visitorPhone}
                  onChange={(e) => setVisitorPhone(e.target.value)}
                  className="px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 text-xs focus:outline-none focus:ring-2 focus:ring-[#c88242]"
                />
                <button
                  type="submit"
                  className="py-3 px-6 rounded-xl bg-[#c88242] text-white hover:bg-[#b07137] text-xs font-bold uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" /> Konfirmasi Jadwal
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
