'use client';

import CategoryTabs from '@/components/CategoryTabs';
import InsightStats from '@/components/InsightStats';
import EmptyState from '@/components/EmptyState';
import RefreshButton from '@/components/RefreshButton';
import NeuralInsightCard from '@/components/NeuralInsightCard';
import useInsights from '@/hooks/useInsights';
import Loading from '@/components/ui/Loading';

export default function AiInsightsPage() {
  const {
    insights,
    filteredInsights,
    selectedCategory,
    setSelectedCategory,
    loading,
    refreshing,
    refreshInsights,
  } = useInsights();

  if (loading) {
    return <Loading fullScreen text="ANALYZING_NEURAL_PATTERNS..." />;
  }

  return (
    <div className="flex-1 p-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-2xl font-mono text-cyan-300 mb-2">AI_INSIGHTS</h1>
          <p className="text-gray-400 font-mono max-w-2xl">
            Neural analysis of your habit patterns with atomic micro-actions
          </p>
        </div>
        <RefreshButton refreshing={refreshing} onClick={refreshInsights} />
      </div>

      {/* Category Tabs */}
      <CategoryTabs
        insights={insights}
        selected={selectedCategory}
        onSelect={setSelectedCategory}
      />

      {/* Insights Grid */}
      <div className="space-y-8 mt-8">
        {filteredInsights.map((insight, idx) => (
          <NeuralInsightCard key={insight.id} insight={insight} index={idx} />
        ))}
      </div>

      {/* Empty State */}
      {filteredInsights.length === 0 && (
        <EmptyState selectedCategory={selectedCategory} />
      )}

      {/* Stats */}
      {insights.length > 0 && <InsightStats insights={insights} />}
    </div>
  );
}
