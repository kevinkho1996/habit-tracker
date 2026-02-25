"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, LogOut, ShieldCheck, Mail, X } from "lucide-react";

interface UserMenuProps {
  user: any;
  onSignIn: () => void;
  onLogout: () => void;
}

export function UserMenu({ user, onSignIn, onLogout }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="relative w-10 h-10 md:w-12 md:h-12 rounded-2xl overflow-hidden glass-card border-2 border-transparent hover:border-brand-primary/30 transition-all active:scale-95 cursor-pointer flex items-center justify-center group"
      >
        {user?.photoURL ? (
          <img 
            src={user.photoURL} 
            alt={user.displayName || "User"} 
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform"
          />
        ) : (
          <User className="w-5 h-5 md:w-6 md:h-6 opacity-40 group-hover:opacity-100 transition-opacity" />
        )}
        
        {/* {user && (
          <div className="absolute top-1 right-1 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-background shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
        )} */}
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Blurred Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-background/60 backdrop-blur-md"
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="glass-card w-full max-w-sm rounded-[2.5rem] shadow-2xl p-8 relative z-10 border border-white/10 overflow-hidden"
            >
              {/* Close Button */}
              <button 
                onClick={() => setIsOpen(false)}
                className="absolute top-6 right-6 p-2 hover:bg-foreground/5 rounded-xl transition-all hover:rotate-90 active:scale-75 cursor-pointer"
              >
                <X className="w-5 h-5 opacity-40" />
              </button>

              {user ? (
                <div className="flex flex-col items-center text-center">
                  <div className="w-24 h-24 rounded-3xl overflow-hidden shadow-2xl border-2 border-brand-primary/20 mb-6 group">
                     <img 
                      src={user.photoURL} 
                      alt="" 
                      referrerPolicy="no-referrer" 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                    />
                  </div>
                  
                  <div className="mb-8">
                    <h2 className="font-display text-2xl font-bold tracking-tight mb-1">
                      {user.displayName || "User"}
                    </h2>
                    <div className="flex items-center justify-center gap-1.5 opacity-40">
                      <Mail className="w-3 h-3" />
                      <p className="text-[10px] font-medium uppercase tracking-widest">{user.email}</p>
                    </div>
                  </div>

                  <div className="w-full space-y-3">
                    <div className="flex items-center justify-center gap-2 py-2 px-4 bg-brand-primary/10 rounded-xl text-[10px] font-bold uppercase tracking-widest text-brand-primary mb-4 self-center inline-flex">
                      <ShieldCheck className="w-3 h-3" />
                      Encrypted Session Active
                    </div>
                    
                    <button
                      onClick={() => {
                        onLogout();
                        setIsOpen(false);
                      }}
                      className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all group font-bold uppercase tracking-[0.1em] text-[10px] cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      Terminate Session
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 rounded-3xl bg-foreground/5 flex items-center justify-center mb-6">
                    <User className="w-10 h-10 opacity-20" />
                  </div>
                  
                  <h2 className="font-display text-2xl font-bold tracking-tight mb-3">
                    Secure Sync
                  </h2>
                  <p className="text-sm opacity-50 font-medium leading-relaxed mb-8 px-4">
                    Authenticate your identity to preserve discipline history and synchronize across operative terminals.
                  </p>
                  
                  <button
                    onClick={() => {
                      onSignIn();
                      setIsOpen(false);
                    }}
                    className="w-full bg-white text-[#1f1f1f] py-4 rounded-2xl font-bold text-[11px] uppercase tracking-[0.1em] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-4 cursor-pointer shadow-xl border border-black/5"
                  >
                     <img 
                      src="https://www.gstatic.com/images/branding/product/1x/googleg_48dp.png" 
                      alt="Google" 
                      className="w-5 h-5 transition-transform group-hover:scale-110" 
                    />
                     Sign in With Google
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
