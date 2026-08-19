"use client";

import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { PaymentData } from "../../../mocks/dashboard.mock";

interface PaymentDonutProps {
  data: PaymentData[];
}

export function PaymentDonut({ data }: PaymentDonutProps) {
  return (
    <div className="p-5 rounded-2xl border border-border-card bg-white/88 h-[340px] flex flex-col">
      <div className="mb-6">
        <h3 className="text-[14px] font-bold text-text-primary mb-1">
          Paiements
        </h3>
        <p className="text-[11px] font-medium text-text-muted">
          Répartition · août 2026
        </p>
      </div>

      <div className="flex-1 flex flex-col md:flex-row items-center justify-between">
        <div className="w-full md:w-1/2 h-[160px] md:h-full relative flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={75}
                paddingAngle={2}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.08)', fontSize: '11px' }}
                itemStyle={{ fontWeight: 600 }}
                formatter={(value: any) => [`${value}%`]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="w-full md:w-1/2 flex flex-col gap-2 mt-4 md:mt-0">
          {data.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-[11px] font-medium text-text-secondary">
                  {item.name}
                </span>
              </div>
              <span className="text-[11px] font-bold text-text-primary">
                {item.value}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
