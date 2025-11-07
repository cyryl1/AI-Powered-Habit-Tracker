"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { BASE_URL } from "../../config";

interface Habit {
  id: string;
  name: string;
  description: string;
  frequency: string;
  streak?: number;
  last_completed?: string;
  completion_history?: string[];
}

interface HabitListProps {
  onHabitUpdated?: () => void;
}

const HabitList = ({ onHabitUpdated }: HabitListProps) => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [completingId, setCompletingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchHabits = async () => {
    if (!user) {
      setError("User not authenticated. Please log in.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}habits/`, {
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to fetch habits.");
      }

      const data: Habit[] = await response.json();
      setHabits(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHabits();
  }, [user]);

  const completeHabit = async (habitId: string) => {
    setCompletingId(habitId);
    try {
      const response = await fetch(`${BASE_URL}habits/${habitId}/complete`, {
        method: "POST",
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to complete habit.");
      }

      // Refresh habits list and notify parent
      await fetchHabits();
      if (onHabitUpdated) {
        onHabitUpdated();
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setCompletingId(null);
    }
  };

  const deleteHabit = async (habitId: string) => {
    if (!confirm("Are you sure you want to delete this habit? This action cannot be undone.")) return;
    
    setDeletingId(habitId);
    try {
      const response = await fetch(`${BASE_URL}habits/${habitId}`, {
        method: "DELETE",
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to delete habit.");
      }

      // Refresh habits list and notify parent
      await fetchHabits();
      if (onHabitUpdated) {
        onHabitUpdated();
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="inline-flex items-center space-x-2 animate-pulse text-cyan-300 font-mono">
          <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
          <span>LOADING_HABIT_DATA...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 border border-red-400/30 bg-red-400/10 rounded text-red-300 font-mono text-sm">
        <span className="text-red-400">ERROR:</span> {error}
        <button 
          onClick={fetchHabits}
          className="ml-4 px-3 py-1 border border-red-400/30 rounded hover:bg-red-400/10 transition-colors"
        >
          RETRY
        </button>
      </div>
    );
  }

  if (habits.length === 0) {
    return (
      <div className="p-8 border-2 border-dashed border-cyan-400/20 rounded-lg text-center">
        <div className="text-6xl mb-4 opacity-30">💫</div>
        <div className="text-cyan-300 font-mono text-lg mb-2">NO_HABITS_INITIALIZED</div>
        <div className="text-gray-400 font-mono text-sm">
          Use the habit creation matrix above to initialize your first habit protocol.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {habits.map((habit) => {
        const isCompleted = habit.last_completed ? 
          new Date(habit.last_completed).toDateString() === new Date().toDateString() : false;
        const isToday = new Date().toDateString();
        const lastCompletedDate = habit.last_completed ? new Date(habit.last_completed).toDateString() : null;
        
        return (
          <div 
            key={habit.id} 
            className={`border rounded-lg p-4 transition-all duration-300 backdrop-blur-sm ${
              isCompleted ? 
                'border-green-400/40 bg-green-400/10 shadow-lg shadow-green-400/10' : 
                'border-cyan-400/30 bg-black/40 hover:border-cyan-400/50 hover:shadow-lg hover:shadow-cyan-400/5'
            }`}
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h3 className="font-mono text-lg text-cyan-300 mb-1">{habit.name}</h3>
                {habit.description && (
                  <p className="text-gray-400 text-sm mb-2">{habit.description}</p>
                )}
              </div>
              
              <div className="flex space-x-2 ml-4">
                <button 
                  onClick={() => deleteHabit(habit.id)}
                  disabled={deletingId === habit.id}
                  className={`p-2 rounded border transition-all duration-300 ${
                    deletingId === habit.id ? 
                    'border-red-400/30 bg-red-400/10 text-red-300/50 animate-pulse' :
                    'border-red-400/30 bg-red-400/10 text-red-300 hover:bg-red-400/20 hover:border-red-400/50'
                  }`}
                  title="Delete habit"
                >
                  {deletingId === habit.id ? '⟳' : '✕'}
                </button>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex space-x-4 text-xs font-mono">
                <span className="text-gray-500">
                  FREQ: <span className="text-purple-300">{habit.frequency.toUpperCase()}</span>
                </span>
                
                {habit.streak !== undefined && habit.streak > 0 && (
                  <span className="text-gray-500">
                    STREAK: <span className="text-orange-300">{habit.streak} days</span>
                  </span>
                )}
                
                {habit.last_completed && (
                  <span className="text-gray-500">
                    LAST: <span className="text-blue-300">{formatDate(habit.last_completed)}</span>
                  </span>
                )}
              </div>
              
              <button
                onClick={() => completeHabit(habit.id)}
                disabled={isCompleted || completingId === habit.id}
                className={`px-4 py-2 rounded text-sm font-mono border transition-all duration-300 ${
                  isCompleted ? 
                    'bg-green-400/20 border-green-400/40 text-green-300 cursor-default' : 
                    completingId === habit.id ?
                    'bg-cyan-400/10 border-cyan-400/30 text-cyan-300/50 animate-pulse' :
                    'bg-cyan-400/10 border-cyan-400/30 text-cyan-300 hover:bg-cyan-400/20 hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-400/10'
                }`}
              >
                {isCompleted ? (
                  <span className="flex items-center space-x-2">
                    <span>✓</span>
                    <span>COMPLETED</span>
                  </span>
                ) : completingId === habit.id ? (
                  <span className="flex items-center space-x-2">
                    <div className="w-3 h-3 border-2 border-cyan-300 border-t-transparent rounded-full animate-spin"></div>
                    <span>PROCESSING...</span>
                  </span>
                ) : (
                  <span className="flex items-center space-x-2">
                    <span>⚡</span>
                    <span>COMPLETE</span>
                  </span>
                )}
              </button>
            </div>

            {/* Streak Visualization */}
            {habit.streak !== undefined && habit.streak > 0 && (
              <div className="mt-3">
                <div className="flex items-center space-x-2 text-xs text-gray-500 font-mono mb-1">
                  <span>STREAK_PROGRESS:</span>
                  <span className="text-orange-300">{habit.streak} days</span>
                </div>
                <div className="w-full bg-gray-700/30 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-orange-400 to-yellow-400 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((habit.streak / 30) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Summary Footer */}
      <div className="pt-4 border-t border-cyan-400/20">
        <div className="text-gray-400 font-mono text-xs flex justify-between">
          <span>
            <span className="text-green-400">$</span> TOTAL_HABITS: {habits.length}
          </span>
          <span>
            COMPLETED_TODAY: {habits.filter(h => new Date(h.last_completed || '').toDateString() === new Date().toDateString()).length}
          </span>
        </div>
      </div>
    </div>
  );
};

export default HabitList;