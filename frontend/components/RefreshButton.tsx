export default function RefreshButton({ refreshing, onClick }: { refreshing: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      disabled={refreshing}
      className="relative overflow-hidden px-6 py-3 bg-gradient-to-r from-purple-600/30 to-cyan-600/30
                 border border-purple-400/40 text-purple-300 font-mono rounded-xl
                 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-500
                 disabled:opacity-50 group"
    >
      <span className="relative z-10 flex items-center space-x-2">
        {refreshing ? (
          <>
            <div className="w-4 h-4 border-2 border-purple-300 border-t-transparent rounded-full animate-spin"/>
            <span>NEURAL_RECALIBRATION...</span>
          </>
        ) : (
          <>
            <span>⟳</span>
            <span>REGENERATE_INSIGHTS</span>
          </>
        )}
      </span>
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-purple-400/20
                      translate-x-[-100%] group-hover:translate-x-full transition-transform duration-1000"/>
    </button>
  );
}