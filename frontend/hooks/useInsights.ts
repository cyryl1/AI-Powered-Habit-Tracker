import { useState, useEffect } from 'react';
import { BASE_URL } from "../config";

interface AIInsight {
  id: string;
  insight: string;
  confidence: number;
  category: string;
  timestamp: string;
}

export default function useInsights() {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const fetchInsights = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}ai/insights`, {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });
      if (res.ok) {
        const { insights } = await res.json();
        setInsights(insights ?? []);
      } else {
        setInsights([]);
      }
    } catch (e) {
      console.error(e);
      setInsights([]);
    } finally {
      setLoading(false);
    }
  };

  const refreshInsights = async () => {
    setRefreshing(true);
    await fetchInsights();
    setTimeout(() => setRefreshing(false), 1000);
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  const filteredInsights = selectedCategory === 'All'
    ? insights
    : insights.filter(i => i.category === selectedCategory);

  return {
    insights,
    filteredInsights,
    selectedCategory,
    setSelectedCategory,
    loading,
    refreshing,
    refreshInsights,
  };
}