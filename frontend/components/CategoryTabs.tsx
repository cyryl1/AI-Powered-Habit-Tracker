import { getCategoryColor, getCategoryIcon } from '@/utils/categoryHelpers';

interface Props {
  insights: any[];
  selected: string;
  onSelect: (cat: string) => void;
}

const categories = ['All', 'Pattern', 'Motivation', 'Optimization', 'Behavior'];

export default function CategoryTabs({ insights, selected, onSelect }: Props) {
  return (
    <div className="flex space-x-2 mb-8 overflow-x-auto pb-2">
      {categories.map(cat => {
        const count = cat === 'All' ? insights.length : insights.filter(i => i.category === cat).length;
        const isSelected = selected === cat;
        const color = getCategoryColor(cat);

        return (
          <button
            key={cat}
            onClick={() => onSelect(cat)}
            className={`px-4 py-2 font-mono text-sm border rounded-lg transition-all duration-300
                       whitespace-nowrap flex items-center space-x-2
                       ${isSelected ? `${color.bg} ${color.border} ${color.text}` : 'border-gray-600 text-gray-400 hover:border-cyan-400/50'}`}
          >
            <span>{cat === 'All' ? '🌐' : getCategoryIcon(cat)}</span>
            <span>{cat}</span>
            <span className={`text-xs ${isSelected ? 'text-white' : 'text-gray-500'}`}>({count})</span>
          </button>
        );
      })}
    </div>
  );
}