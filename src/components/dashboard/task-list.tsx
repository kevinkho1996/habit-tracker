"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2 } from "lucide-react";

interface Habit {
  id: string;
  name: string;
  isCompletedToday: boolean;
}

interface TaskListProps {
  habits: Habit[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TaskList({ habits, onToggle, onDelete }: TaskListProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between px-1">
        <h2 className="font-display text-xl font-bold tracking-tight">Daily Missions</h2>
        <span className="text-[10px] font-bold opacity-30 uppercase tracking-[0.2em]">
          {habits.filter(h => h.isCompletedToday).length}/{habits.length} Done
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <AnimatePresence mode="popLayout" initial={false}>
          {habits.map((habit) => (
            <motion.div
              layout
              key={habit.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className="group flex items-center gap-3"
            >
              <button
                onClick={() => onToggle(habit.id)}
                className={`flex-1 flex items-center justify-between p-5 rounded-2xl border-2 transition-all duration-300 active:scale-[0.98] cursor-pointer shadow-sm ${
                  habit.isCompletedToday 
                    ? "bg-brand-primary/10 border-brand-primary/10 text-brand-primary" 
                    : "glass-card border-transparent hover:border-brand-primary/20 hover:shadow-md"
                }`}
              >
                <span className={`text-base font-semibold tracking-tight transition-opacity ${habit.isCompletedToday ? "opacity-100" : "opacity-80"}`}>
                  {habit.name}
                </span>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-500 scale-100 ${
                  habit.isCompletedToday 
                    ? "bg-brand-primary border-brand-primary shadow-lg shadow-brand-primary/40 rotate-0" 
                    : "border-foreground/10 rotate-90"
                }`}>
                  {habit.isCompletedToday && (
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-2 h-2 bg-white rounded-full" 
                    />
                  )}
                </div>
              </button>
              
              <button
                onClick={() => onDelete(habit.id)}
                className="p-4 rounded-2xl bg-red-500/5 text-red-500/40 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all hover:bg-red-500 hover:text-white hover:shadow-lg hover:shadow-red-500/20 shrink-0 cursor-pointer"
                aria-label={`Delete ${habit.name}`}
              >
                <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      
      {habits.length === 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          className="flex flex-col items-center justify-center py-24 glass-card rounded-[2.5rem] border-dashed border-2 border-foreground/10"
        >
          <p className="font-display font-black uppercase tracking-[0.3em] text-[10px]">Strategic Void</p>
        </motion.div>
      )}
    </div>
  );
}
