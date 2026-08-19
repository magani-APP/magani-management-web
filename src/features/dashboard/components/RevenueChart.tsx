"use client";

import React from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { RevenueData } from "../../../mocks/dashboard.mock";

interface RevenueChartProps {
  data: RevenueData[];
}

export function RevenueChart({ data }: RevenueChartProps) {
  return (
    <div className="p-5 rounded-2xl border border-border-card bg-white/88 flex flex-col h-[340px]">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-[14px] font-bold text-text-primary mb-1">
            Évolution du chiffre d'affaires
          </h3>
          <p className="text-[11px] font-medium text-text-muted">
            8 dernières semaines · en FCFA
          </p>
        </div>
        <div className="flex items-center gap-4 text-[11px] font-medium">
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-0.5 bg-brand-primary rounded-full"></div>
            <span className="text-text-secondary">CA</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-0.5 bg-brand-accent rounded-full"></div>
            <span className="text-text-secondary">Marge</span>
          </div>
        </div>
      </div>

      <div className="flex-1 w-full h-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorCa" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0B8F68" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#0B8F68" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8EDEA" />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: "#9AAEA3", fontWeight: 600 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: "#9AAEA3", fontWeight: 600 }}
              tickFormatter={(value) => `${value.toFixed(1)}M`}
              domain={[0, 6.0]}
              ticks={[0.0, 1.5, 3.0, 4.5, 6.0]}
            />
            <Tooltip
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.08)', fontSize: '12px' }}
              itemStyle={{ fontWeight: 600 }}
            />
            <Area
              type="monotone"
              dataKey="marge"
              stroke="#A8F24A"
              strokeWidth={2}
              fill="none"
              activeDot={{ r: 4, fill: "#A8F24A", strokeWidth: 0 }}
            />
            <Area
              type="monotone"
              dataKey="ca"
              stroke="#0B8F68"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorCa)"
              activeDot={{ r: 4, fill: "#0B8F68", strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
