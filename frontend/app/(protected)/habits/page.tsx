'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import HabitForm from '@/components/features/HabitForm';
import HabitList from '@/components/features/HabitList';
import SmartScheduleModal from '@/components/features/SmartScheduleModal';

export default function HabitsPage() {
  const [refreshHabits, setRefreshHabits] = useState(0);
  const [isSchedulerOpen, setIsSchedulerOpen] = useState(false);

  const handleHabitCreated = () => {
    setRefreshHabits(prev => prev + 1);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-light text-cyan-300">HABIT_MATRIX_PROTOCOL</h1>
        <div className="flex gap-3">
          <button 
            onClick={() => setIsSchedulerOpen(true)}
            className="px-4 py-2 bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 rounded hover:bg-cyan-500/30 transition-all font-mono text-sm flex items-center gap-2"
          >
            <span>⏱️</span> SMART_SCHEDULE
          </button>
          <Link 
            href="/habits/wizard" 
            className="px-4 py-2 bg-purple-500/20 text-purple-300 border border-purple-500/50 rounded hover:bg-purple-500/30 transition-all font-mono text-sm flex items-center gap-2"
          >
            <span>✨</span> AI_GOAL_WIZARD
          </Link>
        </div>
      </div>
      
      <SmartScheduleModal 
        isOpen={isSchedulerOpen} 
        onClose={() => setIsSchedulerOpen(false)} 
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <HabitForm onHabitCreated={handleHabitCreated} />
        </div>
        <div>
          <h2 className="text-2xl font-light text-cyan-300 mb-4">Your Habits</h2>
          <HabitList key={refreshHabits} />
        </div>
      </div>
    </div>
  );
}