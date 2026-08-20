import { StockValueData } from "@/types/reports";
import { Package } from "lucide-react";

interface StockValueReportProps {
  data: StockValueData;
}

const formatFCFA = (value: number) => {
  return value.toLocaleString("fr-FR") + " FCFA";
};

export function StockValueReport({ data }: StockValueReportProps) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-[20px] font-bold text-text-foreground">Valeur totale du stock</h2>
        <p className="text-[12px] font-medium text-text-muted mt-1">
          Inventaire valorisé au prix de vente · 09/08/2026
        </p>
      </div>

      <div className="p-5 rounded-2xl bg-surface-main border border-border-card shadow-[0_4px_12px_rgba(11,143,104,0.03)] flex items-center gap-5">
        <div className="w-12 h-12 rounded-xl bg-[#F0F7F3] flex items-center justify-center border border-[rgba(11,143,104,0.1)]">
          <Package size={24} className="text-brand-primary" />
        </div>
        <div>
          <div className="text-[9px] font-bold text-text-placeholder uppercase tracking-[0.08em] mb-1">VALEUR TOTALE DU STOCK (PRIX DE VENTE)</div>
          <div className="text-[22px] font-bold text-text-foreground tracking-tight">{formatFCFA(data.totalValue)}</div>
        </div>
      </div>

      <div className="rounded-2xl border border-border-card bg-surface-main overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-alt border-b border-border-divider">
              <th className="py-3.5 px-4 text-[9px] font-bold text-text-placeholder uppercase tracking-[0.08em]">Catégorie</th>
              <th className="py-3.5 px-4 text-[9px] font-bold text-text-placeholder uppercase tracking-[0.08em] text-center">Références</th>
              <th className="py-3.5 px-4 text-[9px] font-bold text-text-placeholder uppercase tracking-[0.08em] text-center">Unités</th>
              <th className="py-3.5 px-4 text-[9px] font-bold text-text-placeholder uppercase tracking-[0.08em] text-right">Valeur estimée</th>
              <th className="py-3.5 px-4 text-[9px] font-bold text-text-placeholder uppercase tracking-[0.08em] w-[200px] text-right">% DU STOCK</th>
            </tr>
          </thead>
          <tbody>
            {data.categories.map((row) => (
              <tr 
                key={row.id} 
                className="border-b border-border-divider hover:bg-surface-alt transition-colors last:border-0"
              >
                <td className="py-4 px-4 text-[11px] font-bold text-text-foreground">{row.category}</td>
                <td className="py-4 px-4 text-[11px] font-medium text-text-muted text-center">{row.references}</td>
                <td className="py-4 px-4 text-[11px] font-medium text-text-foreground text-center">{row.units} u.</td>
                <td className="py-4 px-4 text-[11px] font-bold text-text-foreground text-right">{formatFCFA(row.estimatedValue)}</td>
                <td className="py-4 px-4">
                  <div className="flex items-center justify-end gap-3">
                    <div className="w-12 h-1.5 bg-surface-alt rounded-full overflow-hidden border border-border-card">
                      <div 
                        className="h-full bg-brand-primary rounded-full" 
                        style={{ width: `${row.stockPercent}%` }}
                      />
                    </div>
                    <span className="text-[11px] font-medium text-text-muted w-6 text-right">{row.stockPercent}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
