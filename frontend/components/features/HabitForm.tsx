"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

interface HabitFormProps {
  onHabitCreated?: () => void;
}

const HabitForm = ({ onHabitCreated }: HabitFormProps) => {
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [frequency, setFrequency] = useState<string>("daily");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    if (!user) {
      setError("User not authenticated. Please log in.");
      setLoading(false);
      return;
    }

    // Basic validation
    if (!name.trim()) {
      setError("Habit name is required.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/api/v1/habits/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify({ 
          name: name.trim(), 
          description: description.trim(), 
          frequency 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to create habit.");
      }

      // Clear form
      setName("");
      setDescription("");
      setFrequency("daily");
      setSuccess(true);
      
      // Notify parent component to refresh data
      if (onHabitCreated) {
        onHabitCreated();
      }

      // Auto-clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);

    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 border border-red-400/30 bg-red-400/10 rounded text-red-300 font-mono text-sm">
          <span className="text-red-400">ERROR:</span> {error}
        </div>
      )}
      
      {success && (
        <div className="p-3 border border-green-400/30 bg-green-400/10 rounded text-green-300 font-mono text-sm">
          <span className="text-green-400">SUCCESS:</span> Habit created successfully!
        </div>
      )}
      
      <div>
        <label htmlFor="name" className="block text-sm font-mono text-cyan-300 mb-2">
          <span className="text-green-400">➜</span> HABIT_NAME
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full px-3 py-2 bg-black/50 border border-cyan-400/30 rounded-md 
                    text-white font-mono text-sm focus:outline-none focus:border-cyan-400 
                    focus:ring-1 focus:ring-cyan-400 placeholder-gray-500 transition-all duration-300"
          placeholder="Enter habit name (e.g., Morning Exercise)"
          disabled={loading}
        />
      </div>
      
      <div>
        <label htmlFor="description" className="block text-sm font-mono text-cyan-300 mb-2">
          <span className="text-green-400">➜</span> DESCRIPTION
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 bg-black/50 border border-cyan-400/30 rounded-md 
                    text-white font-mono text-sm focus:outline-none focus:border-cyan-400 
                    focus:ring-1 focus:ring-cyan-400 placeholder-gray-500 transition-all duration-300"
          placeholder="Describe your habit (optional)"
          disabled={loading}
        ></textarea>
      </div>
      
      <div>
        <label htmlFor="frequency" className="block text-sm font-mono text-cyan-300 mb-2">
          <span className="text-green-400">➜</span> FREQUENCY
        </label>
        <select
          id="frequency"
          value={frequency}
          onChange={(e) => setFrequency(e.target.value)}
          className="w-full px-3 py-2 bg-black/50 border border-cyan-400/30 rounded-md 
                    text-white font-mono text-sm focus:outline-none focus:border-cyan-400 
                    focus:ring-1 focus:ring-cyan-400 transition-all duration-300"
          disabled={loading}
        >
          <option value="daily">DAILY</option>
          <option value="weekly">WEEKLY</option>
          <option value="monthly">MONTHLY</option>
        </select>
      </div>
      
      <button
        type="submit"
        disabled={loading || !name.trim()}
        className={`w-full py-3 px-4 font-mono text-sm border rounded-lg transition-all duration-300 
                  flex items-center justify-center ${
                    loading || !name.trim()
                      ? 'bg-cyan-400/10 border-cyan-400/30 text-cyan-300/50 cursor-not-allowed'
                      : 'bg-cyan-400/20 border-cyan-400/30 text-cyan-300 hover:bg-cyan-400/30 hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-400/20'
                  }`}
      >
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-cyan-300 border-t-transparent rounded-full animate-spin mr-2"></div>
            INITIALIZING_HABIT...
          </>
        ) : (
          <>
            <span className="mr-2">⚡</span>
            CREATE_HABIT
          </>
        )}
      </button>

      {/* Form Instructions */}
      <div className="text-gray-400 font-mono text-xs pt-2 border-t border-cyan-400/10">
        <span className="text-green-400">$</span> Define your habit parameters above
      </div>
    </form>
  );
};

export default HabitForm;