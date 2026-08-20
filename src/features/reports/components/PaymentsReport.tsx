"use client";

import { PaymentsData } from "@/types/reports";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface PaymentsReportProps {
  data: PaymentsData;
}

const formatFCFA = (value: number) => {
  return value.toLocaleString("fr-FR") + " FCFA";
};

export function PaymentsReport({ data }: PaymentsReportProps) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-[20px] font-bold text-text-foreground">Rapport des paiements</h2>
        <p className="text-[12px] font-medium text-text-muted mt-1">
          Répartition par mode de règlement · août 2026
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-border-card bg-surface-main p-6 shadow-sm flex flex-col items-center justify-center min-h-[350px]">
          <h3 className="text-[14px] font-bold text-text-foreground self-start mb-2">Répartition des paiements</h3>
          <div className="w-full h-[220px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.modes}
                  cx="50%"
                  cy="50%"
                  innerRadius={75}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="amount"
                  stroke="none"
                >
                  {data.modes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}
                  itemStyle={{ fontSize: '12px', fontWeight: 700 }}
                  labelStyle={{ display: 'none' }}
                  formatter={(value: string | number | readonly (string | number)[] | undefined, name: string | number | undefined, props: { payload?: { fill?: string } }) => [
                    formatFCFA(Number(value || 0)), 
                    <span key={String(name)} style={{ color: props?.payload?.fill }}>{name}</span>
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-2">
              <div className="text-[9px] font-bold text-text-placeholder uppercase tracking-[0.08em] mb-1">TOTAL ENCAISSÉ</div>
              <div className="text-[16px] font-bold text-text-foreground tracking-tight">{formatFCFA(data.totalAmount)}</div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border-card bg-surface-main overflow-hidden shadow-sm flex flex-col">
          <div className="p-5 border-b border-border-divider">
             <h3 className="text-[14px] font-bold text-text-foreground">Détails par mode</h3>
          </div>
          <div className="flex-1 overflow-x-auto no-scrollbar">
            <table className="w-full text-left border-collapse min-w-[300px]">
              <thead>
                <tr className="bg-surface-alt border-b border-border-divider">
                  <th className="py-3.5 px-4 text-[9px] font-bold text-text-placeholder uppercase tracking-[0.08em]">Mode</th>
                  <th className="py-3.5 px-4 text-[9px] font-bold text-text-placeholder uppercase tracking-[0.08em] text-center">Transactions</th>
                  <th className="py-3.5 px-4 text-[9px] font-bold text-text-placeholder uppercase tracking-[0.08em] text-right">Montant</th>
                  <th className="py-3.5 px-4 text-[9px] font-bold text-text-placeholder uppercase tracking-[0.08em] text-right">Part</th>
                </tr>
              </thead>
              <tbody>
                {data.modes.map((row) => (
                  <tr 
                    key={row.id} 
                    className="border-b border-border-divider hover:bg-surface-alt transition-colors last:border-0"
                  >
                    <td className="py-4 px-4 text-[11px] font-bold text-text-foreground">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-2.5 h-2.5 rounded-full flex-shrink-0" 
                          style={{ backgroundColor: row.color }}
                        />
                        {row.mode}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-[11px] font-medium text-text-foreground text-center">{row.transactions}</td>
                    <td className="py-4 px-4 text-[11px] font-bold text-text-foreground text-right">{formatFCFA(row.amount)}</td>
                    <td className="py-4 px-4 text-right">
                      <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-md bg-surface-alt border border-border-card text-[10px] font-bold text-text-muted">
                        {row.share}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
