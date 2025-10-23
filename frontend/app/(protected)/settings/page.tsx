'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const [notifications, setNotifications] = useState(true);
  const [aiInsights, setAiInsights] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [saving, setSaving] = useState(false);

  const handleSaveSettings = async () => {
    setSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaving(false);
  };

  return (
    <div className="flex-1 p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Settings */}
          <div className="bg-black/60 border border-cyan-400/30 rounded-xl p-6 backdrop-blur-sm">
            <h2 className="text-xl font-mono text-cyan-300 mb-6">
              <span className="text-green-400">👤</span> PROFILE_SETTINGS
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-cyan-300 font-mono text-sm mb-2">
                  DISPLAY_NAME
                </label>
                <input
                  type="text"
                  defaultValue={user?.name || ''}
                  className="w-full px-3 py-2 bg-black/50 border border-cyan-400/30 rounded-md text-white font-mono focus:border-cyan-400 focus:outline-none"
                  placeholder="Enter display name"
                />
              </div>
              <div>
                <label className="block text-cyan-300 font-mono text-sm mb-2">
                  EMAIL
                </label>
                <input
                  type="email"
                  defaultValue={user?.email || ''}
                  className="w-full px-3 py-2 bg-black/50 border border-cyan-400/30 rounded-md text-white font-mono focus:border-cyan-400 focus:outline-none"
                  placeholder="Enter email"
                />
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="bg-black/60 border border-purple-400/30 rounded-xl p-6 backdrop-blur-sm">
            <h2 className="text-xl font-mono text-purple-300 mb-6">
              <span className="text-green-400">🔔</span> NOTIFICATION_SETTINGS
            </h2>
            <div className="space-y-4">
              {[
                { label: 'HABIT_REMINDERS', description: 'Daily habit completion reminders', value: notifications, onChange: setNotifications },
                { label: 'AI_INSIGHTS', description: 'Weekly AI-powered insights', value: aiInsights, onChange: setAiInsights },
                { label: 'STREAK_ALERTS', description: 'Notifications for streak milestones', value: true, onChange: () => {} }
              ].map((setting, index) => (
                <div key={index} className="flex items-center justify-between py-3 border-b border-gray-700/30 last:border-0">
                  <div>
                    <div className="text-gray-300 font-mono text-sm">{setting.label}</div>
                    <div className="text-gray-500 text-xs">{setting.description}</div>
                  </div>
                  <button
                    onClick={() => setting.onChange(!setting.value)}
                    className={`w-12 h-6 rounded-full transition-all duration-300 ${
                      setting.value ? 'bg-green-400' : 'bg-gray-600'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white transition-all duration-300 ${
                      setting.value ? 'translate-x-7' : 'translate-x-1'
                    }`}></div>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* AI Settings */}
          <div className="bg-black/60 border border-green-400/30 rounded-xl p-6 backdrop-blur-sm">
            <h2 className="text-xl font-mono text-green-300 mb-6">
              <span className="text-cyan-400">🧠</span> AI_PREFERENCES
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-green-300 font-mono text-sm mb-2">
                  INSIGHT_FREQUENCY
                </label>
                <select className="w-full px-3 py-2 bg-black/50 border border-green-400/30 rounded-md text-white font-mono focus:border-green-400 focus:outline-none">
                  <option>DAILY</option>
                  <option>WEEKLY</option>
                  <option>MONTHLY</option>
                </select>
              </div>
              <div>
                <label className="block text-green-300 font-mono text-sm mb-2">
                  ANALYSIS_DEPTH
                </label>
                <select className="w-full px-3 py-2 bg-black/50 border border-green-400/30 rounded-md text-white font-mono focus:border-green-400 focus:outline-none">
                  <option>BASIC</option>
                  <option>ADVANCED</option>
                  <option>DEEP_ANALYSIS</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Appearance */}
          <div className="bg-black/60 border border-orange-400/30 rounded-xl p-6 backdrop-blur-sm">
            <h2 className="text-xl font-mono text-orange-300 mb-6">
              <span className="text-green-400">🎨</span> APPEARANCE
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-300 font-mono text-sm">DARK_MODE</span>
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className={`w-12 h-6 rounded-full transition-all duration-300 ${
                    darkMode ? 'bg-orange-400' : 'bg-gray-600'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-all duration-300 ${
                    darkMode ? 'translate-x-7' : 'translate-x-1'
                  }`}></div>
                </button>
              </div>
              <div>
                <label className="block text-orange-300 font-mono text-sm mb-2">
                  THEME
                </label>
                <select className="w-full px-3 py-2 bg-black/50 border border-orange-400/30 rounded-md text-white font-mono focus:border-orange-400 focus:outline-none">
                  <option>CYBERPUNK</option>
                  <option>MATRIX</option>
                  <option>NEON</option>
                </select>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-black/60 border border-red-400/30 rounded-xl p-6 backdrop-blur-sm">
            <h2 className="text-xl font-mono text-red-300 mb-6">
              <span className="text-green-400">⚡</span> QUICK_ACTIONS
            </h2>
            <div className="space-y-3">
              <button
                onClick={handleSaveSettings}
                disabled={saving}
                className="w-full py-3 bg-cyan-400/20 border border-cyan-400/30 text-cyan-300 font-mono rounded-lg hover:bg-cyan-400/30 transition-all duration-300 disabled:opacity-50 flex items-center justify-center"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-cyan-300 border-t-transparent rounded-full animate-spin mr-2"></div>
                    SAVING...
                  </>
                ) : (
                  'SAVE_SETTINGS'
                )}
              </button>
              
              <button className="w-full py-3 bg-purple-400/20 border border-purple-400/30 text-purple-300 font-mono rounded-lg hover:bg-purple-400/30 transition-all duration-300">
                EXPORT_DATA
              </button>
              
              <button 
                onClick={logout}
                className="w-full py-3 bg-red-400/20 border border-red-400/30 text-red-300 font-mono rounded-lg hover:bg-red-400/30 transition-all duration-300"
              >
                LOGOUT_SYSTEM
              </button>
            </div>
          </div>

          {/* System Info */}
          <div className="bg-black/60 border border-gray-400/30 rounded-xl p-6 backdrop-blur-sm">
            <h2 className="text-xl font-mono text-gray-300 mb-6">
              <span className="text-green-400">ℹ️</span> SYSTEM_INFO
            </h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">VERSION</span>
                <span className="text-gray-300">v2.1.3</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">USER_ID</span>
                <span className="text-gray-300">{user?._id?.slice(0, 8)}...</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">LAST_SYNC</span>
                <span className="text-gray-300">Just now</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}