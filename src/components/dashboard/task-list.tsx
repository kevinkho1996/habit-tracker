"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface Habit {
  id: string;
  name: string;
  isCompletedToday: boolean;
  lastCompletedDate: string | null;
}

interface TaskListProps {
  habits: Habit[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TaskList({ habits, onToggle, onDelete }: TaskListProps) {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex items-center justify-between px-1 mb-6 shrink-0">
        <h2 className="font-display text-xl font-bold tracking-tight uppercase">Daily Missions</h2>
        <span className="text-[10px] font-bold opacity-30 uppercase tracking-[0.2em] bg-foreground/5 px-2 py-1 rounded-md">
          {habits.filter(h => h.isCompletedToday).length}/{habits.length} Done
        </span>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar -mr-2">
        <div className="grid grid-cols-1 gap-4 pb-4">
          <AnimatePresence mode="popLayout" initial={false}>
            {habits.map((habit) => (
              <motion.div
                layout
                key={habit.id}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                className={`group flex items-center justify-between p-4 md:p-5 rounded-2xl border-2 transition-all duration-300 shadow-sm ${
                  habit.isCompletedToday 
                    ? "bg-brand-primary/10 border-brand-primary/20 text-brand-primary" 
                    : "glass-card border-transparent hover:border-brand-primary/20 hover:shadow-md"
                }`}
              >
                <button
                  onClick={() => onToggle(habit.id)}
                  className="flex-1 flex items-center justify-between text-left pr-4 cursor-pointer active:scale-[0.98] transition-transform"
                >
                  <span className={`text-base font-semibold tracking-tight transition-opacity ${habit.isCompletedToday ? "opacity-100" : "opacity-80"}`}>
                    {habit.name}
                  </span>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-500 scale-100 shrink-0 ${
                    habit.isCompletedToday 
                      ? "bg-brand-primary border-brand-primary shadow-lg shadow-brand-primary/40 rotate-0" 
                      : "border-foreground/20 rotate-90"
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
                
                {/* Always visible Trash Button (styled delicately to not be distracting) */}
                <button
                  onClick={() => onDelete(habit.id)}
                  className="p-2 md:p-3 rounded-xl bg-red-500/5 text-red-500/40 opacity-70 md:opacity-0 md:group-hover:opacity-100 focus:opacity-100 transition-all hover:bg-red-500 hover:text-white hover:shadow-lg hover:shadow-red-500/20 shrink-0 cursor-pointer"
                  aria-label={`Delete ${habit.name}`}
                >
                  <X className="w-4 h-4 md:w-5 md:h-5" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        
        {habits.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-24 glass-card rounded-[2.5rem] border-dashed border-2 border-foreground/5 px-8 text-center"
          >
            <div className="w-12 h-12 rounded-full bg-foreground/5 flex items-center justify-center mb-4">
              <div className="w-2 h-2 rounded-full bg-foreground/20 animate-ping" />
            </div>
            <p className="font-display font-black uppercase tracking-[0.3em] text-[10px] mb-2 opacity-30">No active missions</p>
            <p className="text-[9px] opacity-20">Secure Link • {new Date().toLocaleTimeString()}</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
