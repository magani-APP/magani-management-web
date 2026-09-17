import { TopProductData } from "@/types/reports";
import { Pill, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "../../../lib/utils";
import { EmptyState } from "@/components/ui/EmptyState";

interface TopProductsReportProps {
  data: TopProductData[];
}

const formatFCFA = (value: number) => {
  return value.toLocaleString("fr-FR") + " FCFA";
};

export function TopProductsReport({ data }: TopProductsReportProps) {
  const maxRevenue = Math.max(...data.map(d => d.revenue), 1);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-[16px] font-bold text-text-foreground">Top produits vendus</h2>
        <p className="text-[12px] font-medium text-text-muted mt-1">
          Classement par chiffre d&apos;affaires · août 2026
        </p>
      </div>

      <div className="w-full rounded-2xl border border-border-card bg-surface-main overflow-hidden shadow-sm">
        <div className="overflow-x-auto no-scrollbar">
        <table className="w-full text-left border-collapse min-w-[560px]">
          <thead>
            <tr className="bg-surface-muted border-b border-border-divider">
              <th className="py-4 px-6 text-[9px] font-bold text-text-placeholder uppercase tracking-[0.08em] w-12 text-center">#</th>
              <th className="py-4 px-6 text-[9px] font-bold text-text-placeholder uppercase tracking-[0.08em]">Produit</th>
              <th className="py-4 px-6 text-[9px] font-bold text-text-placeholder uppercase tracking-[0.08em] text-center">Unités vendues</th>
              <th className="py-4 px-6 text-[9px] font-bold text-text-placeholder uppercase tracking-[0.08em] text-right">CA généré</th>
              <th className="py-4 px-6 text-[9px] font-bold text-text-placeholder uppercase tracking-[0.08em] text-right">Tendance</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr
                key={row.id}
                className="bg-white/88 border-b border-border-divider hover:bg-surface-alt transition-colors last:border-0"
              >
                <td className="py-5 px-6 text-[12px] font-bold text-text-placeholder text-center">{row.rank}</td>
                <td className="py-5 px-6">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                      <Pill size={14} className="text-[#0B8F68]" />
                    </div>
                    <div className="flex flex-col gap-1.5 w-48 sm:w-64">
                      <span className="text-[13px] font-bold text-text-foreground truncate">{row.name}</span>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-[#0B8F68] rounded-full" 
                          style={{ width: `${(row.revenue / maxRevenue) * 100}%` }} 
                        />
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-5 px-6 text-[13px] font-bold text-text-foreground text-center">{row.unitsSold}</td>
                <td className="py-5 px-6 text-[13px] font-bold text-text-foreground text-right">{formatFCFA(row.revenue)}</td>
                <td className="py-5 px-6">
                  <div className="flex justify-end">
                    <span className={cn(
                      "inline-flex items-center gap-1 text-[12px] font-bold",
                      row.trend >= 0 ? "text-[#0B8F68]" : "text-[#EF4444]"
                    )}>
                      {row.trend >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                      {Math.abs(row.trend)}%
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
        )}
      </div>
    </div>
  );
}
