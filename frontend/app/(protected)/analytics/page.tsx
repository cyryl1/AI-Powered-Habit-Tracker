'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { BASE_URL } from "../../../config";

interface AnalyticsData {
  weeklyCompletions: number[];
  habitDistribution: { name: string; count: number }[];
  bestPerforming: { name: string; streak: number }[];
  performanceMetrics: {
    avgStreak: number;
    successRate: number;
    totalCompletions: number;
    activeDays: number;
  };
}

export default function AnalyticsPage() {
  const { user } = useAuth();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'year'>('week');

  useEffect(() => {
    fetchAnalytics();
  }, [user, timeframe]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}ai/analytics`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: AnalyticsData = await response.json();
      setAnalyticsData(data);
    } catch (err) {
      setError(`Failed to fetch analytics: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoading(false);
    }
  };

  const getTimeframeLabels = () => {
    if (timeframe === 'week') {
      return ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
    } else if (timeframe === 'month') {
      // Group by weeks for monthly view
      return ['W1', 'W2', 'W3', 'W4'];
    } else {
      // Group by quarters for yearly view
      return ['Q1', 'Q2', 'Q3', 'Q4'];
    }
  };

  const getGroupedCompletions = (completions: number[]) => {
    if (timeframe === 'week') {
      return completions; // Keep as-is for weekly
    } else if (timeframe === 'month') {
      // Group 30 days into 4 weeks (7+7+8+8)
      return [
        completions.slice(0, 7).reduce((sum, val) => sum + val, 0),
        completions.slice(7, 14).reduce((sum, val) => sum + val, 0),
        completions.slice(14, 22).reduce((sum, val) => sum + val, 0),
        completions.slice(22, 30).reduce((sum, val) => sum + val, 0)
      ];
    } else {
      // Group 365 days into 4 quarters (91+91+91+92)
      const quarterSize = Math.floor(completions.length / 4);
      return [
        completions.slice(0, quarterSize).reduce((sum, val) => sum + val, 0),
        completions.slice(quarterSize, quarterSize * 2).reduce((sum, val) => sum + val, 0),
        completions.slice(quarterSize * 2, quarterSize * 3).reduce((sum, val) => sum + val, 0),
        completions.slice(quarterSize * 3).reduce((sum, val) => sum + val, 0)
      ];
    }
  };

  const getChartTitle = () => {
    const titles = {
      week: 'WEEKLY_COMPLETIONS',
      month: 'MONTHLY_COMPLETIONS', 
      year: 'YEARLY_COMPLETIONS'
    };
    return titles[timeframe];
  };

  const getTimeframeDescription = () => {
    const descriptions = {
      week: '7-day performance analysis',
      month: '30-day trend analysis (grouped by week)',
      year: 'Annual overview (grouped by quarter)'
    };
    return descriptions[timeframe];
  };

  const getBarWidth = () => {
    const widths = {
      week: 'w-full',
      month: 'w-1/4',
      year: 'w-1/4'
    };
    return widths[timeframe];
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-cyan-300 font-mono text-lg">
          <span className="animate-pulse">LOADING_{timeframe.toUpperCase()}_DATA...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-red-400 font-mono text-lg">
          <span>SYSTEM_ERROR: {error}</span>
        </div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-purple-300 font-mono text-lg">
          <span>NO_DATA_AVAILABLE</span>
        </div>
      </div>
    );
  }

  const { weeklyCompletions, habitDistribution, bestPerforming, performanceMetrics } = analyticsData;

  // Group completions based on timeframe
  const groupedCompletions = getGroupedCompletions(weeklyCompletions);
  const timeframeLabels = getTimeframeLabels();

  // Calculate max values for scaling
  const maxCompletions = Math.max(...groupedCompletions);
  const maxHabitCount = Math.max(...habitDistribution.map(h => h.count), 1);

  const getStreakColor = (streak: number) => {
    if (streak >= 20) return 'text-yellow-300';
    if (streak >= 10) return 'text-green-300';
    if (streak >= 5) return 'text-cyan-300';
    return 'text-orange-300';
  };

  const getSuccessRateColor = (rate: number) => {
    if (rate >= 80) return 'text-green-400';
    if (rate >= 60) return 'text-cyan-400';
    if (rate >= 40) return 'text-yellow-400';
    return 'text-orange-400';
  };

  return (
    <div className="flex-1 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-mono text-cyan-300 mb-2">SYSTEM_ANALYTICS</h1>
          <p className="text-gray-400 font-mono">
            {getTimeframeDescription()}
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

      {/* Performance Metrics Dashboard */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { 
            label: 'SUCCESS_RATE', 
            value: `${performanceMetrics.successRate}%`, 
            color: getSuccessRateColor(performanceMetrics.successRate),
            bg: 'bg-cyan-400/10',
            border: 'border-cyan-400/30',
            icon: '📊'
          },
          { 
            label: 'AVG_STREAK', 
            value: `${performanceMetrics.avgStreak.toFixed(1)}d`, 
            color: 'text-purple-400',
            bg: 'bg-purple-400/10',
            border: 'border-purple-400/30',
            icon: '🔥'
          },
          { 
            label: 'ACTIVE_DAYS', 
            value: performanceMetrics.activeDays, 
            color: 'text-green-400',
            bg: 'bg-green-400/10',
            border: 'border-green-400/30',
            icon: '⚡'
          },
          { 
            label: 'TOTAL_COMPLETIONS', 
            value: performanceMetrics.totalCompletions, 
            color: 'text-orange-400',
            bg: 'bg-orange-400/10',
            border: 'border-orange-400/30',
            icon: '✅'
          }
        ].map((metric, index) => (
          <div 
            key={index} 
            className={`${metric.bg} ${metric.border} border rounded-xl p-4 backdrop-blur-sm hover:scale-105 transition-transform duration-300`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="text-gray-400 font-mono text-xs">
                {metric.label}
              </div>
              <div className="text-lg">{metric.icon}</div>
            </div>
            <div className={`text-2xl font-bold font-mono ${metric.color}`}>
              {metric.value}
            </div>
          </div>
        ))}
      </div>

      {/* Main Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Timeframe Completions Chart */}
        <div className="bg-black/60 border border-cyan-400/30 rounded-xl p-6 backdrop-blur-sm">
          <h2 className="text-lg font-mono text-cyan-300 mb-6 flex items-center">
            <span className="text-green-400 mr-2">📈</span> {getChartTitle()}
          </h2>
          <div className="h-48 flex items-end justify-between space-x-2">
            {groupedCompletions.map((count, index) => (
              <div key={index} className={`${getBarWidth()} flex flex-col items-center space-y-2`}>
                <div className="text-cyan-300 font-mono text-sm">{count}</div>
                <div 
                  className="w-4/5 bg-gradient-to-t from-cyan-400 to-cyan-600 rounded-t transition-all duration-500 hover:from-cyan-300 hover:to-cyan-500 cursor-pointer"
                  style={{ 
                    height: maxCompletions ? `${(count / maxCompletions) * 80}%` : '0%',
                    minHeight: '8px'
                  }}
                  title={`${count} completions`}
                ></div>
                <div className="text-gray-400 font-mono text-xs text-center">
                  {timeframeLabels[index]}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-gray-500 font-mono text-xs text-center">
            {timeframe === 'week' && 'DAILY_BREAKDOWN'}
            {timeframe === 'month' && 'WEEKLY_AGGREGATION'}
            {timeframe === 'year' && 'QUARTERLY_OVERVIEW'}
          </div>
        </div>

        {/* Top Performing Habits */}
        <div className="bg-black/60 border border-green-400/30 rounded-xl p-6 backdrop-blur-sm">
          <h2 className="text-lg font-mono text-green-300 mb-6 flex items-center">
            <span className="text-yellow-400 mr-2">🏆</span> TOP_STREAKS
          </h2>
          <div className="space-y-3">
            {bestPerforming.map((habit, index) => (
              <div key={index} className="flex items-center justify-between p-3 border border-green-400/20 rounded-lg hover:bg-green-400/5 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${
                    index === 0 ? 'bg-yellow-400/20 border-yellow-400/50' :
                    index === 1 ? 'bg-gray-400/20 border-gray-400/50' :
                    'bg-orange-400/20 border-orange-400/50'
                  }`}>
                    <span className={`text-xs font-mono ${
                      index === 0 ? 'text-yellow-300' :
                      index === 1 ? 'text-gray-300' :
                      'text-orange-300'
                    }`}>
                      {index + 1}
                    </span>
                  </div>
                  <div>
                    <div className="text-green-300 font-mono text-sm">{habit.name}</div>
                    <div className="text-gray-400 text-xs">Current streak</div>
                  </div>
                </div>
                <div className={`font-mono text-sm bg-green-400/10 px-2 py-1 rounded ${getStreakColor(habit.streak)}`}>
                  {habit.streak}d
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Habit Distribution */}
        <div className="bg-black/60 border border-purple-400/30 rounded-xl p-6 backdrop-blur-sm">
          <h2 className="text-lg font-mono text-purple-300 mb-6 flex items-center">
            <span className="text-pink-400 mr-2">📊</span> HABIT_DISTRIBUTION
          </h2>
          <div className="space-y-4">
            {habitDistribution.map((habit, index) => {
              const percentage = (habit.count / maxHabitCount) * 100;
              return (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300 font-mono">{habit.name}</span>
                    <span className="text-purple-300 font-mono">{habit.count}</span>
                  </div>
                  <div className="w-full bg-gray-700/30 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-purple-400 to-pink-400 h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Performance Insights */}
        <div className="bg-black/60 border border-orange-400/30 rounded-xl p-6 backdrop-blur-sm">
          <h2 className="text-lg font-mono text-orange-300 mb-6 flex items-center">
            <span className="text-cyan-400 mr-2">⚡</span> {timeframe.toUpperCase()}_INSIGHTS
          </h2>
          <div className="space-y-4">
            <div className="border border-cyan-400/20 rounded-lg p-4">
              <div className="text-cyan-300 font-mono text-sm mb-2">PERFORMANCE_LEVEL</div>
              <div className={`text-lg font-bold ${getSuccessRateColor(performanceMetrics.successRate)} mb-1`}>
                {performanceMetrics.successRate >= 80 ? 'EXCELLENT_CONSISTENCY' :
                 performanceMetrics.successRate >= 60 ? 'SOLID_PERFORMANCE' :
                 performanceMetrics.successRate >= 40 ? 'GOOD_PROGRESS' : 'BUILDING_MOMENTUM'}
              </div>
              <div className="text-gray-400 text-xs">
                {performanceMetrics.successRate}% success rate this {timeframe}
              </div>
            </div>
            
            <div className="border border-green-400/20 rounded-lg p-4">
              <div className="text-green-300 font-mono text-sm mb-2">ACTIVITY_LEVEL</div>
              <div className="text-lg font-bold text-green-400 mb-1">
                {performanceMetrics.activeDays >= 25 ? 'HIGHLY_ACTIVE' :
                 performanceMetrics.activeDays >= 15 ? 'MODERATELY_ACTIVE' :
                 performanceMetrics.activeDays >= 8 ? 'REGULAR_ENGAGEMENT' : 'GETTING_STARTED'}
              </div>
              <div className="text-gray-400 text-xs">
                {performanceMetrics.activeDays} active days this {timeframe}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* System Status Footer */}
      <div className="mt-8 p-6 border border-cyan-400/20 rounded-xl bg-cyan-400/5">
        <div className="text-cyan-300 font-mono text-sm text-center">
          <span className="text-green-400">$</span> SYSTEM_STATUS: ANALYTICS_ACTIVE | TIMEFRAME: {timeframe.toUpperCase()} | LAST_UPDATE: {new Date().toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
}