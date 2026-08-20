import { InventoryProduct, InventoryStats } from '../types/inventory.types';

export const mockInventoryProducts: InventoryProduct[] = [
  {
    id: 'inv-1', name: 'Paracétamol 500mg', code: 'PARA-500', category: 'Analgésiques',
    imageUrl: '/products/para-500.svg', salePrice: 1500, stock: 342, unit: 'u.',
    expirationDate: '2026-12-31', marginPercent: 42, status: 'en-stock',
    lots: [
      { id: 'lot-1a', code: 'LOT-2024-P01', quantity: 200, expirationDate: '2026-12-31' },
      { id: 'lot-1b', code: 'LOT-2024-P02', quantity: 142, expirationDate: '2027-04-10' },
    ],
    movements: [
      { id: 'mv-1a', type: 'vente', quantity: -6, date: '2026-08-09', user: 'A. Kouassi' },
      { id: 'mv-1b', type: 'vente', quantity: -10, date: '2026-08-07', user: 'K. Diallo' },
      { id: 'mv-1c', type: 'reapprovisionnement', quantity: 200, date: '2026-08-02', user: 'K. Diallo' },
    ],
  },
  {
    id: 'inv-2', name: 'Amoxicilline 250mg', code: 'AMOX-250', category: 'Antibiotiques',
    imageUrl: '/products/amox-250.svg', salePrice: 4500, stock: 28, unit: 'u.',
    expirationDate: '2026-09-15', marginPercent: 38, status: 'stock-bas',
    lots: [{ id: 'lot-2a', code: 'LOT-2024-A03', quantity: 28, expirationDate: '2026-09-15' }],
    movements: [
      { id: 'mv-2a', type: 'vente', quantity: -4, date: '2026-08-10', user: 'A. Kouassi' },
      { id: 'mv-2b', type: 'vente', quantity: -8, date: '2026-08-06', user: 'A. Kouassi' },
    ],
  },
  {
    id: 'inv-3', name: 'Ibuprofène 400mg', code: 'IBU-400', category: 'Anti-inflammatoires',
    imageUrl: '/products/ibu-400.svg', salePrice: 2200, stock: 156, unit: 'u.',
    expirationDate: '2027-03-20', marginPercent: 35, status: 'en-stock',
    lots: [
      { id: 'lot-3a', code: 'LOT-2024-A12', quantity: 200, expirationDate: '2026-12-31' },
      { id: 'lot-3b', code: 'LOT-2024-B07', quantity: 156, expirationDate: '2027-03-20' },
    ],
    movements: [
      { id: 'mv-3a', type: 'vente', quantity: -12, date: '2026-08-09', user: 'A. Kouassi' },
      { id: 'mv-3b', type: 'vente', quantity: -5, date: '2026-08-08', user: 'K. Diallo' },
      { id: 'mv-3c', type: 'reapprovisionnement', quantity: 100, date: '2026-08-05', user: 'K. Diallo' },
      { id: 'mv-3d', type: 'vente', quantity: -8, date: '2026-08-04', user: 'A. Kouassi' },
    ],
  },
  {
    id: 'inv-4', name: 'Métronidazole 250mg', code: 'METRO-250', category: 'Antibiotiques',
    imageUrl: '/products/metro-250.svg', salePrice: 3000, stock: 89, unit: 'u.',
    expirationDate: '2026-11-30', marginPercent: 40, status: 'en-stock',
    lots: [{ id: 'lot-4a', code: 'LOT-2024-M05', quantity: 89, expirationDate: '2026-11-30' }],
    movements: [{ id: 'mv-4a', type: 'vente', quantity: -11, date: '2026-08-09', user: 'K. Diallo' }],
  },
  {
    id: 'inv-5', name: 'Oméprazole 20mg', code: 'OMP-20', category: 'Gastro-entérologie',
    imageUrl: '/products/omp-20.svg', salePrice: 5500, stock: 45, unit: 'u.',
    expirationDate: '2027-01-15', marginPercent: 45, status: 'en-stock',
    lots: [{ id: 'lot-5a', code: 'LOT-2024-O02', quantity: 45, expirationDate: '2027-01-15' }],
    movements: [{ id: 'mv-5a', type: 'vente', quantity: -5, date: '2026-08-08', user: 'A. Kouassi' }],
  },
  {
    id: 'inv-6', name: 'Chloroquine 100mg', code: 'CHLOR-100', category: 'Antipaludéens',
    imageUrl: '/products/chlor-100.svg', salePrice: 2800, stock: 203, unit: 'u.',
    expirationDate: '2026-08-31', marginPercent: 32, status: 'en-stock',
    lots: [{ id: 'lot-6a', code: 'LOT-2024-C09', quantity: 203, expirationDate: '2026-08-31' }],
    movements: [{ id: 'mv-6a', type: 'vente', quantity: -17, date: '2026-08-09', user: 'K. Diallo' }],
  },
  {
    id: 'inv-7', name: 'Ciprofloxacine 500mg', code: 'CIPRO-500', category: 'Antibiotiques',
    imageUrl: '/products/cipro-500.svg', salePrice: 6200, stock: 12, unit: 'u.',
    expirationDate: '2026-10-20', marginPercent: 37, status: 'critique',
    lots: [{ id: 'lot-7a', code: 'LOT-2024-C14', quantity: 12, expirationDate: '2026-10-20' }],
    movements: [
      { id: 'mv-7a', type: 'vente', quantity: -3, date: '2026-08-10', user: 'A. Kouassi' },
      { id: 'mv-7b', type: 'vente', quantity: -9, date: '2026-08-05', user: 'K. Diallo' },
    ],
  },
  {
    id: 'inv-8', name: 'Sérum physiologique 500ml', code: 'SERUM-500', category: 'Soins',
    imageUrl: '/products/serum-500.svg', salePrice: 800, stock: 412, unit: 'u.',
    expirationDate: '2027-06-30', marginPercent: 28, status: 'en-stock',
    lots: [{ id: 'lot-8a', code: 'LOT-2024-S21', quantity: 412, expirationDate: '2027-06-30' }],
    movements: [{ id: 'mv-8a', type: 'vente', quantity: -28, date: '2026-08-09', user: 'A. Kouassi' }],
  },
  {
    id: 'inv-9', name: 'Artéméther-Luméfantrine', code: 'ART-LUM', category: 'Antipaludéens',
    imageUrl: '/products/art-lum.svg', salePrice: 3500, stock: 67, unit: 'u.',
    expirationDate: '2027-02-28', marginPercent: 43, status: 'en-stock',
    lots: [{ id: 'lot-9a', code: 'LOT-2024-L06', quantity: 67, expirationDate: '2027-02-28' }],
    movements: [{ id: 'mv-9a', type: 'vente', quantity: -13, date: '2026-08-07', user: 'K. Diallo' }],
  },
  {
    id: 'inv-10', name: 'Vitamine C 500mg', code: 'VIT-C500', category: 'Vitamines',
    imageUrl: '/products/vit-c500.svg', salePrice: 1200, stock: 234, unit: 'u.',
    expirationDate: '2027-09-30', marginPercent: 55, status: 'en-stock',
    lots: [{ id: 'lot-10a', code: 'LOT-2024-V18', quantity: 234, expirationDate: '2027-09-30' }],
    movements: [{ id: 'mv-10a', type: 'vente', quantity: -16, date: '2026-08-09', user: 'A. Kouassi' }],
  },
  {
    id: 'inv-11', name: 'Zinc + Vitamine C effervescent', code: 'ZINC-VC', category: 'Vitamines',
    imageUrl: '/products/zinc-vc.svg', salePrice: 2500, stock: 98, unit: 'u.',
    expirationDate: '2027-04-15', marginPercent: 51, status: 'en-stock',
    lots: [{ id: 'lot-11a', code: 'LOT-2024-Z04', quantity: 98, expirationDate: '2027-04-15' }],
    movements: [{ id: 'mv-11a', type: 'vente', quantity: -9, date: '2026-08-08', user: 'K. Diallo' }],
  },
  {
    id: 'inv-12', name: 'Diclofénac 75mg injectable', code: 'DIC-75', category: 'Anti-inflammatoires',
    imageUrl: '/products/dic-75.svg', salePrice: 3800, stock: 5, unit: 'u.',
    expirationDate: '2026-09-01', marginPercent: 33, status: 'critique',
    lots: [{ id: 'lot-12a', code: 'LOT-2024-D08', quantity: 5, expirationDate: '2026-09-01' }],
    movements: [{ id: 'mv-12a', type: 'vente', quantity: -7, date: '2026-08-09', user: 'A. Kouassi' }],
  },
  {
    id: 'inv-13', name: 'Cotrimoxazole 480mg', code: 'COTRI-480', category: 'Antibiotiques',
    imageUrl: '/products/cotri-480.svg', salePrice: 2100, stock: 167, unit: 'u.',
    expirationDate: '2026-12-15', marginPercent: 36, status: 'en-stock',
    lots: [{ id: 'lot-13a', code: 'LOT-2024-K11', quantity: 167, expirationDate: '2026-12-15' }],
    movements: [{ id: 'mv-13a', type: 'vente', quantity: -14, date: '2026-08-07', user: 'K. Diallo' }],
  },
  {
    id: 'inv-14', name: 'Quinine 300mg', code: 'QUI-300', category: 'Antipaludéens',
    imageUrl: '/products/qui-300.svg', salePrice: 1800, stock: 0, unit: 'u.',
    expirationDate: '2025-12-31', marginPercent: 31, status: 'expire',
    lots: [{ id: 'lot-14a', code: 'LOT-2023-Q02', quantity: 0, expirationDate: '2025-12-31' }],
    movements: [{ id: 'mv-14a', type: 'vente', quantity: -40, date: '2025-12-20', user: 'A. Kouassi' }],
  },
  {
    id: 'inv-15', name: 'Multivitamines Junior', code: 'MULTI-JR', category: 'Vitamines',
    imageUrl: '/products/multi-jr.svg', salePrice: 4200, stock: 78, unit: 'u.',
    expirationDate: '2027-08-20', marginPercent: 58, status: 'en-stock',
    lots: [{ id: 'lot-15a', code: 'LOT-2024-J09', quantity: 78, expirationDate: '2027-08-20' }],
    movements: [{ id: 'mv-15a', type: 'vente', quantity: -6, date: '2026-08-08', user: 'K. Diallo' }],
  },
];

export const mockInventoryStats: InventoryStats = {
  activeProducts: 247,
  activeProductsTrend: 5,
  stockValue: 18_400_000,
  stockValueTrend: 3,
  criticalStock: 7,
  criticalStockTrend: -2,
  expiringSoon: 12,
  expiringSoonTrend: null,
  averageMargin: 40.1,
  averageMarginTrend: 2,
};