import { EmployeePerformance } from "@/types/reports";

interface EmployeesReportProps {
  data: EmployeePerformance[];
}

const formatFCFA = (value: number) => {
  return value.toLocaleString("fr-FR") + " FCFA";
};

export function EmployeesReport({ data }: EmployeesReportProps) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-[20px] font-bold text-text-foreground">Performances par employé</h2>
        <p className="text-[12px] font-medium text-text-muted mt-1">
          Chiffre d&apos;affaires et statistiques par caissier · août 2026
        </p>
      </div>

      <div className="rounded-2xl border border-border-card bg-surface-main overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-alt border-b border-border-divider">
              <th className="py-3.5 px-4 text-[9px] font-bold text-text-placeholder uppercase tracking-[0.08em]">Employé</th>
              <th className="py-3.5 px-4 text-[9px] font-bold text-text-placeholder uppercase tracking-[0.08em] text-center">Ventes</th>
              <th className="py-3.5 px-4 text-[9px] font-bold text-text-placeholder uppercase tracking-[0.08em] text-right">CA généré</th>
              <th className="py-3.5 px-4 text-[9px] font-bold text-text-placeholder uppercase tracking-[0.08em] text-right">Panier moyen</th>
              <th className="py-3.5 px-4 text-[9px] font-bold text-text-placeholder uppercase tracking-[0.08em] w-[180px] text-right">PART DU CA</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr 
                key={row.id} 
                className="border-b border-border-divider hover:bg-surface-alt transition-colors last:border-0"
              >
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#F0F7F3] flex items-center justify-center border border-[rgba(11,143,104,0.1)] text-[10px] font-bold text-brand-primary">
                      {row.initials}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[11px] font-bold text-text-foreground leading-tight">{row.name}</span>
                      <span className="text-[10px] font-medium text-text-muted mt-0.5">{row.role}</span>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4 text-[11px] font-medium text-text-foreground text-center">{row.salesCount}</td>
                <td className="py-4 px-4 text-[11px] font-bold text-text-foreground text-right">{formatFCFA(row.revenue)}</td>
                <td className="py-4 px-4 text-[11px] font-medium text-text-muted text-right">{formatFCFA(row.averageBasket)}</td>
                <td className="py-4 px-4">
                  <div className="flex items-center justify-end gap-3">
                    <div className="flex-1 h-1.5 bg-surface-alt rounded-full overflow-hidden border border-border-card max-w-[80px]">
                      <div 
                        className="h-full bg-brand-primary rounded-full" 
                        style={{ width: `${row.revenueShare}%` }}
                      />
                    </div>
                    <span className="text-[11px] font-medium text-text-muted w-8 text-right">{row.revenueShare}%</span>
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
