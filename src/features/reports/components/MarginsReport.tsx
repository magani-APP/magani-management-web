import { MarginData } from "@/types/reports";
import { Pill } from "lucide-react";

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

      <div className="max-w-[710px] rounded-2xl border border-border-card bg-surface-main overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-muted border-b border-border-divider">
              <th className="py-3.5 px-4 text-[9px] font-bold text-text-placeholder uppercase tracking-[0.08em]">Produit</th>
              <th className="py-3.5 px-4 text-[9px] font-bold text-text-placeholder uppercase tracking-[0.08em] w-[200px]">Marge %</th>
              <th className="py-3.5 px-4 text-[9px] font-bold text-text-placeholder uppercase tracking-[0.08em] text-right">CA généré</th>
              <th className="py-3.5 px-4 text-[9px] font-bold text-text-placeholder uppercase tracking-[0.08em] text-right">Marge nette estimée</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr
                key={row.id}
                className="bg-white/88 border-b border-border-divider hover:bg-surface-alt transition-colors last:border-0"
              >
                <td className="py-4 px-4 text-[11px] font-bold text-text-foreground">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-[#F0F7F3] flex items-center justify-center border border-[rgba(11,143,104,0.1)]">
                      <Pill size={12} className="text-brand-primary opacity-60" />
                    </div>
                    {row.name}
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-1.5 bg-surface-alt rounded-full overflow-hidden border border-border-card">
                      <div
                        className="h-full bg-brand-primary rounded-full"
                        style={{ width: `${row.marginPercent}%`, backgroundColor: '#A8F24A' }}
                      />
                    </div>
                    <span className="text-[11px] font-bold text-text-foreground w-8">{row.marginPercent}%</span>
                  </div>
                </td>
                <td className="py-4 px-4 text-[11px] font-bold text-text-foreground text-right">{formatFCFA(row.revenue)}</td>
                <td className="py-4 px-4 text-[11px] font-bold text-brand-primary text-right">{formatFCFA(row.netMargin)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
