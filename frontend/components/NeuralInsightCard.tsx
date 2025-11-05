import { getCategoryColor, getCategoryIcon } from '../utils/categoryHelpers';
import { getPrimaryAction } from '../utils/actionExtractor';

interface AIInsight {
  id: string;
  insight: string;
  confidence: number;
  category: string;
  timestamp: string;
}

export default function NeuralInsightCard({ insight, index }: { insight: AIInsight; index: number }) {
  const color = getCategoryColor(insight.category);
  const confColor = insight.confidence >= 85 ? 'from-emerald-400 to-cyan-400'
                 : insight.confidence >= 70 ? 'from-cyan-400 to-indigo-400'
                 : 'from-orange-400 to-pink-400';

  return (
    <div className={`${color.bg} ${color.border} border rounded-2xl p-6 backdrop-blur-xl
                     shadow-2xl shadow-black/20 hover:shadow-cyan-500/10
                     transition-all duration-500 hover:scale-[1.01]
                     relative overflow-hidden`}>
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 via-purple-400 to-pink-400 animate-pulse"/>
      </div>

      <div className="flex items-center justify-between mb-5 relative">
        <div className="flex items-center space-x-4">
          <div className={`w-12 h-12 rounded-xl ${color.bg} border ${color.border}
                          flex items-center justify-center shadow-lg`}>
            <span className="text-2xl">{getCategoryIcon(insight.category)}</span>
          </div>
          <div>
            <div className={`font-bold text-lg ${color.text} font-mono`}>
              {insight.category.toUpperCase()}
            </div>
            <div className="text-xs text-gray-400 font-mono">
              Neural ID: {insight.id.split('-').pop()}
            </div>
          </div>
        </div>

        <div className="text-right">
          <div className="text-xs text-gray-400 font-mono mb-1">NEURAL_CONFIDENCE</div>
          <div className="flex items-center space-x-2">
            <div className="w-24 h-3 bg-gray-800/50 rounded-full overflow-hidden border border-gray-700">
              <div
                className={`h-full bg-gradient-to-r ${confColor} rounded-full shadow-lg relative overflow-hidden
                            transition-all duration-1500 ease-out`}
                style={{ width: `${insight.confidence}%` }}
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse"/>
              </div>
            </div>
            <span className={`font-bold font-mono text-sm ${
              insight.confidence >= 85 ? 'text-emerald-400' :
              insight.confidence >= 70 ? 'text-cyan-400' : 'text-orange-400'
            }`}>
              {insight.confidence}%
            </span>
          </div>
        </div>
      </div>

      <div className="relative">
        <div className="text-white text-lg leading-relaxed font-light mb-5
                        bg-gradient-to-r from-white/90 to-white/70 bg-clip-text text-transparent">
          “{insight.insight}”
        </div>
      </div>

      <div className="border-t border-white/10 pt-4">
        <div className="flex items-center space-x-2 text-cyan-300 font-mono text-sm mb-3">
          <span className="animate-pulse">Lightning</span>
          <span>MICRO-ACTION_REQUIRED</span>
        </div>
        <div className="bg-black/30 rounded-lg p-4 border border-cyan-400/20">
          <p className="text-gray-200 text-sm leading-tight">
            {getPrimaryAction(insight.insight)}
          </p>
        </div>
      </div>

      <div className="flex justify-between items-center mt-5 text-xs font-mono">
        <span className="text-green-400">#0{index + 1}</span>
        <span className="text-gray-500">
          {new Date(insight.timestamp).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric',
          })}
        </span>
      </div>
    </div>
  );
}