'use client';

import React, { useState } from 'react';
import { Calculator, Phone } from 'lucide-react';
import { KprModal } from './KprModal';
import { whatsappLink } from '../config/contact';
import { HouseModel } from '../data/propertyData';
import { PropertyUnit } from '../utils/propertyLogic';

interface HouseTypeActionsProps {
  model: Pick<HouseModel, 'name' | 'price'>;
}

/** KPR simulation + WhatsApp actions for a house type detail page */
export const HouseTypeActions: React.FC<HouseTypeActionsProps> = ({ model }) => {
  const [isKprOpen, setIsKprOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={() => setIsKprOpen(true)}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#1b3224] hover:bg-[#274734] text-white text-sm font-semibold transition-colors"
        >
          <Calculator className="w-4 h-4 text-[#d4a373]" /> Simulasi KPR
        </button>
        <a
          href={whatsappLink(`Halo Hyarta Ecovillage, saya ingin menanyakan ketersediaan ${model.name} dan meminta e-brochure lengkap.`)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#c88242] hover:bg-[#b07137] text-white text-sm font-semibold transition-colors"
        >
          <Phone className="w-4 h-4" /> Tanya ketersediaan unit
        </a>
      </div>

      <KprModal
        unit={{ name: model.name, type: model.name as PropertyUnit['type'], price: model.price }}
        isOpen={isKprOpen}
        onClose={() => setIsKprOpen(false)}
      />
    </>
  );
};
