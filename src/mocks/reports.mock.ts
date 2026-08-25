import {
  SalesReportData,
  TopProductData,
  MarginData,
  StockValueData,
  LossesData,
  EmployeePerformance,
  PaymentsData,
} from "@/types/reports";

export const mockSalesReport: SalesReportData = {
  totalRevenue: 2172000,
  totalTransactions: 429,
  averageBasket: 5063,
  history: [
    { date: "27/07", revenue: 132000, transactions: 26, averageBasket: 5077 },
    { date: "28/07", revenue: 151000, transactions: 30, averageBasket: 5033 },
    { date: "29/07", revenue: 148000, transactions: 30, averageBasket: 4933 },
    { date: "30/07", revenue: 159000, transactions: 31, averageBasket: 5129 },
    { date: "31/07", revenue: 172000, transactions: 34, averageBasket: 5059 },
    { date: "01/08", revenue: 164000, transactions: 32, averageBasket: 5125 },
    { date: "02/08", revenue: 158000, transactions: 31, averageBasket: 5097 },
    { date: "03/08", revenue: 145000, transactions: 29, averageBasket: 5000 },
    { date: "04/08", revenue: 168000, transactions: 33, averageBasket: 5091 },
    { date: "05/08", revenue: 154000, transactions: 30, averageBasket: 5133 },
    { date: "06/08", revenue: 179000, transactions: 35, averageBasket: 5114 },
    { date: "07/08", revenue: 162000, transactions: 32, averageBasket: 5063 },
    { date: "08/08", revenue: 171000, transactions: 34, averageBasket: 5029 },
    { date: "09/08", revenue: 168500, transactions: 34, averageBasket: 4956, isToday: true },
  ],
};

export const mockTopProducts: TopProductData[] = [
  { id: "p1", rank: 1, name: "Paracétamol 500mg", unitsSold: 1247, revenue: 1870500, trend: 12 },
  { id: "p2", rank: 2, name: "Artéméther-Luméfantrine", unitsSold: 342, revenue: 1197000, trend: 8 },
  { id: "p3", rank: 3, name: "Oméprazole 20mg", unitsSold: 218, revenue: 1199000, trend: -3 },
  { id: "p4", rank: 4, name: "Amoxicilline 250mg", unitsSold: 256, revenue: 1152000, trend: 15 },
  { id: "p5", rank: 5, name: "Ciprofloxacine 500mg", unitsSold: 178, revenue: 1103600, trend: -7 },
];

export const mockMargins: MarginData[] = [
  { id: "m1", name: "Multivitamines Junior", marginPercent: 58, revenue: 327600, netMargin: 190008 },
  { id: "m2", name: "Vitamine C 500mg", marginPercent: 55, revenue: 280800, netMargin: 154440 },
  { id: "m3", name: "Zinc + Vitamine C", marginPercent: 51, revenue: 245000, netMargin: 124950 },
  { id: "m4", name: "Oméprazole 20mg", marginPercent: 45, revenue: 539550, netMargin: 242798 },
  { id: "m5", name: "Artéméther-Luméfantrine", marginPercent: 43, revenue: 514710, netMargin: 221325 },
  { id: "m6", name: "Paracétamol 500mg", marginPercent: 42, revenue: 785610, netMargin: 329956 },
];

export const mockStockValue: StockValueData = {
  totalValue: 4338300,
  categories: [
    { id: "c1", category: "Antibiotiques", references: "-", units: 296, estimatedValue: 1048200, stockPercent: 24 },
    { id: "c2", category: "Antipaludéens", references: "-", units: 270, estimatedValue: 849000, stockPercent: 20 },
    { id: "c3", category: "Vitamines", references: "-", units: 410, estimatedValue: 807600, stockPercent: 19 },
    { id: "c4", category: "Anti-inflammatoires", references: "-", units: 161, estimatedValue: 543400, stockPercent: 13 },
    { id: "c5", category: "Analgésiques", references: "-", units: 342, estimatedValue: 513000, stockPercent: 12 },
    { id: "c6", category: "Soins", references: "-", units: 412, estimatedValue: 329600, stockPercent: 8 },
    { id: "c7", category: "Gastro-entérologie", references: "-", units: 45, estimatedValue: 247500, stockPercent: 6 },
  ]
};

export const mockLosses: LossesData = {
  totalLossValue: 128400,
  productsAffected: 4,
  unitsLost: 68,
  items: [
    { id: "l1", name: "Quinine 300mg", type: "Expiré", quantity: 45, lostValue: 81000, date: "31/12/2025" },
    { id: "l2", name: "Pénicilline injectable", type: "Endommagé", quantity: 8, lostValue: 24000, date: "15/07/2026" },
    { id: "l3", name: "Diclofénac crème 30g", type: "Cassé", quantity: 3, lostValue: 9000, date: "02/08/2026" },
    { id: "l4", name: "Sérum glucosé 500ml", type: "Expiré", quantity: 12, lostValue: 14400, date: "28/07/2026" },
  ]
};

export const mockEmployees: EmployeePerformance[] = [
  { id: "e1", name: "Kofi Diallo", initials: "KD", role: "Propriétaire", salesCount: 156, revenue: 845000, averageBasket: 5416, revenueShare: 39 },
  { id: "e2", name: "Aminata Sall", initials: "AS", role: "Pharmacien", salesCount: 124, revenue: 654000, averageBasket: 5274, revenueShare: 30 },
  { id: "e3", name: "Oumar Barry", initials: "OB", role: "Caissier", salesCount: 98, revenue: 412000, averageBasket: 4204, revenueShare: 19 },
  { id: "e4", name: "Fatou Ndiaye", initials: "FN", role: "Stagiaire", salesCount: 51, revenue: 261000, averageBasket: 5117, revenueShare: 12 },
];

export const mockPayments: PaymentsData = {
  totalAmount: 2172000,
  modes: [
    { id: "pm1", mode: "Espèces", transactions: 245, amount: 1194600, share: 50, color: "#0B8F68" },
    { id: "pm2", mode: "Orange Money", transactions: 98, amount: 543000, share: 20, color: "#FF6200" },
    { id: "pm3", mode: "MTN Mobile Money", transactions: 64, amount: 325800, share: 15, color: "#FFC107" },
    { id: "pm4", mode: "Carte Bancaire", transactions: 22, amount: 108600, share: 5, color: "#3B82F6" },
    { id: "pm5", mode: "Mixte", transactions: 34, amount: 171000, share: 10, color: "#8B5CF6" },
  ]
};
