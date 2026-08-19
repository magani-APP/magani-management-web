import React from "react";
import { Pill, TrendingUp, TrendingDown, ArrowRight } from "lucide-react";
import { TopProduct } from "../../../mocks/dashboard.mock";

interface TopProductsProps {
  data: TopProduct[];
}

export function TopProducts({ data }: TopProductsProps) {
  return (
    <div className="p-5 rounded-2xl border border-border-card bg-white/88 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[14px] font-bold text-text-primary">
          Top produits du mois
        </h3>
        <button className="flex items-center gap-1 text-[11px] font-bold text-brand-primary hover:underline">
          Voir tout <ArrowRight size={12} />
        </button>
      </div>

      <div className="flex flex-col gap-1">
        {data.map((product, index) => {
          const isUp = product.trend === "up";
          return (
            <div
              key={product.id}
              className="flex items-center p-2 rounded-xl hover:bg-surface-alt transition-colors group"
            >
              <div className="w-4 text-[10px] font-bold text-text-hairline mr-2">
                {index + 1}
              </div>
              <div className="w-8 h-8 rounded-full bg-surface-muted flex items-center justify-center mr-3 shrink-0">
                <Pill size={14} className="text-brand-primary" />
              </div>

              <div className="flex-1 min-w-0 mr-4">
                <div className="text-[12px] font-bold text-text-primary truncate mb-0.5">
                  {product.name}
                </div>
                <div className="text-[10px] font-medium text-text-muted">
                  {product.units} unités
                </div>
              </div>

              <div className="text-right shrink-0">
                <div className="text-[12px] font-bold text-text-primary mb-0.5">
                  {product.revenue}
                </div>
                <div
                  className={`flex items-center justify-end text-[10px] font-bold ${isUp ? "text-status-success" : "text-status-danger"
                    }`}
                >
                  {isUp ? (
                    <TrendingUp size={10} className="mr-0.5" />
                  ) : (
                    <TrendingDown size={10} className="mr-0.5" />
                  )}
                  {product.percentage}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
