export const getCategoryColor = (category: string) => {
  const map: Record<string, { bg: string; border: string; text: string }> = {
    Pattern:     { bg: 'bg-cyan-400/20',     border: 'border-cyan-400/30',     text: 'text-cyan-300' },
    Motivation:  { bg: 'bg-green-400/20',    border: 'border-green-400/30',    text: 'text-green-300' },
    Optimization:{ bg: 'bg-purple-400/20',   border: 'border-purple-400/30',   text: 'text-purple-300' },
    Behavior:    { bg: 'bg-orange-400/20',   border: 'border-orange-400/30',   text: 'text-orange-300' },
  };
  return map[category] ?? { bg: 'bg-gray-400/20', border: 'border-gray-400/30', text: 'text-gray-300' };
};

export const getCategoryIcon = (category: string) => {
  const map: Record<string, string> = {
    Pattern: '🔍',
    Motivation: '💪',
    Optimization: '⚡',
    Behavior: '🔄',
  };
  return map[category] ?? '💡';
};