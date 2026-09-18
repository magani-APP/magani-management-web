"use client";

import { SalesReportData, PaymentsData, TopProductData, CategorySalesData } from "@/types/reports";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { cn } from "../../../lib/utils";
import { Wallet, ShoppingCart, TrendingUp, Users, ArrowUpRight, ArrowDownRight, Calendar, ChevronDown, PieChart as PieChartIcon, Receipt, Tags, Trophy } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";

interface SalesReportProps {
  data: SalesReportData;
  timeFilter: "7days" | "14days" | "30days" | "90days";
  onTimeFilterChange: (filter: "7days" | "14days" | "30days" | "90days") => void;
  paymentsData?: PaymentsData;
  topProductsData?: TopProductData[];
  categorySalesData?: CategorySalesData[];
}

const formatFCFA = (value: number) => {
  return value.toLocaleString("fr-FR") + " FCFA";
};

const formatPercent = (value: number) => {
  const prefix = value > 0 ? "+" : "";
  return `${prefix}${value.toLocaleString("fr-FR").replace("-", "")}%`;
};

const TrendIndicator = ({ value, label }: { value?: number; label?: string }) => {
  if (value === undefined) return null;
  const isPositive = value > 0;
  const Icon = isPositive ? ArrowUpRight : ArrowDownRight;
  const colorClass = isPositive ? "text-[#0B8F68]" : "text-[#EF4444]";
  
  return (
    <div className="flex items-center gap-1 mt-1">
      <Icon className={cn("w-3 h-3", colorClass)} />
      <span className={cn("text-[10px] font-bold", colorClass)}>{formatPercent(value)}</span>
      {label && <span className="text-[10px] font-medium text-text-placeholder ml-1">{label}</span>}
    </div>
  );
};

export function SalesReport({ 
  data, 
  timeFilter, 
  onTimeFilterChange,
  paymentsData,
  topProductsData,
  categorySalesData
}: SalesReportProps) {
  // Sort history descending for the table (newest first)
  const sortedHistory = [...data.history].reverse();

  const hasSalesData = data.history.some((h) => h.revenue > 0 || h.transactions > 0);
  const hasPaymentsData = !!paymentsData && paymentsData.modes.length > 0 && paymentsData.totalAmount > 0;
  const hasCategoryData = (categorySalesData || []).length > 0;
  const hasTopProductsData = (topProductsData || []).length > 0;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-[16px] font-bold text-text-foreground">Rapport de ventes</h2>
          <p className="text-xs font-medium text-text-muted mt-1">
            Évolution du chiffre d&apos;affaires quotidien
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 justify-end">
          <div className="flex bg-surface-main p-1 rounded-full border border-border-card">
            {(["7days", "14days", "30days", "90days"] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => onTimeFilterChange(filter)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-[12px] font-bold transition-colors",
                  timeFilter === filter
                    ? "bg-brand-primary text-white"
                    : "text-text-muted hover:text-brand-primary"
                )}
              >
                {filter.replace("days", " jours")}
              </button>
            ))}
          </div>
          
          <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-border-card bg-white text-[12px] font-bold text-text-muted cursor-pointer hover:bg-surface-alt transition-colors">
            <Calendar className="w-3.5 h-3.5" />
            <span>27 juil. 2026</span>
            <span className="text-text-placeholder px-1">→</span>
            <span>09 août 2026</span>
            <ChevronDown className="w-3.5 h-3.5 ml-1 text-text-placeholder" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI Cards */}
        <div className="p-5 rounded-2xl bg-white/88 border border-border-card hover:shadow-[0_8px_24px_rgba(11,143,104,0.05)] transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-[#E8F5F1] flex items-center justify-center text-[#0B8F68]">
                <Wallet className="w-4 h-4" />
              </div>
              <div className="text-[10px] font-bold text-text-placeholder uppercase tracking-[0.08em]">CA TOTAL</div>
            </div>
            <div className="text-[24px] font-bold text-brand-primary tracking-tight">{formatFCFA(data.totalRevenue)}</div>
          </div>
          <TrendIndicator value={data.revenueTrend} label="vs période précédente" />
        </div>
        
        <div className="p-5 rounded-2xl bg-white/88 border border-border-card hover:shadow-[0_8px_24px_rgba(11,143,104,0.05)] transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-[#E8F5F1] flex items-center justify-center text-[#0B8F68]">
                <ShoppingCart className="w-4 h-4" />
              </div>
              <div className="text-[10px] font-bold text-text-placeholder uppercase tracking-[0.08em]">TRANSACTIONS</div>
            </div>
            <div className="text-[24px] font-bold text-brand-primary tracking-tight">{data.totalTransactions}</div>
          </div>
          <TrendIndicator value={data.transactionsTrend} label="vs période précédente" />
        </div>
        
        <div className="p-5 rounded-2xl bg-white/88 border border-border-card hover:shadow-[0_8px_24px_rgba(11,143,104,0.05)] transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-[#EFF6FF] flex items-center justify-center text-[#3B82F6]">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div className="text-[10px] font-bold text-text-placeholder uppercase tracking-[0.08em]">PANIER MOYEN</div>
            </div>
            <div className="text-[24px] font-bold text-[#3B82F6] tracking-tight">{formatFCFA(data.averageBasket)}</div>
          </div>
          <TrendIndicator value={data.basketTrend} label="vs période précédente" />
        </div>

        <div className="p-5 rounded-2xl bg-white/88 border border-border-card hover:shadow-[0_8px_24px_rgba(11,143,104,0.05)] transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-[#E8F5F1] flex items-center justify-center text-[#0B8F68]">
                <Users className="w-4 h-4" />
              </div>
              <div className="text-[10px] font-bold text-text-placeholder uppercase tracking-[0.08em]">NOUVEAUX CLIENTS</div>
            </div>
            <div className="text-[24px] font-bold text-brand-primary tracking-tight">{data.totalNewCustomers}</div>
          </div>
          <TrendIndicator value={data.newCustomersTrend} label="vs période précédente" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-white/88 border border-border-card h-[360px] flex flex-col">
          <div className="text-[14px] font-bold text-text-foreground mb-4">CA quotidien (FCFA)</div>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.history} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0B8F68" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#0B8F68" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: '#9AAEA3', fontWeight: 600 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: '#9AAEA3', fontWeight: 600 }}
                  tickFormatter={(val) => `${val / 1000}k`}
                />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}
                  itemStyle={{ color: '#0B8F68', fontSize: '12px', fontWeight: 700 }}
                  labelStyle={{ color: '#6B7A6F', fontSize: '10px', fontWeight: 700, marginBottom: '4px' }}
                  formatter={(value: string | number | readonly (string | number)[] | undefined) => [formatFCFA(Number(value || 0)), "CA"]}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#0B8F68"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Donut Chart */}
        <div className="p-5 rounded-2xl bg-white/88 border border-border-card h-[360px] flex flex-col">
          <div className="text-[14px] font-bold text-text-foreground mb-4">Répartition par mode de paiement</div>
          {hasPaymentsData ? (
            <>
              <div className="flex-1 min-h-0 relative flex items-center justify-center">
                <div className="w-48 h-48 relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={paymentsData?.modes || []}
                        cx="50%"
                        cy="50%"
                        innerRadius="70%"
                        outerRadius="100%"
                        paddingAngle={3}
                        dataKey="share"
                        stroke="none"
                      >
                        {(paymentsData?.modes || []).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <div className="text-[16px] font-bold text-text-foreground">{formatFCFA(paymentsData?.totalAmount || 0).replace(" FCFA", "")}</div>
                    <div className="text-[10px] font-bold text-text-placeholder uppercase">FCFA</div>
                  </div>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2">
                {(paymentsData?.modes || []).map((mode) => (
                  <div key={mode.id} className="flex flex-col items-start">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: mode.color }} />
                      <span className="text-[11px] font-medium text-text-muted">{mode.mode}</span>
                    </div>
                    <span className="text-[11px] font-bold text-text-foreground ml-4">{mode.share}%</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex-1 min-h-0 flex items-center justify-center">
              <EmptyState
                icon={PieChartIcon}
                title="Aucun paiement enregistré"
                description="La répartition par mode de règlement s'affichera ici dès que des ventes auront été encaissées."
              />
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Table */}
        <div className="lg:col-span-2 rounded-2xl border border-border-card bg-white/88 overflow-hidden h-fit flex flex-col">
          <div className="p-5 border-b border-border-divider">
            <h3 className="text-[14px] font-bold text-text-foreground">Détail des ventes journalières</h3>
          </div>
          {hasSalesData ? (
            <div className="overflow-x-auto no-scrollbar">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="bg-surface-alt border-b border-border-divider">
                    <th className="py-3.5 px-5 text-[9px] font-bold text-text-placeholder uppercase tracking-[0.08em]">Date</th>
                    <th className="py-3.5 px-5 text-[9px] font-bold text-text-placeholder uppercase tracking-[0.08em]">CA Journalier</th>
                    <th className="py-3.5 px-5 text-[9px] font-bold text-text-placeholder uppercase tracking-[0.08em]">Transactions</th>
                    <th className="py-3.5 px-5 text-[9px] font-bold text-text-placeholder uppercase tracking-[0.08em]">Panier moyen</th>
                    <th className="py-3.5 px-5 text-[9px] font-bold text-text-placeholder uppercase tracking-[0.08em]">Évolution</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedHistory.map((row, index) => (
                    <tr
                      key={index}
                      className="border-b border-border-divider hover:bg-surface-alt transition-colors last:border-0"
                    >
                      <td className="py-3.5 px-5 text-[11px] font-medium text-text-foreground flex items-center gap-2">
                        {row.date}
                        {row.isToday && (
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#0B8F68] text-white">
                            Aujourd&apos;hui
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-5 text-[11px] font-bold text-text-foreground">{formatFCFA(row.revenue)}</td>
                      <td className="py-3.5 px-5 text-[11px] font-medium text-text-muted">{row.transactions}</td>
                      <td className="py-3.5 px-5 text-[11px] font-medium text-text-muted">{formatFCFA(row.averageBasket)}</td>
                      <td className="py-3.5 px-5">
                        {row.evolution !== undefined ? (
                          <div className={cn(
                            "inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold",
                            row.evolution > 0 ? "text-[#0B8F68] bg-[#E8F5F1]" : "text-[#EF4444] bg-[#FEF2F2]"
                          )}>
                            {row.evolution > 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                            {formatPercent(row.evolution).replace("+", "")}
                          </div>
                        ) : (
                          <span className="text-[11px] text-text-placeholder">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState
              icon={Receipt}
              title="Aucune vente enregistrée"
              description="Le détail des ventes journalières apparaîtra ici dès que des transactions seront enregistrées."
            />
          )}
        </div>

        {/* Right column - Ventes par catégorie & Top 5 produits */}
        <div className="flex flex-col gap-6">
          <div className="p-5 rounded-2xl bg-white/88 border border-border-card">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-[14px] font-bold text-text-foreground">Ventes par catégorie</h3>
              <button className="text-[11px] font-bold text-brand-primary hover:underline">Voir tout</button>
            </div>
            {hasCategoryData ? (
              <div className="space-y-4">
                {(categorySalesData || []).map((cat, idx) => (
                  <div key={idx} className="flex flex-col gap-1.5">
                    <div className="flex justify-between text-[11px]">
                      <span className="font-medium text-text-foreground">{cat.category}</span>
                      <span className="font-bold text-text-foreground">{cat.percent}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-surface-alt rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full" 
                        style={{ width: `${cat.percent}%`, backgroundColor: cat.color || "#0B8F68" }} 
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Tags}
                title="Aucune catégorie vendue"
                description="La répartition des ventes par catégorie s'affichera ici dès vos premières ventes."
                className="py-8"
              />
            )}
          </div>

          <div className="p-5 rounded-2xl bg-white/88 border border-border-card">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-[14px] font-bold text-text-foreground">Top 5 produits vendus</h3>
              <button className="text-[11px] font-bold text-brand-primary hover:underline">Voir tout</button>
            </div>
            {hasTopProductsData ? (
              <div className="space-y-4">
                {(topProductsData || []).slice(0, 5).map((prod, idx) => (
                  <div key={prod.id} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-md bg-surface-alt flex items-center justify-center text-[11px] font-bold text-text-muted">
                      {idx + 1}
                    </div>
                    <div className="flex-1 flex justify-between items-center min-w-0">
                      <span className="text-[12px] font-medium text-text-foreground truncate pr-2">{prod.name}</span>
                      <span className="text-[11px] font-medium text-text-muted whitespace-nowrap">{prod.unitsSold} ventes</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-border-card bg-white">
                <EmptyState
                  icon={Trophy}
                  title="Aucun produit vendu"
                  description="Votre classement des meilleurs produits apparaîtra ici dès vos premières ventes."
                  className="py-8"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
