// 'use client';

// import { useState, useEffect } from 'react';

// interface AIInsight {
//   id: string;
//   insight: string;
//   confidence: number;
//   category: string;
//   timestamp: string;
// }

// export default function AiInsightsPage() {
//   const [insights, setInsights] = useState<AIInsight[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [selectedCategory, setSelectedCategory] = useState<string>('All');

//   useEffect(() => {
//     fetchInsights();
//   }, []);

//   const fetchInsights = async () => {
//     setLoading(true);
//     try {
//       console.log('🔄 Starting fetch request to /api/v1/ai/insights');
      
//       const response = await fetch('http://localhost:8000/api/v1/ai/insights', {
//         method: 'GET',
//         credentials: 'include',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });
      
//       console.log('📡 Response status:', response.status);
      
//       if (response.ok) {
//         const data = await response.json();
//         console.log('✅ Insights data received:', data);
//         setInsights(data.insights || []);
//       } else {
//         console.log('❌ Response not OK:', response.status);
//         setInsights([]);
//       }
//     } catch (error) {
//       console.error('💥 Fetch error:', error);
//       setInsights([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const refreshInsights = async () => {
//     setRefreshing(true);
//     await fetchInsights();
//     setTimeout(() => setRefreshing(false), 1000);
//   };

//   const getCategoryColor = (category: string) => {
//     const colors = {
//       'Pattern': { bg: 'bg-cyan-400/20', border: 'border-cyan-400/30', text: 'text-cyan-300' },
//       'Motivation': { bg: 'bg-green-400/20', border: 'border-green-400/30', text: 'text-green-300' },
//       'Optimization': { bg: 'bg-purple-400/20', border: 'border-purple-400/30', text: 'text-purple-300' },
//       'Behavior': { bg: 'bg-orange-400/20', border: 'border-orange-400/30', text: 'text-orange-300' }
//     };
//     return colors[category as keyof typeof colors] || { bg: 'bg-gray-400/20', border: 'border-gray-400/30', text: 'text-gray-300' };
//   };

//   const getCategoryIcon = (category: string) => {
//     const icons = {
//       'Pattern': '🔍',
//       'Motivation': '💪',
//       'Optimization': '⚡',
//       'Behavior': '🔄'
//     };
//     return icons[category as keyof typeof icons] || '💡';
//   };

//   const categories = ['All', 'Pattern', 'Motivation', 'Optimization', 'Behavior'];
//   const filteredInsights = selectedCategory === 'All' 
//     ? insights 
//     : insights.filter(insight => insight.category === selectedCategory);

//   if (loading) {
//     return (
//       <div className="flex-1 flex items-center justify-center">
//         <div className="text-cyan-300 font-mono text-lg">
//           <span className="animate-pulse">ANALYZING_NEURAL_PATTERNS...</span>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex-1 p-6">
//       {/* Header */}
//       <div className="flex justify-between items-start mb-8">
//         <div>
//           <h1 className="text-2xl font-mono text-cyan-300 mb-2">AI_INSIGHTS</h1>
//           <p className="text-gray-400 font-mono max-w-2xl">
//             Neural analysis of your habit patterns with actionable recommendations
//           </p>
//         </div>
//         <button
//           onClick={refreshInsights}
//           disabled={refreshing}
//           className="px-6 py-3 bg-purple-500/20 border border-purple-400/30 text-purple-300 font-mono rounded-lg hover:bg-purple-500/30 transition-all duration-300 disabled:opacity-50 flex items-center space-x-2"
//         >
//           {refreshing ? (
//             <>
//               <div className="w-4 h-4 border-2 border-purple-300 border-t-transparent rounded-full animate-spin"></div>
//               <span>ANALYZING...</span>
//             </>
//           ) : (
//             <>
//               <span>⟳</span>
//               <span>REFRESH_INSIGHTS</span>
//             </>
//           )}
//         </button>
//       </div>

//       {/* Category Filter */}
//       <div className="flex space-x-2 mb-8 overflow-x-auto pb-2">
//         {categories.map((category) => {
//           const count = category === 'All' ? insights.length : insights.filter(i => i.category === category).length;
//           const isSelected = selectedCategory === category;
//           const color = getCategoryColor(category);
          
//           return (
//             <button
//               key={category}
//               onClick={() => setSelectedCategory(category)}
//               className={`px-4 py-2 font-mono text-sm border rounded-lg transition-all duration-300 whitespace-nowrap flex items-center space-x-2 ${
//                 isSelected 
//                   ? `${color.bg} ${color.border} ${color.text}`
//                   : 'border-gray-600 text-gray-400 hover:border-cyan-400/50'
//               }`}
//             >
//               <span>{category === 'All' ? '🌐' : getCategoryIcon(category)}</span>
//               <span>{category}</span>
//               <span className={`text-xs ${isSelected ? 'text-white' : 'text-gray-500'}`}>
//                 ({count})
//               </span>
//             </button>
//           );
//         })}
//       </div>

//       {/* Insights Grid */}
//       <div className="space-y-6">
//         {filteredInsights.map((insight, index) => {
//           const color = getCategoryColor(insight.category);
//           const confidenceColor = insight.confidence >= 80 ? 'from-green-400 to-cyan-400' :
//                                 insight.confidence >= 70 ? 'from-cyan-400 to-purple-400' :
//                                 'from-orange-400 to-pink-400';

//           return (
//             <div 
//               key={insight.id}
//               className={`${color.bg} ${color.border} border rounded-xl p-6 backdrop-blur-sm hover:scale-[1.02] transition-all duration-300`}
//             >
//               <div className="flex items-start justify-between mb-4">
//                 <div className="flex items-center space-x-3">
//                   <div className={`w-10 h-10 rounded-lg ${color.bg} border ${color.border} flex items-center justify-center`}>
//                     <span className="text-lg">{getCategoryIcon(insight.category)}</span>
//                   </div>
//                   <div>
//                     <div className={`font-mono text-sm ${color.text}`}>
//                       {insight.category}
//                     </div>
//                     <div className="text-gray-400 font-mono text-xs">
//                       ID: {insight.id.replace('insight-', '')}
//                     </div>
//                   </div>
//                 </div>
                
//                 {/* Confidence Meter */}
//                 <div className="text-right">
//                   <div className="text-gray-400 font-mono text-xs mb-1">
//                     CONFIDENCE
//                   </div>
//                   <div className="flex items-center space-x-2">
//                     <div className="w-20 bg-gray-700/30 rounded-full h-2">
//                       <div 
//                         className={`bg-gradient-to-r ${confidenceColor} h-2 rounded-full transition-all duration-1000`}
//                         style={{ width: `${insight.confidence}%` }}
//                       ></div>
//                     </div>
//                     <div className={`font-mono text-sm ${
//                       insight.confidence >= 80 ? 'text-green-400' :
//                       insight.confidence >= 70 ? 'text-cyan-400' : 'text-orange-400'
//                     }`}>
//                       {insight.confidence}%
//                     </div>
//                   </div>
//                 </div>
//               </div>
              
//               {/* Insight Text */}
//               <div className="text-white text-lg leading-relaxed mb-4">
//                 {insight.insight}
//               </div>

//               {/* Action Items - Extract actionable parts */}
//               <div className="border-t border-white/10 pt-4">
//                 <div className="text-cyan-300 font-mono text-sm mb-2">
//                   💡 ACTIONABLE_STEPS:
//                 </div>
//                 <ul className="text-gray-300 space-y-1 text-sm">
//                   {extractActionItems(insight.insight).map((action, actionIndex) => (
//                     <li key={actionIndex} className="flex items-start space-x-2">
//                       <span className="text-green-400 mt-1">▶</span>
//                       <span>{action}</span>
//                     </li>
//                   ))}
//                 </ul>
//               </div>

//               <div className="flex justify-between items-center mt-4 pt-4 border-t border-white/10">
//                 <div className="text-gray-400 font-mono text-xs">
//                   <span className="text-green-400">#</span> {String(index + 1).padStart(2, '0')}
//                 </div>
//                 <div className="text-gray-500 font-mono text-xs">
//                   {new Date(insight.timestamp).toLocaleDateString()}
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       {filteredInsights.length === 0 && (
//         <div className="text-center py-16 border-2 border-dashed border-purple-400/20 rounded-xl">
//           <div className="text-6xl mb-4 opacity-30">🧠</div>
//           <div className="text-purple-300 font-mono text-xl mb-2">NO_INSIGHTS_AVAILABLE</div>
//           <div className="text-gray-400 font-mono max-w-md mx-auto">
//             {selectedCategory === 'All' 
//               ? "Complete more habits to generate AI-powered insights about your patterns and behaviors."
//               : `No ${selectedCategory.toLowerCase()} insights available. Try another category or complete more habits.`
//             }
//           </div>
//         </div>
//       )}

//       {/* Summary Stats */}
//       {insights.length > 0 && (
//         <div className="mt-8 p-6 border border-cyan-400/20 rounded-xl bg-cyan-400/5">
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
//             <div>
//               <div className="text-cyan-300 font-mono text-2xl mb-1">{insights.length}</div>
//               <div className="text-gray-400 font-mono text-xs">TOTAL_INSIGHTS</div>
//             </div>
//             <div>
//               <div className="text-green-300 font-mono text-2xl mb-1">
//                 {Math.max(...insights.map(i => i.confidence))}%
//               </div>
//               <div className="text-gray-400 font-mono text-xs">HIGHEST_CONFIDENCE</div>
//             </div>
//             <div>
//               <div className="text-purple-300 font-mono text-2xl mb-1">
//                 {categories.filter(cat => cat !== 'All').length}
//               </div>
//               <div className="text-gray-400 font-mono text-xs">CATEGORIES</div>
//             </div>
//             <div>
//               <div className="text-orange-300 font-mono text-2xl mb-1">
//                 {new Date().getHours().toString().padStart(2, '0')}:{new Date().getMinutes().toString().padStart(2, '0')}
//               </div>
//               <div className="text-gray-400 font-mono text-xs">LAST_ANALYSIS</div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// // Helper function to extract actionable items from insight text
// function extractActionItems(insight: string): string[] {
//   const actions: string[] = [];
  
//   // Look for actionable phrases
//   if (insight.includes('log your completion *daily*')) {
//     actions.push('Log completion daily to build actual streaks');
//   }
//   if (insight.includes('micro-habits') || insight.includes('5 minutes')) {
//     actions.push('Start with 5-minute versions of your habits');
//   }
//   if (insight.includes('specific time and location')) {
//     actions.push('Schedule your habit at a fixed time and place');
//   }
//   if (insight.includes('daily action, not perfection')) {
//     actions.push('Focus on consistency over perfection');
//   }
//   if (insight.includes('first completion')) {
//     actions.push('Aim for that very first completion this week');
//   }
  
//   // Fallback if no specific actions detected
//   if (actions.length === 0) {
//     actions.push('Review this insight and identify one small step to take today');
//   }
  
//   return actions;
// }

'use client';

import CategoryTabs from '@/components/CategoryTabs';
import InsightStats from '@/components/InsightStats';
import EmptyState from '@/components/EmptyState';
import RefreshButton from '@/components/RefreshButton';
import NeuralInsightCard from '@/components/NeuralInsightCard';
import useInsights from '@/hooks/useInsights';

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
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-cyan-300 font-mono text-lg animate-pulse">
          ANALYZING_NEURAL_PATTERNS...
        </div>
      </div>
    );
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
