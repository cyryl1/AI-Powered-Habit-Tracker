'use client';

import React, { useState, useEffect } from 'react';
import { BASE_URL } from '@/config';
import Loading from '@/components/ui/Loading';

interface Suggestion {
  habit_id: string;
  habit_name: string;
  current_time: string | null;
  suggested_time: string;
  reason: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function SmartScheduleModal({ isOpen, onClose }: Props) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [applying, setApplying] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchSuggestions();
    }
  }, [isOpen]);

  const fetchSuggestions = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}ai/schedule-suggestions`, {
        credentials: 'include',
      });
      if (res.ok) {
        const data = await res.json();
        setSuggestions(data.suggestions);
      }
    } catch (error) {
      console.error('Error fetching schedule suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  const applySuggestion = async (suggestion: Suggestion) => {
    setApplying(suggestion.habit_id);
    try {
      // In a real app, you'd update the habit's reminder_time here
      // For now, we'll just simulate it since our Habit model doesn't strictly enforce time fields yet
      // We would call PUT /habits/{id} with { reminder_time: suggestion.suggested_time }
      
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Remove from list
      setSuggestions(prev => prev.filter(s => s.habit_id !== suggestion.habit_id));
      alert(`Reminder set for ${suggestion.habit_name} at ${suggestion.suggested_time}!`);
    } catch (error) {
      alert('Failed to update reminder.');
    } finally {
      setApplying(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-gray-900 border border-cyan-500/30 rounded-2xl w-full max-w-2xl overflow-hidden shadow-[0_0_50px_rgba(34,211,238,0.1)]">
        <div className="p-6 border-b border-gray-800 flex justify-between items-center">
          <h2 className="text-2xl font-light text-cyan-300 flex items-center gap-2">
            <span className="text-xl">⏱️</span> SMART_SCHEDULER
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
        </div>

        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {loading ? (
            <div className="py-12">
              <Loading text="ANALYZING_TEMPORAL_PATTERNS..." />
            </div>
          ) : suggestions.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="mb-2">No patterns detected yet.</p>
              <p className="text-sm">Keep logging habits to generate data for the neural engine.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {suggestions.map((s) => (
                <div key={s.habit_id} className="bg-black/40 border border-gray-800 rounded-xl p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between hover:border-cyan-500/30 transition-colors">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white mb-1">{s.habit_name}</h3>
                    <p className="text-gray-400 text-sm mb-2">{s.reason}</p>
                    <div className="flex items-center gap-2 text-xs font-mono">
                      <span className="text-gray-500">CURRENT: {s.current_time || 'NONE'}</span>
                      <span className="text-gray-600">→</span>
                      <span className="text-green-400">SUGGESTED: {s.suggested_time}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => applySuggestion(s)}
                    disabled={applying === s.habit_id}
                    className="px-4 py-2 bg-cyan-500/10 text-cyan-400 border border-cyan-500/50 rounded-lg hover:bg-cyan-500/20 transition-all font-mono text-sm whitespace-nowrap"
                  >
                    {applying === s.habit_id ? 'UPDATING...' : 'APPLY_TIME'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}