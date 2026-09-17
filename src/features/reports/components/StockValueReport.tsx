import { StockValueData } from "@/types/reports";
import { Archive } from "lucide-react";

interface StockValueReportProps {
  data: StockValueData;
}

const formatFCFA = (value: number) => {
  return value.toLocaleString("fr-FR") + " FCFA";
};

export function StockValueReport({ data }: StockValueReportProps) {
  return (
    <div className="w-full flex flex-col gap-6">
      <div>
        <h2 className="text-[16px] font-bold text-text-foreground">Valeur totale du stock</h2>
        <p className="text-[12px] font-medium text-text-muted mt-1">
          Inventaire valorisé au prix de vente · 09/08/2026
        </p>
      </div>

      <div className="w-full bg-white/88 p-6 rounded-2xl bg-surface-main border border-border-card shadow-[0_4px_12px_rgba(11,143,104,0.03)] flex items-center gap-5">
        <div className="w-14 h-14 rounded-xl bg-[#F0F7F3] flex items-center justify-center border border-[rgba(11,143,104,0.1)]">
          <Archive size={28} className="text-[#0B8F68]" />
        </div>
        <div>
          <div className="text-[10px] font-bold text-text-placeholder uppercase tracking-[0.08em] mb-1">VALEUR TOTALE DU STOCK (PRIX DE VENTE)</div>
          <div className="text-3xl font-bold text-emerald-600 tracking-tight">{formatFCFA(data.totalValue)}</div>
        </div>
      </div>

      <div className="w-full rounded-2xl border border-border-card bg-surface-main overflow-hidden shadow-sm">
        <div className="overflow-x-auto no-scrollbar">
        <table className="w-full text-left border-collapse min-w-[620px]">
          <thead>
            <tr className="bg-surface-muted border-b border-border-divider">
              <th className="py-4 px-6 text-[9px] font-bold text-text-placeholder uppercase tracking-[0.08em]">Catégorie</th>
              <th className="py-4 px-6 text-[9px] font-bold text-text-placeholder uppercase tracking-[0.08em] text-center">Références</th>
              <th className="py-4 px-6 text-[9px] font-bold text-text-placeholder uppercase tracking-[0.08em] text-center">Unités</th>
              <th className="py-4 px-6 text-[9px] font-bold text-text-placeholder uppercase tracking-[0.08em] text-right">Valeur estimée</th>
              <th className="py-4 px-6 text-[9px] font-bold text-text-placeholder uppercase tracking-[0.08em] w-[250px] text-right">% DU STOCK</th>
            </tr>
          </thead>
          <tbody>
            {data.categories.map((row) => (
              <tr
                key={row.id}
                className="bg-white/88 border-b border-border-divider hover:bg-surface-alt transition-colors last:border-0"
              >
                <td className="py-5 px-6 text-[13px] font-bold text-text-foreground">{row.category}</td>
                <td className="py-5 px-6 text-[13px] font-medium text-text-muted text-center">{row.references}</td>
                <td className="py-5 px-6 text-[13px] font-bold text-text-foreground text-center">{row.units} u.</td>
                <td className="py-5 px-6 text-[13px] font-bold text-text-foreground text-right">{formatFCFA(row.estimatedValue)}</td>
                <td className="py-5 px-6">
                  <div className="flex items-center justify-end gap-4">
                    <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-600 rounded-full"
                        style={{ width: `${row.stockPercent}%` }}
                      />
                    </div>
                    <span className="text-[13px] font-bold text-text-foreground w-10 text-right">{row.stockPercent}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
}
