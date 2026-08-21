import { TopProductData } from "@/types/reports";
import { Pill, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "../../../lib/utils";

interface TopProductsReportProps {
  data: TopProductData[];
}

const formatFCFA = (value: number) => {
  return value.toLocaleString("fr-FR") + " FCFA";
};

export function TopProductsReport({ data }: TopProductsReportProps) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-[16px] font-bold text-text-foreground">Top produits vendus</h2>
        <p className="text-[12px] font-medium text-text-muted mt-1">
          Classement par chiffre d&apos;affaires · août 2026
        </p>
      </div>

      <div className="max-w-[710px] rounded-2xl border border-border-card bg-surface-main overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-muted border-b border-border-divider">
              <th className="py-3.5 px-4 text-[9px] font-bold text-text-placeholder uppercase tracking-[0.08em] w-12 text-center">#</th>
              <th className="py-3.5 px-4 text-[9px] font-bold text-text-placeholder uppercase tracking-[0.08em]">Produit</th>
              <th className="py-3.5 px-4 text-[9px] font-bold text-text-placeholder uppercase tracking-[0.08em] text-center">Unités vendues</th>
              <th className="py-3.5 px-4 text-[9px] font-bold text-text-placeholder uppercase tracking-[0.08em] text-right">CA généré</th>
              <th className="py-3.5 px-4 text-[9px] font-bold text-text-placeholder uppercase tracking-[0.08em] text-right">Tendance</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr
                key={row.id}
                className="bg-white/88 border-b border-border-divider hover:bg-surface-alt transition-colors last:border-0"
              >
                <td className="py-4 px-4 text-[11px] font-bold text-text-hairline text-center">{row.rank}</td>
                <td className="py-4 px-4 text-[11px] font-bold text-text-foreground">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-[#F0F7F3] flex items-center justify-center border border-[rgba(11,143,104,0.1)]">
                      <Pill size={12} className="text-brand-primary" />
                    </div>
                    {row.name}
                  </div>
                </td>
                <td className="py-4 px-4 text-[11px] font-medium text-text-foreground text-center">{row.unitsSold}</td>
                <td className="py-4 px-4 text-[11px] font-bold text-text-foreground text-right">{formatFCFA(row.revenue)}</td>
                <td className="py-4 px-4 flex justify-center">
                  <span className={cn(
                    "inline-flex items-center gap-1 text-[10px] font-bold",
                    row.trend >= 0 ? "text-brand-primary" : "text-status-danger"
                  )}>
                    {row.trend >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                    {Math.abs(row.trend)}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
