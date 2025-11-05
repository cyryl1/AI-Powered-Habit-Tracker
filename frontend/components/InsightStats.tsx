export default function InsightStats({ insights }: { insights: any[] }) {
  return (
    <div className="mt-8 p-6 border border-cyan-400/20 rounded-xl bg-cyan-400/5">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div>
          <div className="text-cyan-300 font-mono text-2xl mb-1">{insights.length}</div>
          <div className="text-gray-400 font-mono text-xs">TOTAL_INSIGHTS</div>
        </div>
        <div>
          <div className="text-green-300 font-mono text-2xl mb-1">
            {Math.max(...insights.map(i => i.confidence))}%
          </div>
          <div className="text-gray-400 font-mono text-xs">HIGHEST_CONFIDENCE</div>
        </div>
        <div>
          <div className="text-purple-300 font-mono text-2xl mb-1">4</div>
          <div className="text-gray-400 font-mono text-xs">CATEGORIES</div>
        </div>
        <div>
          <div className="text-orange-300 font-mono text-2xl mb-1">
            {new Date().getHours().toString().padStart(2, '0')}:{new Date().getMinutes().toString().padStart(2, '0')}
          </div>
          <div className="text-gray-400 font-mono text-xs">LAST_ANALYSIS</div>
        </div>
      </div>
    </div>
  );
}