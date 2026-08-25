import React from "react";
import { OwnerStats } from "../../../mocks/dashboard.mock";

interface OwnerViewProps {
  data: OwnerStats;
}

export function OwnerView({ data }: OwnerViewProps) {
  return (
    <div className="p-5 rounded-2xl border border-border-card bg-white/88 flex flex-col h-full">
      <div className="mb-4">
        <h3 className="text-[14px] font-bold text-text-primary">
          Vue propriétaire
        </h3>
      </div>

      <div className="bg-surface-muted border border-border-card rounded-3xl p-4 mb-3">
        <div className="text-[9px] font-bold text-brand-primary uppercase tracking-[0.08em] mb-1">
          Bénéfice net estimé
        </div>
        <div className="text-[22px] font-bold text-brand-deep tracking-tight mb-0.5">
          {data.netProfit}
        </div>
        <div className="text-[11px] font-medium text-text-secondary">
          {data.subText}
        </div>
      </div>

      <div className="mb-3 border border-border-card rounded-3xl p-2">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[9px] font-bold text-text-secondary uppercase tracking-[0.08em]">
            Objectif mensuel
          </span>
          <span className="text-[11px] font-bold text-text-primary">
            {data.monthlyGoalProgress}%
          </span>
        </div>
        <div className="h-2 w-full bg-surface-muted rounded-full overflow-hidden mb-2">
          <div
            className="h-full bg-brand-accent"
            style={{ width: `${data.monthlyGoalProgress}%` }}
          ></div>
        </div>
        <div className="text-[10px] font-medium text-text-muted">
          {data.goalText}
        </div>
      </div>

      <div className="flex gap-3">
        <div className="flex-1 bg-surface-alt rounded-3xl p-3 border border-border-card text-center">
          <div className="text-[16px] font-bold text-text-primary mb-0.5">
            {data.activeEmployees}
          </div>
          <div className="text-[9px] font-bold text-text-placeholder tracking-[0.08em]">
            Employés actifs
          </div>
        </div>
        <div className="flex-1 bg-surface-alt rounded-3xl p-3 border border-border-card text-center">
          <div className="text-[16px] font-bold text-text-primary mb-0.5">
            {data.serviceRate}%
          </div>
          <div className="text-[9px] font-bold text-text-placeholder tracking-[0.08em]">
            Taux de service
          </div>
        </div>
      </div>
    </div>
  );
}
