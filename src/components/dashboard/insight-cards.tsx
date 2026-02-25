"use client";

import React from "react";
import { LayoutDashboard, Calendar } from "lucide-react";

interface InsightCardsProps {
  activeCount: number;
  perfectCount: number;
}

export function InsightCards({ activeCount, perfectCount }: InsightCardsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-2 gap-4 md:gap-6">
      <div className="group glass-card p-4 md:p-6 rounded-3xl flex flex-col sm:flex-row items-center sm:items-center gap-3 sm:gap-4 relative overflow-hidden transition-all hover:scale-[1.02]">
        <div className="absolute inset-0 bg-brand-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-orange-500/10 flex items-center justify-center shrink-0 relative z-10 shadow-inner">
          <LayoutDashboard className="w-5 h-5 md:w-6 md:h-6 text-orange-500" />
        </div>
        <div className="text-center sm:text-left relative z-10">
          <p className="text-[8px] md:text-[10px] font-black opacity-30 uppercase tracking-[0.2em] mb-0.5">Active</p>
          <p className="text-lg md:text-2xl font-black tracking-tight">{activeCount}</p>
        </div>
      </div>
      <div className="group glass-card p-4 md:p-6 rounded-3xl flex flex-col sm:flex-row items-center sm:items-center gap-3 sm:gap-4 relative overflow-hidden transition-all hover:scale-[1.02]">
        <div className="absolute inset-0 bg-brand-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-green-500/10 flex items-center justify-center shrink-0 relative z-10 shadow-inner">
          <Calendar className="w-5 h-5 md:w-6 md:h-6 text-green-500" />
        </div>
        <div className="text-center sm:text-left relative z-10">
          <p className="text-[8px] md:text-[10px] font-black opacity-30 uppercase tracking-[0.2em] mb-0.5">Perfect</p>
          <p className="text-lg md:text-2xl font-black tracking-tight">{perfectCount}</p>
        </div>
      </div>
    </div>
  );
}
