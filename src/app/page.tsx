"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Header } from "@/components/dashboard/header";
import { InsightCards } from "@/components/dashboard/insight-cards";
import { TaskList } from "@/components/dashboard/task-list";
import { DisciplineChart } from "@/components/discipline-chart";
import { AddHabitModal } from "@/components/add-habit-modal";
import { useAuth } from "@/components/providers/auth-provider";
import { db } from "@/lib/firebase";
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
        const habitsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Habit[];
        console.log("Firestore sync update. Missions found:", habitsData.length);
        if (habitsData.length === 0 && user) {
          console.log("Verification: Collection users/" + user.uid + "/habits is empty.");
        }
        setHabits(habitsData);
        setIsLoading(false);
        setError(null);
      },
      (err) => {
        console.error("Firestore subscription error:", err);
        setError("Failed to sync with cloud. Check your connection or security rules.");
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

    if (user) {
      try {
        const habitRef = doc(db, `users/${user.uid}/habits`, id);
        await updateDoc(habitRef, {
          isCompletedToday: !habit.isCompletedToday
        });
      } catch (error) {
        console.error("Error toggling habit:", error);
      }
    } else {
      setHabits(prev => prev.map(h => h.id === id ? { ...h, isCompletedToday: !h.isCompletedToday } : h));
    }
  };

  const addHabit = async (newHabit: { name: string }) => {
    if (user) {
      try {
        await addDoc(collection(db, `users/${user.uid}/habits`), {
          name: newHabit.name,
          isCompletedToday: false,
          createdAt: serverTimestamp(),
        });
      } catch (error) {
        console.error("Error adding habit:", error);
      }
    } else {
      const habit: Habit = {
        id: Math.random().toString(36).substr(2, 9),
        name: newHabit.name,
        isCompletedToday: false,
      };
      setHabits(prev => [...prev, habit]);
    }
  };

  const deleteHabit = async (id: string) => {
    if (user) {
      try {
        await deleteDoc(doc(db, `users/${user.uid}/habits`, id));
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
        onAddClick={() => setIsModalOpen(true)}
        user={user}
        onSignIn={signInWithGoogle}
        onLogout={logout}
      />

      {/* Account Verification Debug */}
      {user && (
        <div className="flex flex-col md:flex-row justify-between items-center gap-2 mb-6 -mt-8 px-2 transition-all duration-300">
          <div className="flex items-center gap-2 text-[9px] font-bold opacity-30 uppercase tracking-[0.2em] w-full md:w-auto">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-primary" />
            Active Account: {user.email}
          </div>
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest border ${
            isLoading 
              ? "bg-amber-500/10 text-amber-500 border-amber-500/20" 
              : "bg-green-500/10 text-green-500 border-green-500/20"
          }`}>
            <div className={`w-1.5 h-1.5 rounded-full ${isLoading ? "bg-amber-500 animate-pulse" : "bg-green-500"}`} />
            {isLoading ? "Syncing Logic..." : "Cloud Link Secured"}
          </div>
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

        <div className="lg:col-span-1">
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
