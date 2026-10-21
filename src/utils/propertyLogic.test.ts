import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateKpr, filterUnits, calculateMasterplanStats, formatRupiah, PropertyUnit } from './propertyLogic';

test('calculateKpr computes correct monthly installment for standard loan', () => {
  // Price: Rp 2,000,000,000, DP: 20% (Rp 400M), Loan: Rp 1,600,000,000, Tenure: 15 years, Interest: 6% p.a.
  const result = calculateKpr(2000000000, 20, 15, 6);
  assert.equal(result.propertyPrice, 2000000000);
  assert.equal(result.downPaymentAmount, 400000000);
  assert.equal(result.loanAmount, 1600000000);
  // Monthly rate = 0.06 / 12 = 0.005. N = 180 months.
  // factor = (1.005)^180 ~= 2.45409356
  // monthly = 1.6B * (0.005 * 2.45409356) / (1.45409356) ~= 13,501,720
  assert.ok(result.monthlyInstallment > 13000000 && result.monthlyInstallment < 14000000);
  assert.ok(result.totalPayment > 2000000000);
  assert.ok(result.totalInterest > 0);
});

test('calculateKpr handles 100% down payment (cash payment)', () => {
  const result = calculateKpr(1500000000, 100, 10, 5);
  assert.equal(result.loanAmount, 0);
  assert.equal(result.monthlyInstallment, 0);
  assert.equal(result.totalInterest, 0);
  assert.equal(result.totalPayment, 1500000000);
});

test('calculateKpr throws error on invalid parameters', () => {
  assert.throws(() => calculateKpr(-100, 20, 10, 5), /Property price must be greater than 0/);
  assert.throws(() => calculateKpr(1000000, 150, 10, 5), /Down payment percentage must be between 0 and 100/);
  assert.throws(() => calculateKpr(1000000, 20, 0, 5), /Tenure years must be greater than 0/);
});

test('filterUnits accurately filters by type, status, and price', () => {
  const sampleUnits: PropertyUnit[] = [
    {
      id: 'TH-01',
      name: 'Townhouse 115 A1',
      type: 'Townhouse 115',
      block: 'A',
      lotNumber: 1,
      landArea: 140,
      buildingArea: 115,
      bedrooms: 3,
      bathrooms: 3,
      carport: 2,
      price: 2100000000,
      status: 'Tersedia',
      highlightFeature: 'Taman belakang luas',
    },
    {
      id: 'TH-02',
      name: 'Townhouse 125 B2',
      type: 'Townhouse 125',
      block: 'B',
      lotNumber: 2,
      landArea: 160,
      buildingArea: 125,
      bedrooms: 4,
      bathrooms: 4,
      carport: 2,
      price: 2600000000,
      status: 'Booked',
      highlightFeature: 'Inner courtyard',
    },
    {
      id: 'TH-03',
      name: 'Townhouse 145 C3',
      type: 'Townhouse 145',
      block: 'C',
      lotNumber: 3,
      landArea: 180,
      buildingArea: 145,
      bedrooms: 4,
      bathrooms: 4,
      carport: 2,
      price: 3200000000,
      status: 'Terjual',
      highlightFeature: 'Private balcony & swimming pool',
    },
  ];

  const filteredByType = filterUnits(sampleUnits, { type: 'Townhouse 115' });
  assert.equal(filteredByType.length, 1);
  assert.equal(filteredByType[0].id, 'TH-01');

  const filteredByStatus = filterUnits(sampleUnits, { status: 'Tersedia' });
  assert.equal(filteredByStatus.length, 1);
  assert.equal(filteredByStatus[0].id, 'TH-01');

  const filteredByMaxPrice = filterUnits(sampleUnits, { maxPrice: 2500000000 });
  assert.equal(filteredByMaxPrice.length, 1);
  assert.equal(filteredByMaxPrice[0].price, 2100000000);
});

test('calculateMasterplanStats calculates totals and percentages correctly', () => {
  const units: PropertyUnit[] = [
    { id: '1', name: 'U1', type: 'Townhouse 115', block: 'A', lotNumber: 1, landArea: 120, buildingArea: 100, bedrooms: 3, bathrooms: 2, carport: 1, price: 1e9, status: 'Tersedia', highlightFeature: '' },
    { id: '2', name: 'U2', type: 'Townhouse 125', block: 'A', lotNumber: 2, landArea: 120, buildingArea: 100, bedrooms: 3, bathrooms: 2, carport: 1, price: 1e9, status: 'Booked', highlightFeature: '' },
    { id: '3', name: 'U3', type: 'Townhouse 145', block: 'A', lotNumber: 3, landArea: 120, buildingArea: 100, bedrooms: 3, bathrooms: 2, carport: 1, price: 1e9, status: 'Terjual', highlightFeature: '' },
    { id: '4', name: 'U4', type: 'Townhouse 145', block: 'A', lotNumber: 4, landArea: 120, buildingArea: 100, bedrooms: 3, bathrooms: 2, carport: 1, price: 1e9, status: 'Terjual', highlightFeature: '' },
  ];

  const stats = calculateMasterplanStats(units);
  assert.equal(stats.total, 4);
  assert.equal(stats.available, 1);
  assert.equal(stats.booked, 1);
  assert.equal(stats.sold, 2);
  assert.equal(stats.occupancyRatePercent, 75);
});

test('formatRupiah produces valid formatted string', () => {
  const formatted = formatRupiah(2500000000);
  assert.ok(formatted.includes('2.500.000.000') || formatted.includes('2,500,000,000'));
});
