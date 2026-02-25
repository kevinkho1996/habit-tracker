"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility for tailwind class merging
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  isAuto: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const updateTheme = () => {
      const hour = new Date().getHours();
      // Light: 6 AM - 6 PM, Dark: 6 PM - 6 AM
      const newTheme = hour >= 6 && hour < 18 ? "light" : "dark";
      setTheme(newTheme);
      
      if (newTheme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    };

    updateTheme();
    // Check every minute if theme needs updating
    const interval = setInterval(updateTheme, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, isAuto: true }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
