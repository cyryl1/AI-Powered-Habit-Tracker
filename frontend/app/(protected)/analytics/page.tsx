'use client';

import { useState, useEffect } from 'react';

interface AnalyticsData {
  weeklyCompletions: number[];
  habitDistribution: { name: string; count: number }[];
  bestPerforming: { name: string; streak: number }[];
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'year'>('week');

  useEffect(() => {
    // Mock data - replace with actual API call
    setAnalytics({
      weeklyCompletions: [12, 19, 15, 17, 14, 16, 18],
      habitDistribution: [
        { name: 'Exercise', count: 8 },
        { name: 'Reading', count: 6 },
        { name: 'Meditation', count: 4 },
        { name: 'Coding', count: 3 }
      ],
      bestPerforming: [
        { name: 'Morning Run', streak: 15 },
        { name: 'Daily Reading', streak: 12 },
        { name: 'Meditation', streak: 8 }
      ]
    });
  }, [timeframe]);

  return (
    <div className="flex-1 p-6">
      {/* Timeframe Selector */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <p className="text-gray-400 font-mono">
            Deep dive into your habit performance and patterns
          </p>
        </div>
        <div className="flex space-x-2">
          {['week', 'month', 'year'].map((period) => (
            <button
              key={period}
              onClick={() => setTimeframe(period as any)}
              className={`px-4 py-2 font-mono text-sm border rounded-lg transition-all duration-300 ${
                timeframe === period
                  ? 'bg-cyan-400/20 border-cyan-400 text-cyan-300'
                  : 'border-gray-600 text-gray-400 hover:border-cyan-400/50'
              }`}
            >
              {period.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Completion Trends */}
        <div className="bg-black/60 border border-cyan-400/30 rounded-xl p-6 backdrop-blur-sm">
          <h2 className="text-xl font-mono text-cyan-300 mb-6">
            <span className="text-green-400">📈</span> COMPLETION_TRENDS
          </h2>
          <div className="h-64 flex items-end justify-between space-x-2">
            {analytics?.weeklyCompletions.map((count, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full bg-gradient-to-t from-cyan-400 to-cyan-600 rounded-t transition-all duration-500"
                  style={{ height: `${(count / 20) * 100}%` }}
                ></div>
                <div className="text-gray-400 font-mono text-xs mt-2">
                  {['M', 'T', 'W', 'T', 'F', 'S', 'S'][index]}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Habit Distribution */}
        <div className="bg-black/60 border border-purple-400/30 rounded-xl p-6 backdrop-blur-sm">
          <h2 className="text-xl font-mono text-purple-300 mb-6">
            <span className="text-green-400">📊</span> HABIT_DISTRIBUTION
          </h2>
          <div className="space-y-4">
            {analytics?.habitDistribution.map((habit, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300 font-mono">{habit.name}</span>
                  <span className="text-purple-300 font-mono">{habit.count} times</span>
                </div>
                <div className="w-full bg-gray-700/30 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-purple-400 to-pink-400 h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${(habit.count / 10) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Best Performing */}
        <div className="bg-black/60 border border-green-400/30 rounded-xl p-6 backdrop-blur-sm">
          <h2 className="text-xl font-mono text-green-300 mb-6">
            <span className="text-cyan-400">🏆</span> TOP_PERFORMERS
          </h2>
          <div className="space-y-4">
            {analytics?.bestPerforming.map((habit, index) => (
              <div key={index} className="flex items-center justify-between p-3 border border-green-400/20 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    index === 0 ? 'bg-yellow-400/20 border border-yellow-400/30' :
                    index === 1 ? 'bg-gray-400/20 border border-gray-400/30' :
                    'bg-orange-400/20 border border-orange-400/30'
                  }`}>
                    <span className={`text-xs ${
                      index === 0 ? 'text-yellow-300' :
                      index === 1 ? 'text-gray-300' :
                      'text-orange-300'
                    }`}>
                      #{index + 1}
                    </span>
                  </div>
                  <div>
                    <div className="text-green-300 font-mono text-sm">{habit.name}</div>
                    <div className="text-gray-400 text-xs">Current streak</div>
                  </div>
                </div>
                <div className="text-orange-300 font-mono">{habit.streak} days</div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="bg-black/60 border border-orange-400/30 rounded-xl p-6 backdrop-blur-sm">
          <h2 className="text-xl font-mono text-orange-300 mb-6">
            <span className="text-green-400">⚡</span> PERFORMANCE_METRICS
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'AVG_STREAK', value: '7.2', unit: 'days' },
              { label: 'SUCCESS_RATE', value: '78', unit: '%' },
              { label: 'TOTAL_COMPLETIONS', value: '142', unit: '' },
              { label: 'ACTIVE_DAYS', value: '24', unit: 'days' }
            ].map((metric, index) => (
              <div key={index} className="text-center p-4 border border-orange-400/20 rounded-lg">
                <div className="text-orange-300 text-2xl font-bold mb-1">{metric.value}</div>
                <div className="text-gray-400 font-mono text-xs">{metric.label}</div>
                {metric.unit && <div className="text-gray-500 text-xs">{metric.unit}</div>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}