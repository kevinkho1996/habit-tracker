import React from "react";
import { TrendingUp, Plus } from "lucide-react";
import { UserMenu } from "./user-menu";

interface HeaderProps {
  date: string;
  onAddClick: () => void;
  user: any;
  onSignIn: () => void;
  onLogout: () => void;
}

export function Header({ date, onAddClick, user, onSignIn, onLogout }: HeaderProps) {
  return (
    <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 relative">
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-brand-primary/10 rounded-2xl shadow-inner border border-brand-primary/10">
            <TrendingUp className="w-6 h-6 text-brand-primary" />
          </div>
          <div className="flex flex-col">
            <h1 className="font-display text-2xl md:text-4xl font-bold tracking-tight leading-none group-data-[mobile=true]:pr-14">
              Discipline Tracker
            </h1>
            <p className="text-[10px] md:text-sm font-medium opacity-40 mt-1.5 ml-0.5">
              Protocol: Performance Monitoring
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 w-full md:w-auto">
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          <p className="hidden lg:block text-xs font-medium opacity-30 mr-2 uppercase tracking-widest">
            {date}
          </p>
          
          <button 
            onClick={onAddClick}
            className="group bg-brand-primary text-white px-8 py-3.5 rounded-2xl shadow-xl shadow-brand-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex-1 md:flex-none flex items-center justify-center min-w-[160px] border border-white/10"
          >
            <Plus className="w-5 h-5 mr-3 transition-transform group-hover:rotate-90" />
            <span className="text-sm font-bold">New Objective</span>
          </button>
          
          <div className="absolute top-0 right-0 md:relative">
            <UserMenu 
              user={user} 
              onSignIn={onSignIn} 
              onLogout={onLogout} 
            />
          </div>
        </div>
      </div>
    </header>
  );
}
