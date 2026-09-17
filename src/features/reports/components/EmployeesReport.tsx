import { EmployeePerformance } from "@/types/reports";

interface EmployeesReportProps {
  data: EmployeePerformance[];
}

const formatFCFA = (value: number) => {
  return value.toLocaleString("fr-FR") + " FCFA";
};

export function EmployeesReport({ data }: EmployeesReportProps) {
  return (
    <div className="w-full flex flex-col gap-6">
      <div>
        <h2 className="text-[16px] font-bold text-text-foreground">Performance par employé</h2>
        <p className="text-[12px] font-medium text-text-muted mt-1">
          Ventes par caissier/pharmacien · août 2026
        </p>
      </div>

      <div className="w-full rounded-2xl border border-border-card bg-surface-main overflow-hidden shadow-sm">
        <div className="overflow-x-auto no-scrollbar">
        <table className="w-full text-left border-collapse min-w-[620px]">
          <thead>
            <tr className="bg-surface-muted border-b border-border-divider">
              <th className="py-4 px-6 text-[9px] font-bold text-text-placeholder uppercase tracking-[0.08em]">Employé</th>
              <th className="py-4 px-6 text-[9px] font-bold text-text-placeholder uppercase tracking-[0.08em] text-center">Ventes</th>
              <th className="py-4 px-6 text-[9px] font-bold text-text-placeholder uppercase tracking-[0.08em] text-right">CA généré</th>
              <th className="py-4 px-6 text-[9px] font-bold text-text-placeholder uppercase tracking-[0.08em] text-right">Panier moyen</th>
              <th className="py-4 px-6 text-[9px] font-bold text-text-placeholder uppercase tracking-[0.08em] w-[250px] text-right">PART DU CA</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr
                key={row.id}
                className="bg-white/88 border-b border-border-divider hover:bg-surface-alt transition-colors last:border-0"
              >
                <td className="py-5 px-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#0B8F68] flex items-center justify-center border border-[rgba(11,143,104,0.1)] text-[11px] font-bold text-white shrink-0">
                      {row.initials}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[13px] font-bold text-text-foreground leading-tight">{row.name}</span>
                      <span className="text-[12px] font-medium text-text-muted mt-0.5">{row.role}</span>
                    </div>
                  </div>
                </td>
                <td className="py-5 px-6 text-[13px] font-bold text-slate-900 text-center">{row.salesCount}</td>
                <td className="py-5 px-6 text-[13px] font-bold text-slate-900 text-right">{formatFCFA(row.revenue)}</td>
                <td className="py-5 px-6 text-[13px] font-bold text-slate-900 text-right">{formatFCFA(row.averageBasket)}</td>
                <td className="py-5 px-6">
                  <div className="flex items-center justify-end gap-4">
                    <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-600 rounded-full"
                        style={{ width: `${row.revenueShare}%` }}
                      />
                    </div>
                    <span className="text-[13px] font-medium text-text-muted w-10 text-right">{row.revenueShare}%</span>
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
