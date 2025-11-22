import React from 'react';

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  date_earned: string;
}

interface RewardNotificationProps {
  xpGained: number;
  newLevel?: number;
  newBadges?: Badge[];
  onClose: () => void;
}

export default function RewardNotification({ xpGained, newLevel, newBadges, onClose }: RewardNotificationProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-gray-900 border border-purple-500 rounded-2xl p-8 max-w-md w-full text-center shadow-[0_0_50px_rgba(168,85,247,0.3)] relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-purple-500/10 to-transparent pointer-events-none"></div>
        
        <div className="relative z-10">
          <div className="text-6xl mb-4 animate-bounce">🎉</div>
          
          <h2 className="text-3xl font-bold text-white mb-2 font-mono">
            HABIT COMPLETE!
          </h2>
          
          <div className="text-purple-400 text-xl font-mono mb-6">
            +{xpGained} XP GAINED
          </div>

          {newLevel && (
            <div className="mb-6 p-4 bg-gradient-to-r from-purple-900/50 to-cyan-900/50 rounded-xl border border-purple-500/30 animate-pulse">
              <div className="text-sm text-gray-400 font-mono uppercase">Level Up!</div>
              <div className="text-4xl font-bold text-white">LEVEL {newLevel}</div>
            </div>
          )}

          {newBadges && newBadges.length > 0 && (
            <div className="mb-6">
              <div className="text-sm text-gray-400 font-mono mb-3 uppercase">New Badges Unlocked</div>
              <div className="flex justify-center gap-4">
                {newBadges.map((badge) => (
                  <div key={badge.id} className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-purple-900/30 rounded-full border border-purple-400 flex items-center justify-center text-3xl mb-2 shadow-[0_0_15px_rgba(168,85,247,0.5)]">
                      {badge.icon}
                    </div>
                    <div className="text-xs text-purple-200 font-bold">{badge.name}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={onClose}
            className="mt-4 px-8 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-bold transition-all shadow-lg hover:shadow-purple-500/25"
          >
            CONTINUE
          </button>
        </div>
      </div>
    </div>
  );
}