"use client";

import React, { useState } from "react";

type Period = "Aujourd'hui" | "Semaine" | "Ce mois";

const PERIODS: Period[] = ["Aujourd'hui", "Semaine", "Ce mois"];

export function DashboardHeader() {

  const [activePeriod, setActivePeriod] = useState<Period>("Ce mois");

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end justify-between mb-6">
      <div>
        <h1 className="text-[20px] font-bold text-text-primary mb-1">
          Bonjour, Dr. Diallo
        </h1>
        <p className="text-[11px] font-medium text-text-muted">
          Dimanche 9 août 2026 · Pharmacie Centrale, Abidjan-Plateau
        </p>
      </div>

      <div className="flex bg-surface-alt bg-white/88 rounded-full p-1 border border-border-card">
        {
          PERIODS.map((period) => {
            const isActive = activePeriod === period;
            return (
              <button
                key={period}
                onClick={() => setActivePeriod(period)}
                className={`px-3 py-1.5 text-[12px] font-bold rounded-full transition-colors ${isActive ?
                  "text-white bg-brand-primary shadow-button" :
                  "text-text-hairline hover:text-text-primary"
                  }`}
              >
                {period}
              </button>
            )
          })
        }
      </div>
    </div>
  );
}
