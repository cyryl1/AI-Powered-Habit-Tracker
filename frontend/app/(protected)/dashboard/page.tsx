'use client';

import { useAuth } from '@/context/AuthContext';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { BASE_URL } from "../../../config";
import ConsistencyHeatmap from '@/components/features/ConsistencyHeatmap';
import GamificationProfile from '@/components/features/GamificationProfile';
import Loading from '@/components/ui/Loading';

interface Habit {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  frequency: string;
  created_at: string;
  updated_at: string;
  streak: number;
  last_completed: string | null;
  completion_history: string[];
}

interface DashboardStats {
  total_habits: number;
  completed_today: number;
  highest_streak: number;
  completion_rate: number;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [habits, setHabits] = useState<Habit[]>([]); // New state for habits
  const [loading, setLoading] = useState(true);


  const fetchDashboardStats = async () => {
    try {
      const response = await fetch(`${BASE_URL}habits/stats/summary`, {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchHabits = useCallback(async () => {
    try {
      const response = await fetch(`${BASE_URL}habits/`, {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setHabits(data);
      }
    } catch (error) {
      console.error('Error fetching habits:', error);
    }
  }, []);

  useEffect(() => {
    fetchDashboardStats();
    fetchHabits(); // Fetch habits as well
  }, [fetchHabits]);

  if (loading) {
    return <Loading fullScreen text="LOADING_NEURAL_DATA..." />;
  }

  return (
    <div className="flex-1 p-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { 
            label: 'ACTIVE_PROTOCOLS', 
            value: stats?.total_habits || 0, 
            color: 'cyan',
            icon: '💪',
            description: 'Total habits'
          },
          { 
            label: 'COMPLETED_TODAY', 
            value: stats?.completed_today || 0, 
            color: 'green',
            icon: '✅',
            description: 'Daily completions'
          },
          { 
            label: 'PEAK_STREAK', 
            value: stats?.highest_streak || 0, 
            color: 'purple',
            icon: '🔥',
            description: 'Longest streak'
          },
          { 
            label: 'SUCCESS_RATE', 
            value: `${stats?.completion_rate || 0}%`, 
            color: 'orange',
            icon: '📊',
            description: 'Weekly completion'
          }
        ].map((stat, index) => (
          <div key={index} className={`bg-black/60 border border-${stat.color}-400/30 rounded-xl p-6 backdrop-blur-sm hover:border-${stat.color}-400/50 transition-all duration-300`}>
            <div className="flex items-center justify-between mb-4">
              <div className={`text-${stat.color}-300 text-2xl`}>{stat.icon}</div>
              <div className={`text-${stat.color}-300 font-mono text-sm`}>{stat.label}</div>
            </div>
            <div className={`text-3xl font-bold text-${stat.color}-300 mb-2`}>{stat.value}</div>
            <div className="text-gray-400 font-mono text-xs">{stat.description}</div>
          </div>
        ))}
      </div>

      {/* Gamification Profile */}
      <div className="mb-8">
        <GamificationProfile />
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Quick Actions */}
        <div className="bg-black/60 border border-cyan-400/30 rounded-xl p-6 backdrop-blur-sm">
          <h2 className="text-xl font-mono text-cyan-300 mb-6">
            <span className="text-green-400">⚡</span> QUICK_ACTIONS
          </h2>
          <div className="space-y-4">
            <Link 
              href="/habits" 
              className="flex items-center justify-between p-4 border border-cyan-400/20 rounded-lg hover:border-cyan-400/40 hover:bg-cyan-400/10 transition-all duration-300 group"
            >
              <div className="flex items-center space-x-3">
                <span className="text-cyan-300 text-xl">+</span>
                <div>
                  <div className="text-cyan-300 font-mono text-sm">CREATE_HABIT</div>
                  <div className="text-gray-400 text-xs">Initialize new protocol</div>
                </div>
              </div>
              <span className="text-cyan-300 group-hover:text-green-400 transition-colors">→</span>
            </Link>
            
            <Link 
              href="/ai-insights" 
              className="flex items-center justify-between p-4 border border-purple-400/20 rounded-lg hover:border-purple-400/40 hover:bg-purple-400/10 transition-all duration-300 group"
            >
              <div className="flex items-center space-x-3">
                <span className="text-purple-300 text-xl">🧠</span>
                <div>
                  <div className="text-purple-300 font-mono text-sm">AI_ANALYSIS</div>
                  <div className="text-gray-400 text-xs">Get neural insights</div>
                </div>
              </div>
              <span className="text-purple-300 group-hover:text-green-400 transition-colors">→</span>
            </Link>
          </div>
        </div>

        {/* System Status */}
        {/* <div className="bg-black/60 border border-green-400/30 rounded-xl p-6 backdrop-blur-sm">
          <h2 className="text-xl font-mono text-green-300 mb-6">
            <span className="text-cyan-400">🔧</span> SYSTEM_STATUS
          </h2>
          <div className="space-y-4">
            {[
              { label: 'NEURAL_NETWORK', status: 'OPTIMAL', color: 'green' },
              { label: 'DATA_STREAMS', status: 'SYNCED', color: 'cyan' },
              { label: 'AI_ENGINE', status: 'ACTIVE', color: 'purple' },
              { label: 'SECURITY_PROTOCOL', status: 'ENABLED', color: 'green' }
            ].map((item, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-b border-gray-700/30 last:border-0">
                <span className="text-gray-400 font-mono text-sm">{item.label}</span>
                <span className={`text-${item.color}-300 font-mono text-xs border border-${item.color}-400/30 px-3 py-1 rounded-full`}>
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div> */}

         {/* System Status - Now Habit List */}
         <div className="bg-black/60 border border-green-400/30 rounded-xl p-6 backdrop-blur-sm">
           <h2 className="text-xl font-mono text-green-300 mb-6">
             <span className="text-cyan-400">🎯</span> ACTIVE_PROTOCOLS
           </h2>
           <div className="space-y-4">
             {habits.length > 0 ? (
               habits.map((habit) => (
                 <div key={habit.id} className="flex justify-between items-center py-2 border-b border-gray-700/30 last:border-0">
                   <span className="text-gray-400 font-mono text-sm">{habit.name}</span>
                   <span className="text-green-300 font-mono text-xs border border-green-400/30 px-3 py-1 rounded-full">
                     {habit.frequency.toUpperCase()}
                   </span>
                 </div>
               ))
             ) : (
               <div className="text-gray-500 font-mono text-sm text-center">
                 NO_ACTIVE_PROTOCOLS_FOUND.
                 <Link href="/habits" className="text-cyan-400 hover:underline ml-1">CREATE_NEW?</Link>
               </div>
             )}
           </div>
         </div>
       </div>

       {/* Motivation Quote */}
      <div className="mt-8 p-6 border border-cyan-400/20 rounded-xl bg-cyan-400/5">
        <div className="text-cyan-300 font-mono text-sm text-center">
          <span className="text-green-400">$</span> "Consistency is the language of mastery. Every completed habit rewires your neural pathways."
        </div>
      </div>

      {/* Heatmap Section */}
      <div className="mt-8">
        <ConsistencyHeatmap />
      </div>
    </div>
  );
}