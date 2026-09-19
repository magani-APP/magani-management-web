"use client";

import { PaymentsData } from "@/types/reports";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { CreditCard, PieChart as PieChartIcon } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";

interface PaymentsReportProps {
  data: PaymentsData;
}

const formatFCFA = (value: number) => {
  return value.toLocaleString("fr-FR") + " FCFA";
};

export function PaymentsReport({ data }: PaymentsReportProps) {
  const totalAmount = data.modes.reduce((sum, mode) => sum + mode.amount, 0);
  const hasData = data.modes.length > 0 && totalAmount > 0;

  return (
    <div className="w-full flex flex-col gap-6">
      {/* En-tête */}
      <div>
        <h2 className="text-[16px] font-bold text-text-foreground">Rapport des paiements</h2>
        <p className="text-[12px] font-medium text-text-muted mt-1">
          Modes de règlement - août 2026
        </p>
      </div>

      {/* Grille principale */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 items-stretch">
        
        {/* Carte Tableau des détails (Gauche) */}
        <div className="bg-white rounded-2xl border border-border-card shadow-sm overflow-hidden flex flex-col">
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left border-collapse min-w-[500px]">
              <thead>
                <tr className="border-b border-border-divider bg-surface-muted">
                  <th className="py-4 px-6 text-[9px] font-bold text-text-placeholder uppercase tracking-[0.08em]">
                    Mode
                  </th>
                  <th className="py-4 px-6 text-[9px] font-bold text-text-placeholder uppercase tracking-[0.08em] text-center">
                    Transactions
                  </th>
                  <th className="py-4 px-6 text-[9px] font-bold text-text-placeholder uppercase tracking-[0.08em] text-right">
                    Montant
                  </th>
                  <th className="py-4 px-6 text-[9px] font-bold text-text-placeholder uppercase tracking-[0.08em] text-right w-24">
                    Part
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-divider">
                {hasData ? (
                  data.modes.map((row) => (
                    <tr
                      key={row.id}
                      className="hover:bg-surface-alt/50 transition-colors"
                    >
                      <td className="py-5 px-6 text-[13px] font-bold text-text-foreground">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                            style={{ backgroundColor: row.color }}
                          />
                          {row.mode}
                        </div>
                      </td>
                      <td className="py-5 px-6 text-[13px] font-bold text-slate-900 text-center">
                        {row.transactions}
                      </td>
                      <td className="py-5 px-6 text-[13px] font-bold text-slate-900 text-right">
                        {formatFCFA(row.amount)}
                      </td>
                      <td className="py-5 px-6 text-right">
                        <span
                          className="inline-flex items-center justify-center px-2.5 py-1 rounded-full text-[11px] font-bold"
                          style={{
                            backgroundColor: `${row.color}15`,
                            color: row.color,
                          }}
                        >
                          {row.share}%
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="p-0">
                      <div className="bg-white">
                        <EmptyState
                          icon={CreditCard}
                          title="Aucun paiement enregistré"
                          description="Le détail des transactions par mode de règlement s'affichera ici dès que des ventes auront été encaissées."
                        />
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Carte Graphique Donut (Droite) */}
        <div className="bg-white rounded-2xl border border-border-card p-6 shadow-sm flex flex-col">
          <div className="mb-6">
            <h3 className="text-[14px] font-bold text-text-foreground">Répartition des paiements</h3>
            <p className="text-[11px] font-medium text-text-muted mt-0.5">Par mode de règlement - août 2026</p>
          </div>
          
          {hasData ? (
            <>
              <div className="w-full h-[220px] relative mb-6">
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-[10px] font-bold text-text-placeholder uppercase tracking-wider mb-0.5">Total</span>
                  <span className="text-[16px] font-bold text-text-foreground whitespace-nowrap">{formatFCFA(totalAmount)}</span>
                </div>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.modes}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={95}
                      paddingAngle={2}
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

              <div className="flex flex-col gap-3 mt-auto">
                {data.modes.map((row) => (
                  <div key={row.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: row.color }} />
                      <span className="text-[12px] font-medium text-text-muted">{row.mode}</span>
                    </div>
                    <span className="text-[12px] font-bold" style={{ color: row.color }}>{row.share}%</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <EmptyState
                icon={PieChartIcon}
                title="Rien à répartir pour l'instant"
                description="Le graphique de répartition des paiements apparaîtra ici dès vos premières ventes."
              />
            </div>
          )}
        </div>

      </div>
    </div>
  );
}