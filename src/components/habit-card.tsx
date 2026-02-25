"use client";

import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import { Check, Trophy, Flame } from "lucide-react";
import { cn } from "@/components/providers/theme-provider";

interface HabitCardProps {
  id: string;
  name: string;
  goal: number;
  completedDays: number;
  isCompletedToday: boolean;
  streak: number;
  onToggle: (id: string) => void;
}

export function HabitCard({ 
  id, 
  name, 
  goal, 
  completedDays, 
  isCompletedToday, 
  streak,
  onToggle 
}: HabitCardProps) {
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const data = [
    { name: "Completed", value: completedDays },
    { name: "Remaining", value: Math.max(0, goal - completedDays) },
  ];

  const percentage = Math.round((completedDays / goal) * 100);

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="glass-card p-6 rounded-2xl flex flex-col gap-6"
    >
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-1">
          <h3 className="font-display text-xl font-bold tracking-tight">{name}</h3>
          <div className="flex items-center gap-2 text-sm opacity-60">
            <Flame className="w-4 h-4 text-orange-500" />
            <span>{streak} day streak</span>
          </div>
        </div>
        
        <div className="w-16 h-16 relative">
          {isMounted && (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={20}
                  outerRadius={28}
                  paddingAngle={0}
                  dataKey="value"
                  startAngle={90}
                  endAngle={450}
                >
                  <Cell fill="var(--color-brand-primary)" stroke="none" />
                  <Cell fill="rgba(var(--foreground), 0.05)" stroke="none" opacity={0.2} />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          )}
          <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold">
            {percentage}%
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center text-sm">
          <span>Monthly Progress</span>
          <span className="font-mono">{completedDays} / {goal} days</span>
        </div>
        
        <button
          onClick={() => onToggle(id)}
          className={cn(
            "w-full py-4 rounded-xl flex items-center justify-center gap-3 transition-all duration-300 font-bold",
            isCompletedToday 
              ? "bg-brand-primary/10 text-brand-primary border-2 border-brand-primary"
              : "bg-foreground text-background hover:scale-[1.02] active:scale-[0.98]"
          )}
        >
          {isCompletedToday ? (
            <>
              <Trophy className="w-5 h-5 animate-bounce" />
              <span>Goal Reached Today!</span>
            </>
          ) : (
            <>
              <Check className="w-5 h-5" />
              <span>Mark as Done</span>
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}
