'use client';

import { useState, useEffect } from 'react';

interface AIInsight {
  id: string;
  insight: string;
  confidence: number;
  category: string;
  timestamp: string;
}

export default function AiInsightsPage() {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/v1/ai/insights', {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        // Transform the data to match our interface
        const formattedInsights = data.insights?.map((insight: string, index: number) => ({
          id: `insight-${index}`,
          insight,
          confidence: Math.floor(Math.random() * 30) + 70, // Mock confidence
          category: ['Pattern', 'Motivation', 'Optimization', 'Behavior'][index % 4],
          timestamp: new Date().toISOString()
        })) || [];
        setInsights(formattedInsights);
      }
    } catch (error) {
      console.error('Error fetching insights:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshInsights = async () => {
    setRefreshing(true);
    await fetchInsights();
    setTimeout(() => setRefreshing(false), 1000);
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Pattern': 'cyan',
      'Motivation': 'green', 
      'Optimization': 'purple',
      'Behavior': 'orange'
    };
    return colors[category as keyof typeof colors] || 'gray';
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-cyan-300 font-mono text-lg">
          <span className="animate-pulse">ANALYZING_NEURAL_PATTERNS...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6">
      {/* Header with Refresh Button */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <p className="text-gray-400 font-mono">
            AI-powered insights into your habit patterns and optimization opportunities
          </p>
        </div>
        <button
          onClick={refreshInsights}
          disabled={refreshing}
          className="px-6 py-3 bg-purple-500/20 border border-purple-400/30 text-purple-300 font-mono rounded-lg hover:bg-purple-500/30 transition-all duration-300 disabled:opacity-50 flex items-center space-x-2"
        >
          {refreshing ? (
            <>
              <div className="w-4 h-4 border-2 border-purple-300 border-t-transparent rounded-full animate-spin"></div>
              <span>ANALYZING...</span>
            </>
          ) : (
            <>
              <span>⟳</span>
              <span>REFRESH_INSIGHTS</span>
            </>
          )}
        </button>
      </div>

      {/* Insights Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {insights.map((insight, index) => (
          <div 
            key={insight.id}
            className="bg-black/60 border border-purple-400/30 rounded-xl p-6 backdrop-blur-sm hover:border-purple-400/50 transition-all duration-300"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`text-${getCategoryColor(insight.category)}-300 font-mono text-sm border border-${getCategoryColor(insight.category)}-400/30 px-3 py-1 rounded-full`}>
                {insight.category}
              </div>
              <div className="text-gray-400 font-mono text-xs">
                CONF: {insight.confidence}%
              </div>
            </div>
            
            <div className="text-purple-300 font-mono text-lg mb-4 leading-relaxed">
              {insight.insight}
            </div>

            <div className="flex justify-between items-center">
              <div className="text-gray-400 font-mono text-xs">
                <span className="text-green-400">#</span> {String(index + 1).padStart(2, '0')}
              </div>
              <div className="w-24 bg-gray-700/30 rounded-full h-2">
                <div 
                  className={`bg-gradient-to-r from-purple-400 to-cyan-400 h-2 rounded-full transition-all duration-1000`}
                  style={{ width: `${insight.confidence}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {insights.length === 0 && (
        <div className="text-center py-16 border-2 border-dashed border-purple-400/20 rounded-xl">
          <div className="text-6xl mb-4 opacity-30">🧠</div>
          <div className="text-purple-300 font-mono text-xl mb-2">NO_INSIGHTS_AVAILABLE</div>
          <div className="text-gray-400 font-mono">
            Complete more habits to generate AI-powered insights
          </div>
        </div>
      )}

      {/* Analysis Footer */}
      <div className="mt-8 p-6 border border-cyan-400/20 rounded-xl bg-cyan-400/5">
        <div className="text-cyan-300 font-mono text-sm text-center">
          <span className="text-green-400">$</span> Neural analysis updates every 24 hours. Patterns become clearer with consistent data.
        </div>
      </div>
    </div>
  );
}