"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext"; // Corrected path and hook

interface Habit {
  id: string;
  name: string;
  description: string;
  frequency: string;
}

const HabitList = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchHabits = async () => {
      if (!user) {
        setError("User not authenticated. Please log in.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("http://localhost:8000/api/v1/habits/", { // Updated API endpoint
          credentials: 'include',
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || "Failed to fetch habits.");
        }

        const data: Habit[] = await response.json();
        setHabits(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHabits();
  }, [user]);

  if (loading) {
    return <div className="text-center py-4">Loading habits...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">Error: {error}</div>;
  }

  if (habits.length === 0) {
    return <div className="text-center py-4 text-gray-500">No habits added yet.</div>;
  }

  return (
    <div className="space-y-4">
      {habits.map((habit) => (
        <div key={habit.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">{habit.name}</h3>
          <p className="text-gray-600">{habit.description}</p>
          <p className="text-sm text-gray-500">Frequency: {habit.frequency}</p>
          {/* Add more habit details or actions here if needed */}
        </div>
      ))}
    </div>
  );
};

export default HabitList;