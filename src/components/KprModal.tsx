import React, { useState } from 'react';
import { calculateKpr, formatRupiah, PropertyUnit } from '../utils/propertyLogic';
import { Calculator, X, Building, Check, ArrowRight, ShieldCheck, Percent, Calendar } from 'lucide-react';
import confetti from 'canvas-confetti';

interface KprModalProps {
  unit: Partial<PropertyUnit> | null;
  isOpen: boolean;
  onClose: () => void;
}

export const KprModal: React.FC<KprModalProps> = ({ unit, isOpen, onClose }) => {
  if (!isOpen || !unit) return null;

  const defaultPrice = unit.price || 2150000000;
  const [propertyPrice, setPropertyPrice] = useState<number>(defaultPrice);
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(20);
  const [tenureYears, setTenureYears] = useState<number>(15);
  const [interestRate, setInterestRate] = useState<number>(5.5);
  const [isSuccessSubmitted, setIsSuccessSubmitted] = useState<boolean>(false);
  const [buyerName, setBuyerName] = useState<string>('');
  const [buyerPhone, setBuyerPhone] = useState<string>('');

  const kprResult = calculateKpr(propertyPrice, downPaymentPercent, tenureYears, interestRate);

  const bankPresets = [
    { name: 'Mandiri Promo', rate: 5.25 },
    { name: 'BCA Solusi', rate: 5.5 },
    { name: 'BNI Griya', rate: 5.75 },
    { name: 'CIMB Niaga', rate: 6.0 },
  ];

  const handleSubmitConsultation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyerName || !buyerPhone) return;

    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 },
    });
    setIsSuccessSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#fcfbf9] w-full max-w-2xl rounded-3xl border border-[#ded7ca] shadow-2xl overflow-hidden relative text-[#2b302c]">
        {/* Header */}
        <div className="bg-[#1b3224] p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#c88242] text-white flex items-center justify-center">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-serif-luxury font-bold">Simulasi KPR Eksklusif</h3>
              <p className="text-xs text-[#d4e2d6]">
                {unit.name || 'Hyarta Ecovillage'} • {unit.type || 'Townhouse'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[80vh] overflow-y-auto">
          {isSuccessSubmitted ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                <Check className="w-8 h-8" />
              </div>
              <h4 className="text-2xl font-serif-luxury font-bold text-[#1b3224]">
                Permintaan Konsultasi Diterima!
              </h4>
              <p className="text-sm text-[#5a625a] max-w-md mx-auto">
                Terima kasih Bapak/Ibu <strong className="text-black">{buyerName}</strong>. Tim priority banking advisor
                kami akan segera menghubungi Anda di <strong className="text-black">{buyerPhone}</strong> dengan rincian
                persetujuan instan.
              </p>
              <div className="pt-4 flex justify-center gap-3">
                <button
                  onClick={() => setIsSuccessSubmitted(false)}
                  className="px-5 py-2.5 rounded-full border border-[#d6cfc2] text-xs font-semibold hover:bg-[#ede7dc]"
                >
                  Hitung Ulang
                </button>
                <a
                  href={`https://wa.me/6281234567890?text=${encodeURIComponent(
                    `Halo Hyarta Ecovillage, saya ${buyerName} sudah melakukan simulasi KPR untuk ${unit.name} dengan cicilan perkiraan ${formatRupiah(
                      kprResult.monthlyInstallment
                    )}/bulan. Mohon dihubungi lebih lanjut.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-2.5 rounded-full bg-[#1b3224] text-white text-xs font-semibold hover:bg-[#284935]"
                >
                  Buka WhatsApp Chat Langsung
                </a>
              </div>
            </div>
          ) : (
            <>
              {/* Sliders & Inputs */}
              <div className="space-y-5">
                {/* Property Price Input */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#687067] mb-1.5">
                    Harga Properti (IDR)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step={50000000}
                      value={propertyPrice}
                      onChange={(e) => setPropertyPrice(Math.max(100000000, Number(e.target.value)))}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#d8d2c5] bg-white text-base font-bold text-[#1b3224] focus:outline-none focus:ring-2 focus:ring-[#c88242]"
                    />
                    <span className="absolute right-4 top-2.5 text-xs text-[#879086] font-medium">
                      {formatRupiah(propertyPrice)}
                    </span>
                  </div>
                </div>

                {/* Down Payment (DP) */}
                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="font-bold uppercase tracking-wider text-[#687067]">
                      Uang Muka (DP): {downPaymentPercent}%
                    </span>
                    <span className="font-semibold text-[#1b3224]">
                      {formatRupiah(kprResult.downPaymentAmount)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="60"
                    step="5"
                    value={downPaymentPercent}
                    onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                    className="w-full accent-[#c88242] cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-[#868d85] mt-1">
                    <span>10% (Min)</span>
                    <span>20% (Standar)</span>
                    <span>30%</span>
                    <span>50%+</span>
                  </div>
                </div>

                {/* Tenure (Jangka Waktu) */}
                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="font-bold uppercase tracking-wider text-[#687067]">
                      Jangka Waktu Pinjaman (Tenor): {tenureYears} Tahun
                    </span>
                    <span className="font-semibold text-[#1b3224]">{tenureYears * 12} Bulan</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="25"
                    step="1"
                    value={tenureYears}
                    onChange={(e) => setTenureYears(Number(e.target.value))}
                    className="w-full accent-[#1b3224] cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-[#868d85] mt-1">
                    <span>5 Tahun</span>
                    <span>10 Tahun</span>
                    <span>15 Tahun</span>
                    <span>20 Tahun</span>
                    <span>25 Tahun</span>
                  </div>
                </div>

                {/* Bank Suku Bunga Presets */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#687067] mb-2">
                    Suku Bunga KPR Efektif: {interestRate}% / tahun
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {bankPresets.map((b) => (
                      <button
                        key={b.name}
                        type="button"
                        onClick={() => setInterestRate(b.rate)}
                        className={`p-2 rounded-xl text-xs font-medium text-center border transition-all ${
                          interestRate === b.rate
                            ? 'bg-[#1b3224] text-white border-[#1b3224] shadow-sm'
                            : 'bg-white hover:bg-[#ede7dc] text-[#3e463f] border-[#dcd6c8]'
                        }`}
                      >
                        <div className="font-bold">{b.name}</div>
                        <div className="text-[11px] opacity-80">{b.rate}% Fixed</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Monthly Installment Highlight Box */}
              <div className="bg-[#1b3224] rounded-2xl p-6 text-white shadow-xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-white/10 pb-4">
                  <div>
                    <span className="text-xs uppercase tracking-widest text-[#d4a373] font-semibold">
                      Estimasi Cicilan Bulanan
                    </span>
                    <div className="text-3xl sm:text-4xl font-bold font-serif-luxury text-[#fbf8f2] mt-1">
                      {formatRupiah(kprResult.monthlyInstallment)}
                      <span className="text-xs font-sans font-normal text-white/60 ml-2">/ bulan</span>
                    </div>
                  </div>
                  <span className="text-xs text-white/60 mt-2 sm:mt-0">
                    Pokok Pinjaman: {formatRupiah(kprResult.loanAmount)}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-white/80 pt-1">
                  <div>
                    <span className="text-white/50 block text-[11px]">Uang Muka (DP):</span>
                    <span className="font-semibold text-white">{formatRupiah(kprResult.downPaymentAmount)}</span>
                  </div>
                  <div>
                    <span className="text-white/50 block text-[11px]">Total Estimasi Bunga:</span>
                    <span className="font-semibold text-white">{formatRupiah(kprResult.totalInterest)}</span>
                  </div>
                  <div>
                    <span className="text-white/50 block text-[11px]">Total Pengembalian:</span>
                    <span className="font-semibold text-white">{formatRupiah(kprResult.totalPayment)}</span>
                  </div>
                </div>
              </div>

              {/* Quick Contact Form */}
              <form onSubmit={handleSubmitConsultation} className="space-y-3 pt-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#1b3224] block">
                  Dapatkan Brosur & Jadwal Private Viewing
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    placeholder="Nama Lengkap Anda"
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    className="px-4 py-2.5 rounded-xl border border-[#ded7ca] text-xs bg-white text-[#1b3224] focus:outline-none focus:ring-2 focus:ring-[#c88242]"
                  />
                  <input
                    type="tel"
                    required
                    placeholder="Nomor WhatsApp (cth: 08123456789)"
                    value={buyerPhone}
                    onChange={(e) => setBuyerPhone(e.target.value)}
                    className="px-4 py-2.5 rounded-xl border border-[#ded7ca] text-xs bg-white text-[#1b3224] focus:outline-none focus:ring-2 focus:ring-[#c88242]"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-full bg-[#c88242] text-white hover:bg-[#b07137] text-xs font-bold tracking-wider uppercase transition-all shadow-md flex items-center justify-center gap-2"
                >
                  Ajukan Simulasi & Jadwalkan Kunjungan <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
