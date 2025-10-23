'use client';

import React, { useState } from 'react';
import HabitForm from '@/components/features/HabitForm';
import HabitList from '@/components/features/HabitList';

export default function HabitsPage() {
  const [refreshHabits, setRefreshHabits] = useState(0);

  const handleHabitCreated = () => {
    setRefreshHabits(prev => prev + 1);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-light text-cyan-300 mb-8">HABIT_MATRIX_PROTOCOL</h1>
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