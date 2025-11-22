'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';

export default function GamificationProfile() {
  const { user } = useAuth();

  if (!user) return null;

  // Calculate XP progress
  // Level N starts at (N-1)*100 XP. Next level at N*100 XP.
  // Current XP in level = Total XP % 100
  const currentLevelXp = (user.xp ?? 0) % 100;
  const nextLevelXp = 100;
  const progress = (currentLevelXp / nextLevelXp) * 100;

  return (
    <div className="bg-black/60 border border-purple-500/30 rounded-xl p-6 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-mono text-purple-300">
            <span className="text-cyan-400">⚡</span> NEURAL_PROFILE
          </h2>
          <p className="text-gray-400 text-xs font-mono mt-1">
            Subject: {user.username}
          </p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-purple-300">LVL {user.level}</div>
          <div className="text-xs text-gray-500 font-mono">RANK: INITIATE</div>
        </div>
      </div>

      {/* XP Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-xs font-mono text-gray-400 mb-2">
          <span>XP: {currentLevelXp} / {nextLevelXp}</span>
          <span>{Math.round(progress)}% TO NEXT LEVEL</span>
        </div>
        <div className="h-3 bg-gray-900 rounded-full overflow-hidden border border-gray-800">
          <div 
            className="h-full bg-gradient-to-r from-purple-600 to-cyan-500 transition-all duration-500 ease-out shadow-[0_0_10px_rgba(168,85,247,0.5)]"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Badges */}
      <div>
        <h3 className="text-sm font-mono text-gray-400 mb-4 border-b border-gray-800 pb-2">
          EARNED_ACHIEVEMENTS
        </h3>
        
        {(!user.badges || user.badges.length === 0) ? (
          <div className="text-center py-4 text-gray-600 text-sm italic">
            No achievements unlocked yet.
            <br/>
            Complete habits to earn badges.
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
            {user.badges.map((badge) => (
              <div key={badge.id} className="group relative flex flex-col items-center">
                <div className="w-12 h-12 rounded-lg bg-purple-900/20 border border-purple-500/30 flex items-center justify-center text-2xl mb-2 group-hover:scale-110 group-hover:border-purple-400 transition-all cursor-help shadow-[0_0_15px_rgba(168,85,247,0.1)]">
                  {badge.icon}
                </div>
                <span className="text-[10px] text-gray-400 font-mono text-center leading-tight">
                  {badge.name}
                </span>
                
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10 w-32">
                  <div className="bg-black border border-purple-500/50 text-gray-200 text-xs p-2 rounded font-mono text-center shadow-xl">
                    <div className="font-bold text-purple-300 mb-1">{badge.name}</div>
                    {badge.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}