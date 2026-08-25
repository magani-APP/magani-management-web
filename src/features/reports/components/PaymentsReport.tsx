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
    <div className="flex flex-col gap-5">
      {/* En-tête */}
      <div>
        <h2 className="text-[18px] font-bold text-text-foreground">Rapport des paiements</h2>
        <p className="text-[11px] font-medium text-text-muted mt-0.5">
          Modes de règlement - août 2026
        </p>
      </div>

      {/* Grille principale */}
      <div className="grid grid-cols-1 lg:grid-cols-[290px_1fr] gap-4 items-stretch">
        {/* Carte Graphique Donut */}
        <div className="bg-white rounded-2xl border border-border-card p-4 shadow-sm flex items-center justify-center min-h-[280px]">
          <div className="w-full h-[220px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.modes}
                  cx="50%"
                  cy="50%"
                  innerRadius={62}
                  outerRadius={88}
                  paddingAngle={3}
                  dataKey="amount"
                  stroke="none"
                >
                  {data.modes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                  }}
                  itemStyle={{ fontSize: "12px", fontWeight: 700 }}
                  labelStyle={{ display: "none" }}
                  formatter={(
                    value: string | number | readonly (string | number)[] | undefined,
                    name: string | number | undefined,
                    props: { payload?: { fill?: string } }
                  ) => [
                      formatFCFA(Number(value || 0)),
                      <span key={String(name)} style={{ color: props?.payload?.fill }}>
                        {name}
                      </span>,
                    ]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Carte Tableau des détails */}
        <div className="bg-white rounded-2xl border border-border-card shadow-sm overflow-hidden flex flex-col justify-between">
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left border-collapse min-w-[320px]">
              <thead>
                <tr className="border-b border-border-divider bg-surface-muted">
                  <th className="py-3 px-5 text-[9px] font-bold text-text-placeholder uppercase tracking-[0.08em]">
                    Mode
                  </th>
                  <th className="py-3 px-5 text-[9px] font-bold text-text-placeholder uppercase tracking-[0.08em] text-center">
                    Transactions
                  </th>
                  <th className="py-3 px-5 text-[9px] font-bold text-text-placeholder uppercase tracking-[0.08em] text-right">
                    Montant
                  </th>
                  <th className="py-3 px-5 text-[9px] font-bold text-text-placeholder uppercase tracking-[0.08em] text-right">
                    Part
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-divider">
                {data.modes.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-surface-alt/50 transition-colors"
                  >
                    <td className="py-3.5 px-5 text-[11px] font-bold text-text-foreground">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{ backgroundColor: row.color }}
                        />
                        {row.mode}
                      </div>
                    </td>
                    <td className="py-3.5 px-5 text-[11px] font-medium text-text-muted text-center">
                      {row.transactions}
                    </td>
                    <td className="py-3.5 px-5 text-[11px] font-bold text-text-foreground text-right">
                      {formatFCFA(row.amount)}
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <span
                        className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-[10px] font-bold"
                        style={{
                          backgroundColor: `${row.color}15`,
                          color: row.color,
                        }}
                      >
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