export interface KpiData {
  label: string;
  value: string;
  trend: "up" | "down" | "neutral";
  percentage: string;
  subText: string;
}

export interface RevenueData {
  name: string;
  ca: number;
  marge: number;
}

export interface PaymentData {
  name: string;
  value: number;
  color: string;
}

export interface AlertData {
  id: string;
  message: string;
  severity: "danger" | "warning" | "info";
  actionLabel: string;
}

export interface TopProduct {
  id: string;
  name: string;
  units: number;
  revenue: string;
  trend: "up" | "down";
  percentage: string;
}

export interface OwnerStats {
  netProfit: string;
  subText: string;
  monthlyGoalProgress: number;
  goalText: string;
  activeEmployees: number;
  serviceRate: number;
}

export const mockKpis: Record<string, KpiData> = {
  revenue: {
    label: "CHIFFRE D'AFFAIRES",
    value: "4 285 000 F",
    trend: "up",
    percentage: "12%",
    subText: "vs mois précédent",
  },
  margin: {
    label: "MARGE BRUTE",
    value: "38,2 %",
    trend: "up",
    percentage: "4%",
    subText: "1 636 900 FCFA net",
  },
  transactions: {
    label: "TRANSACTIONS",
    value: "847",
    trend: "up",
    percentage: "8%",
    subText: "ventes ce mois",
  },
  basket: {
    label: "PANIER MOYEN",
    value: "5 062 F",
    trend: "up",
    percentage: "3%",
    subText: "par transaction",
  },
};

export const mockRevenueChartData: RevenueData[] = [
  { name: "S.1", ca: 3.2, marge: 1.2 },
  { name: "S.2", ca: 3.0, marge: 1.1 },
  { name: "S.3", ca: 3.5, marge: 1.3 },
  { name: "S.4", ca: 3.8, marge: 1.4 },
  { name: "S.5", ca: 3.7, marge: 1.3 },
  { name: "S.6", ca: 4.1, marge: 1.5 },
  { name: "S.7", ca: 4.2, marge: 1.6 },
  { name: "S.8", ca: 4.3, marge: 1.6 },
];

export const mockPaymentData: PaymentData[] = [
  { name: "Espèces", value: 42, color: "#0B8F68" }, // brand.primary
  { name: "MTN MoMo", value: 28, color: "#FFC107" },
  { name: "Orange Money", value: 18, color: "#FF6200" },
  { name: "Carte bancaire", value: 8, color: "#3B82F6" },
  { name: "Mixte", value: 4, color: "#8B5CF6" },
];

export const mockAlerts: AlertData[] = [
  {
    id: "a1",
    message: "Diclofénac 75mg : stock critique (5 unités)",
    severity: "danger",
    actionLabel: "Commander",
  },
  {
    id: "a2",
    message: "Ciprofloxacine 500mg : stock critique (12 unités)",
    severity: "danger",
    actionLabel: "Commander",
  },
  {
    id: "a3",
    message: "Quinine 300mg : lot expiré — retirer du stock",
    severity: "warning",
    actionLabel: "Archiver",
  },
  {
    id: "a4",
    message: "Amoxicilline 250mg : expire dans 45 jours",
    severity: "warning",
    actionLabel: "Voir",
  },
  {
    id: "a5",
    message: "Inventaire mensuel planifié dans 3 jours",
    severity: "info",
    actionLabel: "Préparer",
  },
];

export const mockTopProducts: TopProduct[] = [
  {
    id: "p1",
    name: "Paracétamol 500mg",
    units: 1247,
    revenue: "1871k F",
    trend: "up",
    percentage: "12%",
  },
  {
    id: "p2",
    name: "Artéméther-Luméfantrine",
    units: 342,
    revenue: "1197k F",
    trend: "up",
    percentage: "8%",
  },
  {
    id: "p3",
    name: "Oméprazole 20mg",
    units: 218,
    revenue: "1199k F",
    trend: "down",
    percentage: "3%",
  },
  {
    id: "p4",
    name: "Amoxicilline 250mg",
    units: 256,
    revenue: "1152k F",
    trend: "up",
    percentage: "15%",
  },
  {
    id: "p5",
    name: "Ciprofloxacine 500mg",
    units: 178,
    revenue: "1104k F",
    trend: "down",
    percentage: "7%",
  },
];

export const mockOwnerStats: OwnerStats = {
  netProfit: "986 540 FCFA",
  subText: "après charges du mois",
  monthlyGoalProgress: 86,
  goalText: "4 285k / 5 000k FCFA objectif",
  activeEmployees: 3,
  serviceRate: 94,
};
