"use client";

import { SalesReportData } from "@/types/reports";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { cn } from "../../../lib/utils";

interface SalesReportProps {
  data: SalesReportData;
  timeFilter: "7days" | "14days";
  onTimeFilterChange: (filter: "7days" | "14days") => void;
}

const formatFCFA = (value: number) => {
  return value.toLocaleString("fr-FR") + " FCFA";
};

export function SalesReport({ data, timeFilter, onTimeFilterChange }: SalesReportProps) {
  // Sort history descending for the table (newest first)
  const sortedHistory = [...data.history].reverse();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-[16px] font-bold text-text-foreground">Rapport de ventes</h2>
          <p className="text-xs font-medium text-text-muted mt-1">
            Évolution du chiffre d&apos;affaires quotidien
          </p>
        </div>

        <div className="flex bg-surface-main p-1 rounded-full border border-border-card">
          <button
            onClick={() => onTimeFilterChange("7days")}
            className={cn(
              "px-4 py-1.5 rounded-full text-[12px] font-bold transition-colors",
              timeFilter === "7days"
                ? "bg-brand-primary text-white"
                : "text-text-muted hover:text-brand-primary"
            )}
          >
            7 jours
          </button>
          <button
            onClick={() => onTimeFilterChange("14days")}
            className={cn(
              "px-4 py-1.5 rounded-full text-[12px] font-bold transition-colors",
              timeFilter === "14days"
                ? "bg-brand-primary text-white"
                : "text-text-muted hover:text-brand-primary"
            )}
          >
            14 jours
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white/88 border border-border-card hover:shadow-[0_8px_24px_rgba(11,143,104,0.05)] transition-all">
          <div className="text-[9px] font-bold text-text-placeholder uppercase tracking-[0.08em] mb-2">CA TOTAL</div>
          <div className="text-[18px] font-bold text-brand-primary tracking-tight">{formatFCFA(data.totalRevenue)}</div>
        </div>
        <div className="p-5 rounded-2xl bg-white/88 border border-border-card hover:shadow-[0_8px_24px_rgba(11,143,104,0.05)] transition-all">
          <div className="text-[9px] font-bold text-text-placeholder uppercase tracking-[0.08em] mb-2">TRANSACTIONS</div>
          <div className="text-[18px] font-bold text-brand-primary tracking-tight">{data.totalTransactions}</div>
        </div>
        <div className="p-5 rounded-2xl bg-white/88 border border-border-card hover:shadow-[0_8px_24px_rgba(11,143,104,0.05)] transition-all">
          <div className="text-[9px] font-bold text-text-placeholder uppercase tracking-[0.08em] mb-2">PANIER MOYEN</div>
          <div className="text-[18px] font-bold text-[#3B82F6] tracking-tight">{formatFCFA(data.averageBasket)}</div>
        </div>
      </div>

      <div className="p-5 rounded-2xl bg-white/88 border border-border-card h-[320px] flex flex-col">
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

      <div className="rounded-2xl border border-border-card bg-white/88 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-alt border-b border-border-divider">
              <th className="py-3.5 px-4 text-[9px] font-bold text-text-placeholder uppercase tracking-[0.08em] w-1/4">Date</th>
              <th className="py-3.5 px-4 text-[9px] font-bold text-text-placeholder uppercase tracking-[0.08em] w-1/4">CA Journalier</th>
              <th className="py-3.5 px-4 text-[9px] font-bold text-text-placeholder uppercase tracking-[0.08em] w-1/4">Transactions</th>
              <th className="py-3.5 px-4 text-[9px] font-bold text-text-placeholder uppercase tracking-[0.08em] w-1/4">Panier moyen</th>
            </tr>
          </thead>
          <tbody>
            {sortedHistory.map((row, index) => (
              <tr
                key={index}
                className="border-b border-border-divider hover:bg-surface-alt transition-colors last:border-0"
              >
                <td className="py-3.5 px-4 text-[11px] font-medium text-text-foreground flex items-center gap-2">
                  {row.date}
                  {row.isToday && (
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]">
                      Aujourd&apos;hui
                    </span>
                  )}
                </td>
                <td className="py-3.5 px-4 text-[11px] font-bold text-text-foreground">{formatFCFA(row.revenue)}</td>
                <td className="py-3.5 px-4 text-[11px] font-medium text-text-muted">{row.transactions}</td>
                <td className="py-3.5 px-4 text-[11px] font-medium text-text-muted">{formatFCFA(row.averageBasket)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
