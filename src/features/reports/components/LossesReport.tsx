import { LossesData, LossType } from "@/types/reports";
import { cn } from "../../../lib/utils";

interface LossesReportProps {
  data: LossesData;
}

const formatFCFA = (value: number) => {
  return value.toLocaleString("fr-FR") + " FCFA";
};

const getBadgeStyle = (type: LossType) => {
  switch (type) {
    case "Expiré":
      return "bg-[#FEF2F2] text-[#991B1B] border-[#FECACA]";
    case "Endommagé":
      return "bg-[#FFFBEB] text-[#92400E] border-[#FDE68A]";
    case "Cassé":
      return "bg-[#F9FAFB] text-[#6B7280] border-[#E5E7EB]";
  }
};

export function LossesReport({ data }: LossesReportProps) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-[20px] font-bold text-text-foreground">Pertes & destructions</h2>
        <p className="text-[12px] font-medium text-text-muted mt-1">
          Produits expirés, endommagés ou disparus · 2026
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-surface-main border border-border-card hover:shadow-[0_8px_24px_rgba(11,143,104,0.05)] transition-all flex flex-col justify-center">
          <div className="text-[9px] font-bold text-text-placeholder uppercase tracking-[0.08em] mb-2">VALEUR TOTALE DES PERTES</div>
          <div className="text-[22px] font-bold text-status-danger tracking-tight">{formatFCFA(data.totalLossValue)}</div>
        </div>
        <div className="p-5 rounded-2xl bg-surface-main border border-border-card hover:shadow-[0_8px_24px_rgba(11,143,104,0.05)] transition-all flex flex-col justify-center">
          <div className="text-[9px] font-bold text-text-placeholder uppercase tracking-[0.08em] mb-2">PRODUITS CONCERNÉS</div>
          <div className="text-[22px] font-bold text-status-warning tracking-tight">{data.productsAffected}</div>
        </div>
        <div className="p-5 rounded-2xl bg-surface-main border border-border-card hover:shadow-[0_8px_24px_rgba(11,143,104,0.05)] transition-all flex flex-col justify-center">
          <div className="text-[9px] font-bold text-text-placeholder uppercase tracking-[0.08em] mb-2">UNITÉS PERDUES</div>
          <div className="text-[22px] font-bold text-text-placeholder tracking-tight">{data.unitsLost}</div>
        </div>
      </div>

      <div className="rounded-2xl border border-border-card bg-surface-main overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-alt border-b border-border-divider">
              <th className="py-3.5 px-4 text-[9px] font-bold text-text-placeholder uppercase tracking-[0.08em]">Produit</th>
              <th className="py-3.5 px-4 text-[9px] font-bold text-text-placeholder uppercase tracking-[0.08em] text-center">Type</th>
              <th className="py-3.5 px-4 text-[9px] font-bold text-text-placeholder uppercase tracking-[0.08em] text-center">Quantité</th>
              <th className="py-3.5 px-4 text-[9px] font-bold text-text-placeholder uppercase tracking-[0.08em] text-center">Valeur perdue</th>
              <th className="py-3.5 px-4 text-[9px] font-bold text-text-placeholder uppercase tracking-[0.08em] text-right">Date constatée</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((row) => (
              <tr 
                key={row.id} 
                className="border-b border-border-divider hover:bg-surface-alt transition-colors last:border-0"
              >
                <td className="py-4 px-4 text-[11px] font-bold text-text-foreground">{row.name}</td>
                <td className="py-4 px-4 text-center">
                  <span className={cn(
                    "px-2 py-0.5 rounded-full text-[9px] font-bold border",
                    getBadgeStyle(row.type)
                  )}>
                    {row.type}
                  </span>
                </td>
                <td className="py-4 px-4 text-[11px] font-medium text-text-foreground text-center">{row.quantity} u.</td>
                <td className="py-4 px-4 text-[11px] font-bold text-status-danger text-center">{formatFCFA(row.lostValue)}</td>
                <td className="py-4 px-4 text-[11px] font-medium text-text-muted text-right">{row.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
