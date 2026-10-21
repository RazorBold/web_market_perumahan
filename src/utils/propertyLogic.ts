/**
 * Core business and financial calculation logic for Hyarta Ecovillage
 */

export interface PropertyUnit {
  id: string;
  name: string;
  type: 'Townhouse 115' | 'Townhouse 125' | 'Townhouse 145' | 'Ruko Premium';
  block: string;
  lotNumber: number;
  landArea: number; // in m2
  buildingArea: number; // in m2
  bedrooms: number;
  bathrooms: number;
  carport: number;
  price: number; // in IDR
  status: 'Tersedia' | 'Booked' | 'Terjual';
  highlightFeature: string;
}

export interface KprCalculationResult {
  propertyPrice: number;
  downPaymentPercent: number;
  downPaymentAmount: number;
  loanAmount: number;
  tenureYears: number;
  annualInterestRate: number;
  monthlyInstallment: number;
  totalInterest: number;
  totalPayment: number;
}

/**
 * Calculates standard annuity KPR (Kredit Pemilikan Rumah) monthly mortgage installment
 */
export function calculateKpr(
  propertyPrice: number,
  downPaymentPercent: number,
  tenureYears: number,
  annualInterestRatePercent: number
): KprCalculationResult {
  if (propertyPrice <= 0) {
    throw new Error('Property price must be greater than 0');
  }
  if (downPaymentPercent < 0 || downPaymentPercent > 100) {
    throw new Error('Down payment percentage must be between 0 and 100');
  }
  if (tenureYears <= 0) {
    throw new Error('Tenure years must be greater than 0');
  }

  const downPaymentAmount = (propertyPrice * downPaymentPercent) / 100;
  const loanAmount = propertyPrice - downPaymentAmount;

  if (loanAmount <= 0) {
    return {
      propertyPrice,
      downPaymentPercent,
      downPaymentAmount,
      loanAmount: 0,
      tenureYears,
      annualInterestRate: annualInterestRatePercent,
      monthlyInstallment: 0,
      totalInterest: 0,
      totalPayment: propertyPrice,
    };
  }

  const totalMonths = tenureYears * 12;
  const monthlyRate = annualInterestRatePercent / 100 / 12;

  let monthlyInstallment = 0;
  if (monthlyRate === 0) {
    monthlyInstallment = Math.round(loanAmount / totalMonths);
  } else {
    // Annuity formula: P * (r * (1 + r)^n) / ((1 + r)^n - 1)
    const factor = Math.pow(1 + monthlyRate, totalMonths);
    monthlyInstallment = Math.round(loanAmount * (monthlyRate * factor) / (factor - 1));
  }

  const totalPayment = downPaymentAmount + monthlyInstallment * totalMonths;
  const totalInterest = Math.max(0, totalPayment - propertyPrice);

  return {
    propertyPrice,
    downPaymentPercent,
    downPaymentAmount,
    loanAmount,
    tenureYears,
    annualInterestRate: annualInterestRatePercent,
    monthlyInstallment,
    totalInterest,
    totalPayment,
  };
}

/**
 * Filters units based on criteria
 */
export function filterUnits(
  units: PropertyUnit[],
  criteria: {
    type?: string;
    status?: 'Tersedia' | 'Booked' | 'Terjual' | 'Semua';
    maxPrice?: number;
    minBedrooms?: number;
  }
): PropertyUnit[] {
  return units.filter((unit) => {
    if (criteria.type && criteria.type !== 'Semua' && unit.type !== criteria.type) {
      return false;
    }
    if (criteria.status && criteria.status !== 'Semua' && unit.status !== criteria.status) {
      return false;
    }
    if (criteria.maxPrice && unit.price > criteria.maxPrice) {
      return false;
    }
    if (criteria.minBedrooms && unit.bedrooms < criteria.minBedrooms) {
      return false;
    }
    return true;
  });
}

/**
 * Computes masterplan statistics
 */
export function calculateMasterplanStats(units: PropertyUnit[]) {
  const total = units.length;
  const available = units.filter((u) => u.status === 'Tersedia').length;
  const booked = units.filter((u) => u.status === 'Booked').length;
  const sold = units.filter((u) => u.status === 'Terjual').length;

  return {
    total,
    available,
    booked,
    sold,
    occupancyRatePercent: total > 0 ? Math.round(((sold + booked) / total) * 100) : 0,
  };
}

/**
 * Format currency to Indonesian Rupiah standard
 */
export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}
