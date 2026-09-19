import { MarginData } from "@/types/reports";
import { Pill, Percent } from "lucide-react";
import { cn } from "../../../lib/utils";
import { EmptyState } from "@/components/ui/EmptyState";

interface MarginsReportProps {
  data: MarginData[];
}

const formatFCFA = (value: number) => {
  return value.toLocaleString("fr-FR") + " FCFA";
};

export function MarginsReport({ data }: MarginsReportProps) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-[16px] font-bold text-text-foreground">Rapport de marges</h2>
        <p className="text-[12px] font-medium text-text-muted mt-1">
          Produits classés par rentabilité · août 2026
        </p>
      </div>

      <div className="w-full rounded-2xl border border-border-card bg-white overflow-hidden shadow-sm">
        <div className="overflow-x-auto no-scrollbar">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="bg-surface-muted border-b border-border-divider">
              <th className="py-4 px-6 text-[9px] font-bold text-text-placeholder uppercase tracking-[0.08em] w-12 text-center">#</th>
              <th className="py-4 px-6 text-[9px] font-bold text-text-placeholder uppercase tracking-[0.08em]">Produit</th>
              <th className="py-4 px-6 text-[9px] font-bold text-text-placeholder uppercase tracking-[0.08em] w-[200px]">Marge %</th>
              <th className="py-4 px-6 text-[9px] font-bold text-text-placeholder uppercase tracking-[0.08em] text-right">CA généré</th>
              <th className="py-4 px-6 text-[9px] font-bold text-text-placeholder uppercase tracking-[0.08em] text-right">Marge nette estimée</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((row, index) => (
                <tr
                  key={row.id}
                  className="bg-white/88 border-b border-border-divider hover:bg-surface-alt transition-colors last:border-0"
                >
                  <td className="py-5 px-6 text-[12px] font-bold text-text-placeholder text-center">{index + 1}</td>
                  <td className="py-5 px-6">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                        <Pill size={14} className="text-[#0B8F68]" />
                      </div>
                      <span className="text-[13px] font-bold text-text-foreground truncate">{row.name}</span>
                    </div>
                  </td>
                  <td className="py-5 px-6">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-1.5 bg-surface-alt rounded-full overflow-hidden border border-border-card">
                        <div
                          className={cn(
                            "h-full rounded-full",
                            row.marginPercent > 50 ? "bg-lime-500" : "bg-emerald-600"
                          )}
                          style={{ width: `${row.marginPercent}%` }}
                        />
                      </div>
                      <span className="text-[13px] font-bold text-text-foreground w-8">{row.marginPercent}%</span>
                    </div>
                  </td>
                  <td className="py-5 px-6 text-[13px] font-bold text-text-foreground text-right">{formatFCFA(row.revenue)}</td>
                  <td className="py-5 px-6 text-[13px] text-emerald-600 font-semibold text-right">{formatFCFA(row.netMargin)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-0">
                  <div className="bg-white">
                    <EmptyState
                      icon={Percent}
                      title="Aucune marge à afficher"
                      description="Le rapport de marges se remplira automatiquement dès que des ventes auront été enregistrées."
                    />
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
}
