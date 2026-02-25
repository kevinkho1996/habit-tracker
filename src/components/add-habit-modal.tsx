"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/components/providers/theme-provider";

interface AddHabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (habit: { name: string }) => void;
}

export function AddHabitModal({ isOpen, onClose, onAdd }: AddHabitModalProps) {
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    onAdd({ name: name.trim() });
    setName("");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="glass-card w-[92%] sm:w-full max-w-md p-6 md:p-10 rounded-[2.5rem] relative z-10 shadow-2xl border-t border-l border-white/20"
          >
            <div className="flex justify-between items-center mb-8">
              <div className="flex flex-col">
                <h2 className="font-display text-2xl font-black uppercase tracking-tighter leading-none">
                  New Objective
                </h2>
                <div className="h-1 w-8 bg-brand-primary mt-2 rounded-full" />
              </div>
              <button 
                onClick={onClose}
                className="p-3 hover:bg-foreground/5 rounded-2xl transition-all hover:rotate-90 active:scale-75 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-8">
              <div className="flex flex-col gap-3">
                <label className="text-[10px] font-black opacity-30 uppercase tracking-[0.2em] ml-1">
                  What is your win today?
                </label>
                <input
                  autoFocus
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Read for 30 mins"
                  className="bg-foreground/5 border-2 border-transparent focus:border-brand-primary/20 focus:bg-transparent outline-none p-4 md:p-5 rounded-2xl transition-all font-medium text-lg text-foreground placeholder:opacity-20"
                />
              </div>

              <div className="p-4 bg-brand-primary/5 rounded-2xl border border-brand-primary/10">
                <p className="text-[10px] md:text-sm font-medium leading-relaxed opacity-70">
                  <span className="font-bold text-brand-primary">Pro tip:</span> Tasks are binary. You either do them or you don't. Keep them actionable.
                </p>
              </div>

              <button
                type="submit"
                disabled={!name.trim()}
                className={cn(
                  "w-full py-5 rounded-2xl font-black uppercase tracking-[0.1em] transition-all shadow-xl text-xs md:text-sm",
                  name.trim() 
                    ? "bg-brand-primary text-white shadow-brand-primary/30 hover:shadow-brand-primary/40 hover:-translate-y-1 active:translate-y-0"
                    : "bg-foreground/5 opacity-40 cursor-not-allowed text-foreground/50"
                )}
              >
                Assemble Task
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
