'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BASE_URL } from '@/config';
import { useAuth } from '@/context/AuthContext';

interface SuggestedHabit {
  name: string;
  description: string;
  frequency: string;
  reason: string;
}

interface BreakdownResponse {
  habits: SuggestedHabit[];
  advice: string;
}

export default function HabitWizardPage() {
  const [goal, setGoal] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<BreakdownResponse | null>(null);
  const [selectedHabits, setSelectedHabits] = useState<number[]>([]);
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goal.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch(`${BASE_URL}ai/breakdown`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ goal }),
        credentials: 'include',
      });

      if (!response.ok) throw new Error('Failed to generate plan');

      const data = await response.json();
      setResult(data);
      // Select all by default
      setSelectedHabits(data.habits.map((_: any, i: number) => i));
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to generate habits. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleHabit = (index: number) => {
    setSelectedHabits(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const handleSave = async () => {
    if (!result || selectedHabits.length === 0) return;

    setSaving(true);
    try {
      const habitsToCreate = selectedHabits.map(index => {
        const h = result.habits[index];
        return {
          name: h.name,
          description: h.description,
          frequency: h.frequency,
          reminder_enabled: false // Default
        };
      });

      // Create habits sequentially
      for (const habit of habitsToCreate) {
        await fetch(`${BASE_URL}habits/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(habit),
          credentials: 'include',
        });
      }

      router.push('/habits');
    } catch (error) {
      console.error('Error saving habits:', error);
      alert('Failed to save some habits.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <button 
          onClick={() => router.back()}
          className="text-cyan-400 hover:text-cyan-300 mb-4 font-mono text-sm"
        >
          ← BACK_TO_MATRIX
        </button>
        <h1 className="text-4xl font-light text-cyan-300 mb-2">NEURAL_GOAL_WIZARD</h1>
        <p className="text-gray-400">Input a high-level objective. The AI will deconstruct it into executable protocols.</p>
      </div>

      {!result && (
        <div className="bg-black/60 border border-cyan-400/30 rounded-xl p-8 backdrop-blur-sm">
          <form onSubmit={handleGenerate} className="space-y-6">
            <div>
              <label className="block text-cyan-300 font-mono text-sm mb-2">PRIMARY_OBJECTIVE</label>
              <input
                type="text"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="e.g., Run a marathon, Learn Python, Sleep better..."
                className="w-full bg-black/50 border border-gray-700 rounded-lg p-4 text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none transition-all"
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              disabled={loading || !goal.trim()}
              className={`w-full py-4 rounded-lg font-mono text-lg transition-all ${
                loading || !goal.trim()
                  ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                  : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 hover:bg-cyan-500/30 hover:border-cyan-400'
              }`}
            >
              {loading ? (
                <span className="animate-pulse">PROCESSING_NEURAL_PATHWAYS...</span>
              ) : (
                'INITIALIZE_BREAKDOWN_SEQUENCE'
              )}
            </button>
          </form>
        </div>
      )}

      {result && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Advice Section */}
          <div className="bg-purple-900/20 border border-purple-500/30 rounded-xl p-6">
            <h3 className="text-purple-300 font-mono mb-2">💡 STRATEGIC_ADVICE</h3>
            <p className="text-gray-300 leading-relaxed">{result.advice}</p>
          </div>

          {/* Habits Selection */}
          <div>
            <h3 className="text-cyan-300 font-mono mb-4">DETECTED_PROTOCOLS ({selectedHabits.length} SELECTED)</h3>
            <div className="grid gap-4">
              {result.habits.map((habit, index) => (
                <div 
                  key={index}
                  onClick={() => toggleHabit(index)}
                  className={`cursor-pointer p-6 rounded-xl border transition-all duration-300 ${
                    selectedHabits.includes(index)
                      ? 'bg-cyan-900/20 border-cyan-400/60 shadow-[0_0_15px_rgba(34,211,238,0.1)]'
                      : 'bg-black/40 border-gray-800 hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`mt-1 w-6 h-6 rounded border flex items-center justify-center transition-colors ${
                      selectedHabits.includes(index)
                        ? 'bg-cyan-500 border-cyan-400 text-black'
                        : 'border-gray-600'
                    }`}>
                      {selectedHabits.includes(index) && '✓'}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className={`font-bold text-lg ${
                          selectedHabits.includes(index) ? 'text-cyan-300' : 'text-gray-400'
                        }`}>{habit.name}</h4>
                        <span className="text-xs font-mono px-2 py-1 rounded border border-gray-700 text-gray-500">
                          {habit.frequency.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm mb-2">{habit.description}</p>
                      <p className="text-xs text-gray-500 italic">Why: {habit.reason}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={() => setResult(null)}
              className="flex-1 py-3 rounded-lg border border-gray-700 text-gray-400 hover:bg-gray-800 transition-colors font-mono"
            >
              RESET_SEQUENCE
            </button>
            <button
              onClick={handleSave}
              disabled={saving || selectedHabits.length === 0}
              className={`flex-1 py-3 rounded-lg font-mono font-bold transition-all ${
                saving || selectedHabits.length === 0
                  ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                  : 'bg-green-500/20 text-green-400 border border-green-500/50 hover:bg-green-500/30 hover:border-green-400 shadow-[0_0_20px_rgba(74,222,128,0.1)]'
              }`}
            >
              {saving ? 'SAVING_PROTOCOLS...' : 'CONFIRM_PROTOCOLS'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}