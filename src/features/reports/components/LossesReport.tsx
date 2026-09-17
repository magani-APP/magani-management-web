import { LossesData, LossType } from "@/types/reports";
import { cn } from "../../../lib/utils";
import { Trash2, Package, TriangleAlert } from "lucide-react";

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
    <div className="w-full flex flex-col gap-6">
      <div>
        <h2 className="text-[16px] font-bold text-text-foreground">Pertes & destructions</h2>
        <p className="text-[12px] font-medium text-text-muted mt-1">
          Produits expirés, endommagés ou disparus · 2026
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-white/88 p-6 rounded-2xl bg-surface-main border border-border-card hover:shadow-[0_8px_24px_rgba(11,143,104,0.05)] transition-all flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center shrink-0">
            <Trash2 size={24} className="text-red-500" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-text-placeholder uppercase tracking-[0.08em] mb-1">VALEUR TOTALE DES PERTES</div>
            <div className="text-2xl font-bold text-red-500 tracking-tight">{formatFCFA(data.totalLossValue)}</div>
          </div>
        </div>
        
        <div className="bg-white/88 p-6 rounded-2xl bg-surface-main border border-border-card hover:shadow-[0_8px_24px_rgba(11,143,104,0.05)] transition-all flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-100/50 flex items-center justify-center shrink-0">
            <Package size={24} className="text-[#0B8F68]" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-text-placeholder uppercase tracking-[0.08em] mb-1">PRODUITS CONCERNÉS</div>
            <div className="text-2xl font-bold text-[#F97316] tracking-tight">{data.productsAffected}</div>
          </div>
        </div>
        
        <div className="bg-white/88 p-6 rounded-2xl bg-surface-main border border-border-card hover:shadow-[0_8px_24px_rgba(11,143,104,0.05)] transition-all flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
            <TriangleAlert size={24} className="text-[#0B8F68]" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-text-placeholder uppercase tracking-[0.08em] mb-1">UNITÉS PERDUES</div>
            <div className="text-2xl font-bold text-slate-700 tracking-tight">{data.unitsLost}</div>
          </div>
        </div>
      </div>

      <div className="w-full rounded-2xl border border-border-card bg-surface-main overflow-hidden shadow-sm">
        <div className="overflow-x-auto no-scrollbar">
        <table className="w-full text-left border-collapse min-w-[620px]">
          <thead>
            <tr className="bg-surface-muted border-b border-border-divider">
              <th className="py-4 px-6 text-[9px] font-bold text-text-placeholder uppercase tracking-[0.08em]">Produit</th>
              <th className="py-4 px-6 text-[9px] font-bold text-text-placeholder uppercase tracking-[0.08em] text-center">Type</th>
              <th className="py-4 px-6 text-[9px] font-bold text-text-placeholder uppercase tracking-[0.08em] text-center">Quantité</th>
              <th className="py-4 px-6 text-[9px] font-bold text-text-placeholder uppercase tracking-[0.08em] text-center">Valeur perdue</th>
              <th className="py-4 px-6 text-[9px] font-bold text-text-placeholder uppercase tracking-[0.08em] text-right">Date constatée</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((row) => (
              <tr
                key={row.id}
                className="bg-white/88 border-b border-border-divider hover:bg-surface-alt transition-colors last:border-0"
              >
                <td className="py-5 px-6 text-[13px] font-bold text-text-foreground">{row.name}</td>
                <td className="py-5 px-6 text-center">
                  <span className={cn(
                    "px-2.5 py-1 rounded-full text-[10px] font-bold border",
                    getBadgeStyle(row.type)
                  )}>
                    {row.type}
                  </span>
                </td>
                <td className="py-5 px-6 text-[13px] font-medium text-text-foreground text-center">{row.quantity} u.</td>
                <td className="py-5 px-6 text-[13px] font-bold text-red-600 text-center">{formatFCFA(row.lostValue)}</td>
                <td className="py-5 px-6 text-[13px] font-medium text-text-muted text-right">{row.date}</td>
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
