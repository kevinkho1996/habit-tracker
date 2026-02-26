"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Header } from "@/components/dashboard/header";
import { InsightCards } from "@/components/dashboard/insight-cards";
import { TaskList } from "@/components/dashboard/task-list";
import { DisciplineChart } from "@/components/discipline-chart";
import { AddHabitModal } from "@/components/add-habit-modal";
import { useAuth } from "@/components/providers/auth-provider";
import { db, trackEvent } from "@/lib/firebase";
import { 
  collection, 
  onSnapshot, 
  query, 
  addDoc, 
  deleteDoc, 
  updateDoc, 
  doc, 
  serverTimestamp,
  orderBy
} from "firebase/firestore";

interface Habit {
  id: string;
  name: string;
  isCompletedToday: boolean;
  lastCompletedDate: string | null;
}

// History would normally come from a database, using empty/mock for now
const MOCK_HISTORY: number[] = [];
const MOCK_LABELS: string[] = [];

export default function Dashboard() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, signInWithGoogle, logout, loading: authLoading } = useAuth();

  // Firestore Synchronization
  const [isFromCache, setIsFromCache] = useState(false);

  // Track page view
  useEffect(() => {
    trackEvent('page_view', { page_title: 'Dashboard' });
  }, []);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      setHabits([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    console.log("Initializing Firestore sync for user:", user.uid);

    const q = query(
      collection(db, `users/${user.uid}/habits`),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const today = new Date().toISOString().split('T')[0];
        const habitsData = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name,
            lastCompletedDate: data.lastCompletedDate,
            isCompletedToday: data.lastCompletedDate === today
          };
        }) as Habit[];

        setHabits(habitsData);
        setIsFromCache(snapshot.metadata.fromCache);
        setIsLoading(false);
        setError(null);
      },
      (err) => {
        console.error("❌ [Firestore Error]", {
          code: err.code,
          message: err.message,
          cause: err.name
        });
        
        if (err.code === 'permission-denied') {
          setError("Access Denied. Check your Firestore Security Rules or if the API is enabled.");
        } else if (err.code === 'unavailable') {
          setError("Cloud Connection Failed. The Firestore API might be disabled for this project.");
        } else {
          setError(`Sync Error: ${err.message}`);
        }
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user, authLoading]);

  const successRate = useMemo(() => {
    if (!habits || habits.length === 0) return 0;
    const completed = habits.filter(h => h.isCompletedToday).length;
    return Math.round((completed / habits.length) * 100);
  }, [habits]);

  const toggleHabit = async (id: string) => {
    const habit = habits.find(h => h.id === id);
    if (!habit) return;

    const today = new Date().toISOString().split('T')[0];

    if (user) {
      try {
        const habitRef = doc(db, `users/${user.uid}/habits`, id);
        // Toggle lastCompletedDate: if already completed today, clear it; otherwise set to today
        await updateDoc(habitRef, {
          lastCompletedDate: habit.isCompletedToday ? null : today
        });
        trackEvent(habit.isCompletedToday ? 'uncomplete_habit' : 'complete_habit', { habit_id: id });
      } catch (error) {
        console.error("Error toggling habit:", error);
      }
    } else {
      setHabits(prev => prev.map(h => h.id === id ? { 
        ...h, 
        isCompletedToday: !h.isCompletedToday,
        lastCompletedDate: !h.isCompletedToday ? today : null 
      } : h));
    }
  };

  const addHabit = async (newHabit: { name: string }) => {
    if (user) {
      try {
        await addDoc(collection(db, `users/${user.uid}/habits`), {
          name: newHabit.name,
          lastCompletedDate: null,
          createdAt: serverTimestamp(),
        });
        trackEvent('add_habit', { habit_name: newHabit.name });
      } catch (error) {
        console.error("Error adding habit:", error);
      }
    } else {
      const habit: Habit = {
        id: Math.random().toString(36).substr(2, 9),
        name: newHabit.name,
        isCompletedToday: false,
        lastCompletedDate: null,
      };
      setHabits(prev => [...prev, habit]);
    }
  };

  const deleteHabit = async (id: string) => {
    if (user) {
      try {
        await deleteDoc(doc(db, `users/${user.uid}/habits`, id));
        trackEvent('delete_habit', { habit_id: id });
      } catch (error) {
        console.error("Error deleting habit:", error);
      }
    } else {
      setHabits(prev => prev.filter(h => h.id !== id));
    }
  };

  const chartData = [...MOCK_HISTORY, successRate];
  const chartLabels = [...MOCK_LABELS, "Today"];

  return (
    <main className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto pb-24">
      <Header 
        date={new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        onAddClick={() => {
          trackEvent('click_add_objective_button');
          setIsModalOpen(true);
        }}
        user={user}
        onSignIn={signInWithGoogle}
        onLogout={logout}
      />

      {/* Sync Diagnostics */}
      {user && (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 mb-6 -mt-8 px-2 transition-all duration-300">
          <div className="flex items-center gap-2 text-[9px] font-bold opacity-30 uppercase tracking-[0.2em] md:w-auto">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-primary" />
            Account: {user.email}
          </div>
          {/* <div className="flex items-center gap-3 w-full md:w-auto justify-start">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest border transition-colors ${
              isLoading 
                ? "bg-amber-500/10 text-amber-500 border-amber-500/20" 
                : isFromCache
                  ? "bg-red-500/10 text-red-500 border-red-500/20"
                  : "bg-green-500/10 text-green-500 border-green-500/20"
            }`}>
              <div className={`w-1.5 h-1.5 rounded-full ${
                isLoading 
                  ? "bg-amber-500 animate-pulse" 
                  : isFromCache 
                    ? "bg-red-500" 
                    : "bg-green-500"
              }`} />
              {isLoading ? "Verifying Signal..." : isFromCache ? "Local Mode (Offline)" : "Cloud Link Active"}
            </div>
            
            {isFromCache && !isLoading && (
              <button 
                onClick={() => window.location.reload()}
                className="text-[9px] font-bold uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity underline decoration-brand-primary/30"
              >
                Retry Link
              </button>
            )}
          </div> */}
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-500 text-xs font-bold uppercase tracking-tight">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <section className="glass-card p-5 md:p-8 rounded-3xl">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="font-display text-lg md:text-xl font-bold uppercase tracking-tight">Performance</h2>
                <p className="text-[10px] md:text-sm opacity-50">Daily Success Rate (%)</p>
              </div>
              <div className="text-right">
                <span className="text-2xl md:text-4xl font-black text-brand-primary">{successRate}%</span>
                <p className="text-[9px] font-bold opacity-40 uppercase tracking-widest mt-1">Today</p>
              </div>
            </div>
            <div className="h-[220px] md:h-[300px]">
              <DisciplineChart data={chartData} labels={chartLabels} />
            </div>
          </section>

          <InsightCards 
            activeCount={habits.length}
            perfectCount={chartData.filter(v => v === 100).length}
          />
        </div>

        <div className="lg:col-span-1 lg:sticky lg:top-8 lg:h-[calc(100vh-14rem)] flex flex-col">
          {isLoading ? (
            <div className="flex flex-col gap-6">
              <div className="h-8 w-40 bg-foreground/5 rounded-lg animate-pulse" />
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-20 w-full glass-card opacity-50 animate-pulse rounded-2xl" />
                ))}
              </div>
            </div>
          ) : (
            <TaskList 
              habits={habits}
              onToggle={toggleHabit}
              onDelete={deleteHabit}
            />
          )}
        </div>
      </div>

      <AddHabitModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={addHabit}
      />
    </main>
  );
}
